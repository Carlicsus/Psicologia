import { Worker, Queue, Job } from 'bullmq';
import { spawn, ChildProcessWithoutNullStreams } from 'child_process';
import EmailService from '../email';
import serverInstance from '../..';
import ExpedientesDAO from '../../dao/expedientes.dao';
import InstitutosDAO from '../../dao/institutos.dao';
import InventoresDAO from '../../dao/inventores.dao';
import InventoresExpedientesDAO from '../../dao/inventoresExpedientes.dao';
import SolicitantesExpedientesDAO from '../../dao/solicitantesExpedientes.dao';
import ConnectionDatabaseService from '../../db/connections';
import { IScraperSeederJobData, IScraperSeederResult } from '../../interfaces/workers/scraperSeederWorker.interface';
import { IScrapersErrorData } from '../../interfaces/workers/scrapersWorkers.interface';
import loggerService from '../loggerService';

class ScraperSeederWorker {

  private static instance: ScraperSeederWorker;
  private queue: Queue<IScraperSeederJobData>;
  private worker: Worker<IScraperSeederJobData, IScraperSeederResult>;

  private constructor() {
    this.queue = new Queue('scraperSeederQueue', { connection: ConnectionDatabaseService.getConnectionRedis() });
    this.worker = new Worker('scraperSeederQueue', this.processJob.bind(this), { connection: ConnectionDatabaseService.getConnectionRedis() });

    this.worker.on('completed', this.onCompleted.bind(this));
    this.worker.on('failed', this.onFailed.bind(this));
  }

  public static getInstance(): ScraperSeederWorker{
    if(!ScraperSeederWorker.instance){
      ScraperSeederWorker.instance = new ScraperSeederWorker();
    }
    return ScraperSeederWorker.instance;
  }

  private async processJob(job: Job<IScraperSeederJobData>): Promise<IScraperSeederResult> {
    const { expedientesPendientes } = job.data;

    if (job.data.clientId) {
      const { clientId } = job.data;
      serverInstance.broadcast({
        msg: "Escraper Seeder Iniciado",
        data: expedientesPendientes,
        buttonEnable: false,
        tipo: "info"
      });
    }

    return new Promise<IScraperSeederResult>((resolve, reject) => {
      const pythonProcess: ChildProcessWithoutNullStreams = spawn('python3', ["src/scrapper/scrapperSeeder/main.py"]);

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
          errorResponse = { code: code, error: outputError, scraperName: "Scraper Seeder" };
          return reject(new Error(JSON.stringify(errorResponse)));
        }

        try {
          const parsedOutput = JSON.parse(output);
          return resolve(parsedOutput);
        } catch (error: any) {
          errorResponse = { code: code, error: `${error.message}`, scraperName: "Scraper Seeder" };
          return reject(new Error(JSON.stringify(errorResponse)));
        }
      });

      pythonProcess.stdin.write(JSON.stringify(expedientesPendientes));
      pythonProcess.stdin.end();
    });
  }

  private async onCompleted(job: Job<IScraperSeederJobData>, result: IScraperSeederResult): Promise<void> {
    loggerService.log('info', `Job ${job.id}, scraper Seeder, completed successfully`);

    const { correctos } = result;

    // Actualizar los registros en la base de datos
    await ExpedientesDAO.updateExpedientesPendientes(correctos);

    for(const expediente of correctos){
      loggerService.log('info', `Procesando la informacion del expediente '${expediente.noExpediente}'`);
      for(const solicitante of expediente.solicitantes){
        // Buscar o crear el instituto si no existe
        let instituto = await InstitutosDAO.findSimilarInstituto(solicitante);

        if (!instituto) {
          instituto = await InstitutosDAO.createOneInstituto({
            razonSocial: solicitante
          })
          loggerService.log('info', `Instituto "${solicitante}" creado.`);
        } else {
          loggerService.log('info', `No fue necesario crear el instituto "${solicitante}" debido a que ya existe en el sistema`);
        }

        // Crear la relación en InstitutoExpediente
        const solicitanteExpediente = await SolicitantesExpedientesDAO.findOne(instituto.idInstituto, expediente.noExpediente);

        if (!solicitanteExpediente) {
          await SolicitantesExpedientesDAO.createOne({
            idInstituto: instituto.idInstituto,
            idInventor:null,
            noExpediente: expediente.noExpediente
          })
          loggerService.log('info', `Relación creada para Instituto "${solicitante}" y Expediente "${expediente.noExpediente}".`);
        } else {
          loggerService.log('info', `No fue necesario creo la relacion para "${solicitante}" y "${expediente.noExpediente}" debido a que ya existe`)
        }
      }
      for (const inventor of expediente.inventores) {
        // Buscar o crear el inventor si no existe
        let newInventor = await InventoresDAO.findOneByNombreCompleto(inventor);
        if (!newInventor) {
          newInventor = await InventoresDAO.createOneInventor({
            nombreCompleto: inventor,
          });
          loggerService.log('info', `Inventor "${inventor}" creado.`);
        } else {
          loggerService.log('info', `No fue necesario crear el inventor "${inventor}", debido a que ya existe en el sistema`);
        }
        const inventorExpediente = await InventoresExpedientesDAO.findOne(newInventor.idInventor, expediente.noExpediente);
        if (!inventorExpediente) {
          await InventoresExpedientesDAO.createOne({
            idInventor: newInventor.idInventor,
            noExpediente: expediente.noExpediente
          });
          loggerService.log('info', `Relación creada para Inventor "${inventor}" y Expediente "${expediente.noExpediente}".`);
        } else {
          loggerService.log('info', `No fue necesario creo la relacion para "${inventor}" y "${expediente.noExpediente}" debido a que ya existe`)
        }
      }
    }
    
    if (job.data.clientId) {
      const { clientId } = job.data;
      serverInstance.broadcast({
        msg: "Escraper seeder finalizado sin problemas",
        data: result,
        buttonEnable: true,
        tipo: "exito"
      });
    }

  }

  private async onFailed(job: Job<IScraperSeederJobData> | undefined, err: Error): Promise<void> {
    let errorData: IScrapersErrorData;
    try {
      errorData = JSON.parse(err.message);
    } catch (error) {
      errorData = { code: 1, error: err.message, scraperName: "Scraper Seeder" };
    }

    if (job) {
      console.error(`Job ${job.id}, scraper Seeder, failed with error ${errorData.error}`);

      if (job.data.clientId) {
        const { clientId } = job.data;
        serverInstance.broadcast({
          msg: "Hubo un problema con el scraper seeder",
          data: errorData,
          buttonEnable: true,
          tipo: "error"
        });
      }
    }

    await EmailService.sendEmailScrapersError(errorData);
    
  }

  public addJob(nameTask:string, data:IScraperSeederJobData){
    this.queue.add(nameTask,data)
  }

  public async queueStatus(): Promise<boolean> {
    const activeJobs = await this.queue.getActiveCount();
    return !(activeJobs > 0);
  }

}

export default ScraperSeederWorker.getInstance();
