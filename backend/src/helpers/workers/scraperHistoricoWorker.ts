import { Worker, Queue, Job } from 'bullmq'; // Importamos directamente Worker y Queue
import { spawn, ChildProcessWithoutNullStreams } from 'child_process';
import serverInstance from '../..';
import HistoricosExpedientesDAO from '../../dao/historicosExpedientes.dao';
import ConnectionDatabaseService from '../../db/connections'
import { IScraperHistoricoJobData, IScraperHistoricoResult } from '../../interfaces/workers/scraperHistoricoWorker.interface';
import loggerService from '../loggerService';
import EmailService from '../email';
import { IScrapersErrorData } from '../../interfaces/workers/scrapersWorkers.interface';

class ScraperHistoricoWorker {
  private static instance: ScraperHistoricoWorker;
  private queue: Queue<IScraperHistoricoJobData>;
  private worker: Worker<IScraperHistoricoJobData, IScraperHistoricoResult>;

  private constructor() {
    this.queue = new Queue('scraperHistoricoQueue', { connection: ConnectionDatabaseService.getConnectionRedis() });
    this.worker = new Worker('scraperHistoricoQueue', this.processJob.bind(this), { connection: ConnectionDatabaseService.getConnectionRedis() });

    this.worker.on('completed', this.onCompleted.bind(this));
    this.worker.on('failed', this.onFailed.bind(this));
  }

  public static getInstance(): ScraperHistoricoWorker{
    if(!ScraperHistoricoWorker.instance){
      ScraperHistoricoWorker.instance = new ScraperHistoricoWorker();
    }
    return ScraperHistoricoWorker.instance;
  }

  private async processJob(job: Job<IScraperHistoricoJobData>): Promise<IScraperHistoricoResult> {
    const { ultimosHistoricos } = job.data;

    if (job.data.clientId) {
      const { clientId } = job.data;
      serverInstance.broadcast({
        msg: "Escraper Historico Iniciado",
        data: ultimosHistoricos,
        buttonEnableHistorico: false,
        tipo: "info"
      });
    }

    return new Promise<IScraperHistoricoResult>((resolve, reject) => {
      const pythonProcess: ChildProcessWithoutNullStreams = spawn('python3', ["src/scrapper/scrapperHistorico/mainVidoc.py"]);

      let output: string = '';
      let outputError: string = '';
      let errorResponse: IScrapersErrorData;

      pythonProcess.stdout.on('data', (data) => {
        const dataString = data.toString();
        output += dataString.replace(/'/g, '"');
      });

      pythonProcess.stderr.on('data', (data) => {
        const dataErrorString = data.toString();
        outputError += dataErrorString.replace(/\s+/g, ' ');
      });

      pythonProcess.on('close', (code: number) => {
        if (code !== 0) {
          errorResponse = { code: code, error: outputError, scraperName: "Scraper Historico" };
          return reject(new Error(JSON.stringify(errorResponse)));
        }

        try {
          console.log("try");
          console.log(output);
          const parsedOutput = JSON.parse(output);
          return resolve(parsedOutput);
        } catch (error: any) {
          console.log('catch');
          errorResponse = { code: code, error: `${error.message}`, scraperName: "Scraper Historico" };
          return reject(new Error(JSON.stringify(errorResponse)));
        }
      });

      pythonProcess.stdin.write(JSON.stringify(ultimosHistoricos));
      pythonProcess.stdin.end();
    });
  }

  private async onCompleted(job: Job<IScraperHistoricoJobData>, result: IScraperHistoricoResult): Promise<void> {
    loggerService.log('info', `Job ${job.id}, scraper Historico, completed successfully`);

    const { correctos } = result;

    // Registrar los historicos en la base de datos
    await HistoricosExpedientesDAO.createHistoricoScraped(correctos);

    if (job.data.clientId) {
      const { clientId } = job.data;
      serverInstance.broadcast({
        msg: "Escraper historico finalizado sin problemas",
        data: result,
        buttonEnableHistorico: true,
        tipo: "exito"
      });
    }

  }

  private async onFailed(job: Job<IScraperHistoricoJobData> | undefined, err: Error): Promise<void> {
    let errorData: IScrapersErrorData;
    try {
      errorData = JSON.parse(err.message);
    } catch (error) {
      errorData = { code: 1, error: err.message, scraperName: "Scraper Historico" };
    }

    if (job) {
      console.error(`Job ${job.id}, scraper Historico, failed with error ${errorData.error}`);

      if (job.data.clientId) {
        const { clientId } = job.data;
        serverInstance.broadcast({
          msg: "Hubo un problema con el scraper historico",
          data: errorData,
          buttonEnableHistorico: true,
          tipo: "error"
        });
      }
    }

    // Enviar el email del error
    await EmailService.sendEmailScrapersError(errorData);

  }

  public addJob(nameTask:string, data:IScraperHistoricoJobData){
    this.queue.add(nameTask,data)
  }

  public async queueStatus(): Promise<boolean> {
    const activeJobs = await this.queue.getActiveCount();
    return !(activeJobs > 0);
  }

}

export default ScraperHistoricoWorker.getInstance();
