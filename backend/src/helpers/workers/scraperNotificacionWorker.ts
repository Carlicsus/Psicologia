import { Worker, Queue, Job } from 'bullmq'; // Importamos directamente Worker y Queue
import { spawn, ChildProcessWithoutNullStreams } from 'child_process';
import serverInstance from '../..';
import ConnectionDatabaseService from '../../db/connections'
import loggerService from '../loggerService';
import EmailService from '../email';
import { IScrapersErrorData } from '../../interfaces/workers/scrapersWorkers.interface';
import { IScraperNotificacionJobData, IScraperNotificacionResult } from '../../interfaces/workers/scraperNotificacionWorker.interface';
import { Expedientes, Gacetas, HistoricosExpedientes, Inventores, Notificaciones, Secciones, TemporalesNotificaciones } from '../../models/index.model';
import { INotificacionesAttributes } from '../../interfaces/notificaciones.interface';
import { ITemporalesNotificacionesAttributes } from '../../interfaces/temporalesNotificaciones.interface';
import { InventorData } from '../../interfaces/email.interface';
import { Inventore } from '../../interfaces/expedientes.interface';
import HistoricosExpedientesDAO from '../../dao/historicosExpedientes.dao';
import GacetasDAO from '../../dao/gacetas.dao';
import SeccionesDAO from '../../dao/secciones.dao';
import NotificacionesDAO from '../../dao/notificaciones.dao';
import TemporalesNotificacionesDAO from '../../dao/temporalesNotificaciones.dao';
import ExpedientesDAO from '../../dao/expedientes.dao';

class ScraperNotificacionWorker {
  private static instance: ScraperNotificacionWorker;
  private queue: Queue<IScraperNotificacionJobData>;
  private worker: Worker<IScraperNotificacionJobData, IScraperNotificacionResult>;
  private activeProcesses: Set<ChildProcessWithoutNullStreams>;

  private constructor() {
    this.queue = new Queue('scraperNotificacionQueue', { connection: ConnectionDatabaseService.getConnectionRedis() });
    this.worker = new Worker('scraperNotificacionQueue', this.processJob.bind(this), { connection: ConnectionDatabaseService.getConnectionRedis() });
    this.activeProcesses = new Set();

    this.worker.on('completed', this.onCompleted.bind(this));
    this.worker.on('failed', this.onFailed.bind(this));
  }

  public static getInstance(): ScraperNotificacionWorker {
    if (!ScraperNotificacionWorker.instance) {
      ScraperNotificacionWorker.instance = new ScraperNotificacionWorker();
    }
    return ScraperNotificacionWorker.instance;
  }

  private async processJob(job: Job<IScraperNotificacionJobData>): Promise<IScraperNotificacionResult> {
    const { ultimasNotificaciones } = job.data;

    if (job.data.clientId) {
      const { clientId } = job.data;
      serverInstance.broadcast({
        msg: "Escraper Notificación Iniciado",
        data: ultimasNotificaciones,
        buttonEnableNotificacion: false,
        tipo: "info"
      });
    }

    return new Promise<IScraperNotificacionResult>((resolve, reject) => {
      const pythonProcess: ChildProcessWithoutNullStreams = spawn('python3', ["src/scrapper/scrapperNotificacion/mainNotificacion.py"]);

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
          errorResponse = { code: code, error: outputError, scraperName: "Scraper Notificación" };
          return reject(new Error(JSON.stringify(errorResponse)));
        }

        try {
          console.log(output);
          const parsedOutput = JSON.parse(output);
          return resolve(parsedOutput);
        } catch (error: any) {
          console.log('catch');
          errorResponse = { code: code, error: `${error.message}`, scraperName: "Scraper Notificación" };
          return reject(new Error(JSON.stringify(errorResponse)));
        }
      });

      pythonProcess.stdin.write(JSON.stringify(ultimasNotificaciones));
      pythonProcess.stdin.end();
    });
  }

  private async onCompleted(job: Job<IScraperNotificacionJobData>, result: IScraperNotificacionResult): Promise<void> {
    loggerService.log('info', `Job ${job.id}, scraper Notificaciones, completed successfully`);

    const { correctos } = result;

    // TODO: Registrar las notificaciones en la base de datos
    for (const correcto of correctos) {
      const notificaciones: INotificacionesAttributes[] = [];
      const temporales: ITemporalesNotificacionesAttributes[] = [];
      const { noExpediente, data } = correcto;
      loggerService.log('info', `Procesando la informacion del expediente '${noExpediente}'`);
      const historicos = await HistoricosExpedientesDAO.findAllOficios(noExpediente);
      if (historicos.length < 1) {
        loggerService.log('info', `No existen historicos relacionados al ${noExpediente}, no se puede procesar la informacion`)
        continue;
      }
      // Modificar el valor de codigoBarras para que solo contenga los últimos digitos
      for (let historico of historicos) {
        const partes = historico.codigoBarras.split('/');
        historico.codigoBarras = partes[partes.length - 1];
      }
      for (const notificacion of data) {
        const { ejemplar, gaceta, seccion, fechaCirculacion, descripcionGeneralAsunto, fechaOficio, numeroOficio } = notificacion;
        // TODO: Hacer el caso de descripcionGeneralAsunto = Otorgamiento de Patente? (Creo no sale)
        // Buscar el historico con el mismo numeroOficio
        const historicoMatch = historicos.find(h => h.codigoBarras === String(numeroOficio));

        if (historicoMatch) {
          loggerService.log('info', `Encontrado historico que hace match con la notificaion '${notificacion.descripcionGeneralAsunto}'`);
          const existGaceta = await GacetasDAO.findOrCreate(gaceta);
          // TODO: Buscar por similitud?
          const existSeccion = await SeccionesDAO.findOrCreate(seccion);
          // TODO: cambiar la fecha de circulacion por la correcta que viene del scraper
          const existNotificacion = await NotificacionesDAO.findOrCreate({
            noExpediente: noExpediente,
            noDocumento: historicoMatch.noDocumento,
            ejemplar: ejemplar,
            idGaceta: existGaceta.idGaceta,
            idSeccion: existSeccion.idSeccion,
            fechaCirculacion: fechaCirculacion,
            descripcionGeneralAsunto: descripcionGeneralAsunto,
            fechaOficio: fechaOficio,
            numeroOficio: numeroOficio
          });

          notificaciones.push(existNotificacion);
          continue;
        }

        loggerService.log('info', `No se encontró historico que se relacione con la notificacion '${notificacion.descripcionGeneralAsunto}'`);
        const existGaceta = await GacetasDAO.findOrCreate(gaceta);
        // TODO: Buscar por similitud?
        const existSeccion = await SeccionesDAO.findOrCreate(seccion);
        const existTemporal = await TemporalesNotificacionesDAO.findOrCreate({
          noExpediente: noExpediente,
          ejemplar: ejemplar,
          idGaceta: existGaceta.idGaceta,
          idSeccion: existSeccion.idSeccion,
          fechaCirculacion: fechaCirculacion,
          descripcionGeneralAsunto: descripcionGeneralAsunto,
          fechaOficio: fechaOficio,
          numeroOficio: numeroOficio
        });
        temporales.push(existTemporal);
        continue;
      }
      if ('estatus' in correcto) {
        const { estatus } = correcto;
        await ExpedientesDAO.updateStatus(noExpediente, estatus!)
        loggerService.log('info', `Se actualizo el status del expediente: '${noExpediente}', es decir que ¡¡el expediente ${noExpediente} fue dado de alta!!`);
      }
      const inventores = await ExpedientesDAO.getOneAllInventores(noExpediente);
      inventores.Inventores.push({ nombreCompleto: `Admnin : ${process.env.NOMBRES_ADMIN!} ${process.env.APELLIDOS_ADMIN!}`, correo: process.env.EMAIL_ADMIN! });

      await EmailService.sendEmailNotificacion({
        inventoresData: inventores,
        notificaciones: notificaciones,
        temporales: temporales
      });

    }

    if (job.data.clientId) {
      const { clientId } = job.data;
      serverInstance.broadcast({
        msg: "Escraper Notificación finalizado sin problemas",
        data: result,
        buttonEnableNotificacion: true,
        tipo: "exito"
      });
    }
  }


  private async onFailed(job: Job<IScraperNotificacionJobData> | undefined, err: Error): Promise<void> {
    let errorData: IScrapersErrorData;
    try {
      errorData = JSON.parse(err.message);
    } catch (error) {
      errorData = { code: 1, error: err.message, scraperName: "Scraper Notificación" };
    }

    if (job) {
      console.error(`Job ${job.id}, scraper Notificaciones, failed with error ${errorData.error}`);

      if (job.data.clientId) {
        const { clientId } = job.data;
        serverInstance.broadcast({
          msg: "Hubo un problema con el scraper Notificación",
          data: errorData,
          buttonEnableNotificacion: true,
          tipo: "error"
        });
      }
    }

    // Enviar el email del error
    await EmailService.sendEmailScrapersError(errorData);

  }

  public addJob(nameTask: string, data: IScraperNotificacionJobData) {
    this.queue.add(nameTask, data)
  }

  public async queueStatus(): Promise<boolean> {
    const activeJobs = await this.queue.getActiveCount();
    console.log(!(activeJobs > 0));
    return !(activeJobs > 0);
  }

}

export default ScraperNotificacionWorker.getInstance();
