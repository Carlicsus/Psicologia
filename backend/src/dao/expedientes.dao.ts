import { Op } from 'sequelize';
import loggerService from '../helpers/loggerService';
import { IExpedientesAtrributes, IExpedientesCreationAttributes, IExpedientesUpdateAttributes, IExpedienteOnlyMatricula } from '../interfaces/expedientes.interface';
import { Expedientes } from '../models/index.model';
import { InventorData } from '../interfaces/email.interface';

class ExpedientesDAO {

  private static instance: ExpedientesDAO;

  private constructor() { }

  public static getInstance(): ExpedientesDAO {
    if (!ExpedientesDAO.instance) {
      ExpedientesDAO.instance = new ExpedientesDAO();
    }
    return ExpedientesDAO.instance;
  }

  public async createOneExpediente(data: IExpedientesCreationAttributes): Promise<boolean> {
    await Expedientes.create(data);
    return true;
  }

  public async findOneExpedienteByMatricula(matricula: string): Promise<IExpedienteOnlyMatricula | null> {
    const expediente = await Expedientes.findOne({
      attributes: ['matricula'],
      raw: true,
      where: {
        matricula: matricula,
      },
    });
    return expediente as IExpedienteOnlyMatricula | null;
  }

  public async getAllExpedientes(): Promise<IExpedientesAtrributes[]>{
    const expedientes = await Expedientes.findAll({nest:true});
    return expedientes as IExpedientesAtrributes[];
  }
  

}

export default ExpedientesDAO.getInstance();