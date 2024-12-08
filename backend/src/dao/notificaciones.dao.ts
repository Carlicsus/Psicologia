import loggerService from '../helpers/loggerService';
import { IExpedientesOnlyNoExpediente } from '../interfaces/expedientes.interface';
import { INotificacionesAttributes, INotificacionesCreationAttributes } from '../interfaces/notificaciones.interface';
import { Expedientes, Notificaciones, TemporalesNotificaciones } from '../models/index.model';
import expedientesDao from './expedientes.dao';

class NotificacionesDAO {

  private static instance: NotificacionesDAO;

  private constructor() { }

  public static getInstance(): NotificacionesDAO {
    if (!NotificacionesDAO.instance) {
      NotificacionesDAO.instance = new NotificacionesDAO();
    }
    return NotificacionesDAO.instance;
  }

  public async getAllLastRecords(): Promise<any> {


  }

  public async findOrCreate(data:INotificacionesCreationAttributes): Promise<INotificacionesAttributes> {
    let existNotificacion = await Notificaciones.findOne({ where: { noExpediente: data.noExpediente, fechaCirculacion: data.fechaCirculacion, numeroOficio: data.numeroOficio }, raw: true });
    if (!existNotificacion) {
      existNotificacion = await Notificaciones.create(data);
    }
    return existNotificacion as INotificacionesAttributes
  }
}

export default NotificacionesDAO.getInstance();
