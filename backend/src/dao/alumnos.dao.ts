import { Op } from 'sequelize';
import loggerService from '../helpers/loggerService';
import { IExpedientesAtrributes, IExpedientesCreationAttributes, IExpedientesUpdateAttributes } from '../interfaces/expedientes.interface';
import { Expedientes } from '../models/index.model';
import { InventorData } from '../interfaces/email.interface';

class AlumnosDAO {

  private static instance: AlumnosDAO;

  private constructor() { }

  public static getInstance(): AlumnosDAO {
    if (!AlumnosDAO.instance) {
      AlumnosDAO.instance = new AlumnosDAO();
    }
    return AlumnosDAO.instance;
  }


}

export default AlumnosDAO.getInstance();