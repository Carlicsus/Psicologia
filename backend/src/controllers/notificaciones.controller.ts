import { Request, Response } from 'express';
import WorkerNotificacionService from "../helpers/workers/scraperNotificacionWorker";
import { Expedientes, Institutos, Inventores, SolicitantesExpedientes, InventoresExpedientes, TemporalesNotificaciones, Notificaciones, Gacetas, Secciones } from '../models/index.model';
import ExpedientesDAO from '../dao/expedientes.dao';
import historicosExpedientesDao from '../dao/historicosExpedientes.dao';
import { IExpedienteLastNotificaiones, IExpedientesWithNotifications, Notificacione } from '../interfaces/notificaciones.interface';

class NotificacionesController {

  private static instance: NotificacionesController;

  private constructor() { }

  public static getInstance(): NotificacionesController {
    if (!NotificacionesController.instance) {
      NotificacionesController.instance = new NotificacionesController();
    }
    return NotificacionesController.instance;
  }

  // TODO: Borrar esta ruta (Esta ruta es para pruebas):v
  // TODO: Borrar esta ruta (Esta ruta es para pruebas):v
  public async sendEmailNotificacionPrueba(req: Request, res: Response): Promise<Response> {
    
    const historicos = await ExpedientesDAO.getAllLastNotificaion();

    return res.status(200).json(historicos );

  }

  public async getAllLastRecords(req: Request, res: Response): Promise<Response> {
    const expedientes = await ExpedientesDAO.getAllLastNotificaciones();
    // Procesa los resultados para determinar la notificación más reciente
    const result = expedientes.map(expediente => {
      const lastTemporalNotificacion = expediente.TemporalesNotificaciones;
      const lastNotificacion = expediente.Notificaciones;

      let lastNotificaion;

      // Compara las fechas de circulación para determinar la notificación más reciente
      if (lastTemporalNotificacion && lastNotificacion) {
        lastNotificaion = new Date(lastTemporalNotificacion.fechaCirculacion) > new Date(lastNotificacion.fechaCirculacion)
          ? {
            idTemporalNotificacion: lastTemporalNotificacion.idTemporalNotificacion,
            noExpediente: lastTemporalNotificacion.noExpediente,
            noDocumento: null,
            ejemplar: lastTemporalNotificacion.ejemplar,
            gaceta: lastTemporalNotificacion.Gaceta.nombreGaceta, // Usando el nombre de la gaceta
            seccion: lastTemporalNotificacion.Seccione.nombreSeccion, // Usando el nombre de la seccion
            fechaCirculacion: lastTemporalNotificacion.fechaCirculacion,
            descripcionGeneralAsunto: lastTemporalNotificacion.descripcionGeneralAsunto,
            fechaOficio: lastTemporalNotificacion.fechaOficio,
            numeroOficio: lastTemporalNotificacion.numeroOficio,
            createdAt: lastTemporalNotificacion.createdAt,
            updatedAt: lastTemporalNotificacion.updatedAt
          }
          : {
            idNotificacion: lastNotificacion.idNotificacion,
            noExpediente: lastNotificacion.noExpediente,
            noDocumento: lastNotificacion.noDocumento,
            ejemplar: lastNotificacion.ejemplar,
            gaceta: lastNotificacion.Gaceta.nombreGaceta, // Usando el nombre de la gaceta
            seccion: lastNotificacion.Seccione.nombreSeccion, // Usando el nombre de la seccion
            fechaCirculacion: lastNotificacion.fechaCirculacion,
            descripcionGeneralAsunto: lastNotificacion.descripcionGeneralAsunto,
            fechaOficio: lastNotificacion.fechaOficio,
            numeroOficio: lastNotificacion.numeroOficio,
            createdAt: lastNotificacion.createdAt,
            updatedAt: lastNotificacion.updatedAt
          };
          return {
            noExpediente: expediente.noExpediente,
            lastNotificaion
          };
      } 
      if (lastTemporalNotificacion) {
        lastNotificaion = {
          idTemporalNotificacion: lastTemporalNotificacion.idTemporalNotificacion,
          noExpediente: lastTemporalNotificacion.noExpediente,
          noDocumento: null,
          ejemplar: lastTemporalNotificacion.ejemplar,
          gaceta: lastTemporalNotificacion.Gaceta.nombreGaceta, // Usando el nombre de la gaceta
          seccion: lastTemporalNotificacion.Seccione.nombreSeccion, // Usando el nombre de la seccion
          fechaCirculacion: lastTemporalNotificacion.fechaCirculacion,
          descripcionGeneralAsunto: lastTemporalNotificacion.descripcionGeneralAsunto,
          fechaOficio: lastTemporalNotificacion.fechaOficio,
          numeroOficio: lastTemporalNotificacion.numeroOficio,
          createdAt: lastTemporalNotificacion.createdAt,
          updatedAt: lastTemporalNotificacion.updatedAt
        };
        return {
          noExpediente: expediente.noExpediente,
          lastNotificaion
        };
      } 
      if (lastNotificacion) {
        lastNotificaion = {
          idNotificacion: lastNotificacion.idNotificacion,
          noExpediente: lastNotificacion.noExpediente,
          noDocumento: lastNotificacion.noDocumento,
          ejemplar: lastNotificacion.ejemplar,
          gaceta: lastNotificacion.Gaceta.nombreGaceta, // Usando el nombre de la gaceta
          seccion: lastNotificacion.Seccione.nombreSeccion, // Usando el nombre de la seccion
          fechaCirculacion: lastNotificacion.fechaCirculacion,
          descripcionGeneralAsunto: lastNotificacion.descripcionGeneralAsunto,
          fechaOficio: lastNotificacion.fechaOficio,
          numeroOficio: lastNotificacion.numeroOficio,
          createdAt: lastNotificacion.createdAt,
          updatedAt: lastNotificacion.updatedAt
        };
      }

      return {
        noExpediente: expediente.noExpediente,
        lastNotificaion
      };
    });

    return res.json(result);
  }

  public async getNotificaciones(req: Request, res: Response): Promise<Response> {
    
    const noExpediente: string = req.params.noExpediente.replace(/_/g, '/');

    const expediente = await ExpedientesDAO.getOneAllNotificaciones(noExpediente);

    if (!expediente) {
      return res.status(404).json({ message: 'Expediente no encontrado' });
    }

    // Combinar las listas de notificaciones temporales y normales
    const notificaciones: Notificacione[] = [
      ...expediente.TemporalesNotificaciones,
      ...expediente.Notificaciones
    ];
    console.log(notificaciones);
    // Ordenar la lista combinada por fecha de circulación de forma ascendente
    notificaciones.sort((a, b) => new Date(a.fechaCirculacion).getTime() - new Date(b.fechaCirculacion).getTime());

    // Mapear las notificaciones para cambiar las claves
    const notificacionesMapped = notificaciones.map(notificacion => {
      return notificacion.idNotificacion ? {
        idNotificacion: notificacion.idNotificacion,
        noExpediente: notificacion.noExpediente,
        noDocumento: notificacion.noDocumento,
        ejemplar: notificacion.ejemplar,
        gaceta: notificacion.Gaceta.nombreGaceta, // Usando el nombre de la gaceta
        seccion: notificacion.Seccione.nombreSeccion, // Usando el nombre de la seccion
        fechaCirculacion: notificacion.fechaCirculacion,
        descripcionGeneralAsunto: notificacion.descripcionGeneralAsunto,
        fechaOficio: notificacion.fechaOficio,
        numeroOficio: notificacion.numeroOficio,
        createdAt: notificacion.createdAt,
        updatedAt: notificacion.updatedAt
      } : {
        idTemporalNotificacion: notificacion.idTemporalNotificacion,
        noExpediente: notificacion.noExpediente,
        noDocumento: null,
        ejemplar: notificacion.ejemplar,
        gaceta: notificacion.Gaceta.nombreGaceta, // Usando el nombre de la gaceta
        seccion: notificacion.Seccione.nombreSeccion, // Usando el nombre de la seccion
        fechaCirculacion: notificacion.fechaCirculacion,
        descripcionGeneralAsunto: notificacion.descripcionGeneralAsunto,
        fechaOficio: notificacion.fechaOficio,
        numeroOficio: notificacion.numeroOficio,
        createdAt: notificacion.createdAt,
        updatedAt: notificacion.updatedAt
      }
    });

    // Enviar la respuesta con la lista combinada
    return res.status(200).json({
      noExpediente: expediente.noExpediente,
      notificaciones: notificacionesMapped
    });
  }

  public async lauchScraperNotificacion(req: Request, res: Response): Promise<Response | void> {
    // TODO: consulta del dao 

    const clientId = req.headers.websocketclientid as string;

    // TODO: se necesita obtener los ultimos registros de notificacion de la base de datos
    
    const expedientes = await ExpedientesDAO.getAllLastNotificaion();
    //Procesa los resultados para determinar la notificación más reciente
    const ultimasNotificaciones = expedientes.map(expediente => {
      const lastTemporalNotificacion = expediente.TemporalesNotificaciones[0];
      const lastNotificacion = expediente.Notificaciones[0];

      let lastNotificaionCompare;

      // Compara las fechas de circulación para determinar la notificación más reciente
      if (lastTemporalNotificacion && lastNotificacion) {
        lastNotificaionCompare = new Date(lastTemporalNotificacion.fechaCirculacion) > new Date(lastNotificacion.fechaCirculacion)
          ? {
            fechaCirculacion: lastTemporalNotificacion.fechaCirculacion,
            numeroOficio: lastTemporalNotificacion.numeroOficio,
          }
          : {
            fechaCirculacion: lastNotificacion.fechaCirculacion,
            numeroOficio: lastNotificacion.numeroOficio,
          };
      } else if (lastTemporalNotificacion) {
        lastNotificaionCompare = {
          fechaCirculacion: lastTemporalNotificacion.fechaCirculacion,
          numeroOficio: lastTemporalNotificacion.numeroOficio,
        };
      } else if (lastNotificacion) {
        lastNotificaionCompare = {
          fechaCirculacion: lastNotificacion.fechaCirculacion,
          numeroOficio: lastNotificacion.numeroOficio,
        };
      } else {
        lastNotificaionCompare = {
          fechaCirculacion: null,
          numeroOficio: null
        }
      }

      return {
        noExpediente: expediente.noExpediente,
        numeroOficio: lastNotificaionCompare.numeroOficio,
        fechaCirculacion: lastNotificaionCompare.fechaCirculacion
      };
    });

    //Mandar a llamar a la cola de trabajo de scrape r DE HISTORICO
    WorkerNotificacionService.addJob('scrapeJob', {
      ultimasNotificaciones,
      clientId
    });

    return res.status(201).json({ msg: 'ok' })
  }


}


export default NotificacionesController.getInstance();
