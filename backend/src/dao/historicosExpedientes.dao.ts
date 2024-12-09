import loggerService from "../helpers/loggerService";
import { IHistoricosExpedientesAttributes, IHistoricosExpedientesCreationAttributes } from "../interfaces/historicosExpedientes.interface";
import { Expedientes, HistoricosExpedientes } from "../models/index.model";
import ExpedientesDAO from './expedientes.dao';

class HistoricosExpedientesDAO {

  public static instance: HistoricosExpedientesDAO;

  private constructor() { }

  public static getInstance(): HistoricosExpedientesDAO {
    if (!HistoricosExpedientesDAO.instance) {
      HistoricosExpedientesDAO.instance = new HistoricosExpedientesDAO();
    }
    return HistoricosExpedientesDAO.instance;
  }

  // public async findHistoricoByNoExpediente(noExpediente: string): Promise<IHistoricosExpedientesAttributes[]> {
  //   const historico = await HistoricosExpedientes.findAll({
  //     where: { noExpediente: noExpediente },
  //     raw: true,
  //   });

  //   return historico as IHistoricosExpedientesAttributes[];
  // }

  // public async getLastRecords(): Promise<IHistoricosExpedientesLastRecord[]> {
  //   // TODO: No ocupar el dao sino recibir como parametro en la logica de negocios
  //   const expedientes = await ExpedientesDAO.getAllNoExpedientes();
  //   let lastRecords: IHistoricosExpedientesLastRecord[] = [];
  //   for (const expediente of expedientes) {
  //     const lastHistorico = await HistoricosExpedientes.findOne({
  //       where: { noExpediente: expediente.noExpediente },
  //       order: [['fecha', 'DESC']],
  //     });

  //     if (lastHistorico) {
  //       lastRecords.push({
  //         noExpediente: lastHistorico.noExpediente,
  //         noDocumento: lastHistorico.noDocumento,
  //         fecha: lastHistorico.fecha
  //       });
  //       continue;
  //     }
  //     lastRecords.push({
  //       noExpediente: expediente.noExpediente,
  //       noDocumento: null,
  //       fecha: null
  //     })
  //     continue;
  //   }
  //   return lastRecords;
  // }

  // public async findAllOficios(noExpediente: string): Promise<IHistoricosExpedientesForRelations[]> {
  //   const historicos = await HistoricosExpedientes.findAll({
  //     where: {
  //       noExpediente: noExpediente,
  //       tipo: 'OFICIO'
  //     },
  //     attributes: ['codigoBarras', 'noDocumento', 'noExpediente'],
  //     order: [['fecha', 'ASC']],
  //     raw: true
  //   });

  //   return historicos as IHistoricosExpedientesForRelations[]
  // }


}

export default HistoricosExpedientesDAO.getInstance();