import { Op } from 'sequelize';
import loggerService from '../helpers/loggerService';
import { IExpedientesAtrributes, IExpedientesCreationAttributes, IExpedientesUpdateAttributes } from '../interfaces/expedientes.interface';
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

  // public async findOneExpedienteByNoExpediente(noExpediente: string): Promise<IExpedientesOnlyNoExpediente | null> {
  //   const expediente = await Expedientes.findOne({
  //     attributes: ['noExpediente'],
  //     raw: true,
  //     where: {
  //       noExpediente: noExpediente,
  //     },
  //   });
  //   return expediente as IExpedientesOnlyNoExpediente | null;
  // }

  // public async createOneExpediente(data: IExpedientesCreationAttributes): Promise<boolean> {
  //   await Expedientes.create(data);
  //   return true;
  // }

  // public async getAllExpedientesPendientes(): Promise<IExpedientesOnlyNoExpediente[]> {
  //   const expedientesPendientes = await Expedientes.findAll({
  //     where: {
  //       [Op.or]: [
  //         { fechaPresentacion: null },
  //         { titulo: null },
  //         { resumen: null },
  //       ],
  //       [Op.and]: [
  //         { status: true }
  //       ]
  //     },
  //     attributes: ['noExpediente'],
  //     raw: true,
  //   });
  //   return expedientesPendientes as IExpedientesOnlyNoExpediente[];
  // }

  
  // public async deleteExpedeintesNoEncontrados(fechaLimite: Date): Promise<void> {
  //   const expedientesNoEncontrados = await Expedientes.findAll({
  //     where: {
  //       [Op.and]: [
  //         { fechaPresentacion: null },
  //         { titulo: null },
  //         { resumen: null },
  //       ],
  //       createdAt: {
  //         [Op.lt]: fechaLimite,
  //       },
  //     },
  //     raw: true,
  //   });

  //   if (expedientesNoEncontrados.length > 0) {
  //     await Expedientes.destroy({
  //       where: {
  //         noExpediente: expedientesNoEncontrados.map((expediente) => expediente.noExpediente),
  //       },
  //     });
  //     loggerService.log('info', 'Expedientes no encontrados por el scrapper eliminados con éxito.');
  //     return;
  //   }

  //   loggerService.log('info', 'No se encontraron Expedientes que están pendientes por más de 6 meses');
  //   return;
  // }

  // public async updateExpedientesPendientes(expedientes: IExpedientesUpdateAttributes[]): Promise<void> {
  //   for (const expediente of expedientes) {
  //     const { noExpediente, fechaPresentacion, titulo, resumen } = expediente;
  //     const expedienteUpdate = await Expedientes.findOne({ where: { noExpediente: noExpediente } });
  //     await expedienteUpdate!.update({
  //       fechaPresentacion,
  //       titulo,
  //       resumen,
  //     });
  //     await expedienteUpdate!.save();
  //     loggerService.log('info', `Se actualizó la información del expediente ${noExpediente}`);
  //   }
  //   return;
  // }

  // public async getAllNoExpedientes(): Promise<IExpedientesOnlyNoExpediente[]> {
  //   const expedientes = await Expedientes.findAll({
  //     where: { status: true },
  //     attributes: ['noExpediente'],
  //     raw: true
  //   })

  //   return expedientes as IExpedientesOnlyNoExpediente[];
  // }

  // public async updateStatus(noExpediente: string, status: boolean): Promise<boolean> {
  //   const expediente = await Expedientes.findOne({ where: { noExpediente: noExpediente } });
  //   if (expediente) {
  //     await expediente.update({
  //       status: status
  //     })
  //     await expediente.save();
  //     return true;
  //   }
  //   return false;
  // }


}

export default ExpedientesDAO.getInstance();