import loggerService from "../helpers/loggerService";
import { IHistoricosExpedientesAttributes, IHistoricosExpedientesCreationAttributes, IHistoricosExpedientesForRelations, IHistoricosExpedientesLastRecord } from "../interfaces/historicosExpedientes.interface";
import { IScraperHistoricoCorrectos } from "../interfaces/workers/scraperHistoricoWorker.interface";
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

  public async findHistoricoByNoExpediente(noExpediente: string): Promise<IHistoricosExpedientesAttributes[]> {
    const historico = await HistoricosExpedientes.findAll({
      where: { noExpediente: noExpediente },
      raw: true,
    });

    return historico as IHistoricosExpedientesAttributes[];
  }

  public async createHistoricoScraped(historicos: IScraperHistoricoCorrectos[]): Promise<void> {
    for (const historico of historicos) {
      const { noExpediente, data } = historico;
      loggerService.log('info', `Procesando la informacion del expediente '${noExpediente}'`);
      const validateExpediente = await Expedientes.findOne({ where: { noExpediente: noExpediente }, raw: true });
      if (!validateExpediente) {
        loggerService.log('info', `No existe el expediente con numero de expediente '${noExpediente}', no se puede procesar la informacion`);
        continue;
      }
      for (const historico of data) {
        const { noDocumento, codigoBarras, descripcion, tipo, fecha } = historico;
        const validateHistorico = await HistoricosExpedientes.findOne({ where: { noDocumento: noDocumento }, raw: true });
        if (validateHistorico) {
          loggerService.log('info', `Ya existe un historico con el noDocumento '${noDocumento}'`);
          continue;
        }
        await HistoricosExpedientes.create({
          noExpediente,
          noDocumento,
          codigoBarras,
          descripcion,
          tipo,
          fecha
        });
        loggerService.log('info', `Se creo un historico del expediente ${noExpediente} con el numero de documento ${noDocumento}`);
      }
    }
  }

  public async getLastRecords(): Promise<IHistoricosExpedientesLastRecord[]> {
    // TODO: No ocupar el dao sino recibir como parametro en la logica de negocios
    const expedientes = await ExpedientesDAO.getAllNoExpedientes();
    let lastRecords: IHistoricosExpedientesLastRecord[] = [];
    for (const expediente of expedientes) {
      const lastHistorico = await HistoricosExpedientes.findOne({
        where: { noExpediente: expediente.noExpediente },
        order: [['fecha', 'DESC']],
      });

      if (lastHistorico) {
        lastRecords.push({
          noExpediente: lastHistorico.noExpediente,
          noDocumento: lastHistorico.noDocumento,
          fecha: lastHistorico.fecha
        });
        continue;
      }
      lastRecords.push({
        noExpediente: expediente.noExpediente,
        noDocumento: null,
        fecha: null
      })
      continue;
    }
    return lastRecords;
  }

  public async findAllOficios(noExpediente: string): Promise<IHistoricosExpedientesForRelations[]> {
    const historicos = await HistoricosExpedientes.findAll({
      where: {
        noExpediente: noExpediente,
        tipo: 'OFICIO'
      },
      attributes: ['codigoBarras', 'noDocumento', 'noExpediente'],
      order: [['fecha', 'ASC']],
      raw: true
    });

    return historicos as IHistoricosExpedientesForRelations[]
  }


}

export default HistoricosExpedientesDAO.getInstance();