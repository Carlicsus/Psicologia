import loggerService from '../helpers/loggerService';
import { IExpedientesOnlyNoExpediente } from '../interfaces/expedientes.interface';
import { ITemporalesNotificacionesAttributes, ITemporalesNotificacionesCreationAttributes } from '../interfaces/temporalesNotificaciones.interface';
import { Notificaciones, TemporalesNotificaciones } from '../models/index.model';

class TemporalesNotificacionesDAO {

  private static instance: TemporalesNotificacionesDAO;

  private constructor() { }

  public static getInstance(): TemporalesNotificacionesDAO {
    if (!TemporalesNotificacionesDAO.instance) {
      TemporalesNotificacionesDAO.instance = new TemporalesNotificacionesDAO();
    }
    return TemporalesNotificacionesDAO.instance;
  }

  public async findOrCreate(data:ITemporalesNotificacionesCreationAttributes): Promise<ITemporalesNotificacionesAttributes> {
    let existTemporal = await TemporalesNotificaciones.findOne({ where: { fechaCirculacion: data.fechaCirculacion, numeroOficio: data.numeroOficio }, raw: true });
    if (!existTemporal) {
      existTemporal = await TemporalesNotificaciones.create(data);
    }
    return existTemporal as ITemporalesNotificacionesAttributes;
  }

}

export default TemporalesNotificacionesDAO.getInstance();
