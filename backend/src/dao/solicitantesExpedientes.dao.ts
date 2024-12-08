import loggerService from "../helpers/loggerService";
import { Op } from 'sequelize';
import { ISolicitantesExpedientesAttributes, ISolicitantesExpedientesCreationAttributes } from "../interfaces/solicitantesExpedientes.interface";
import { SolicitantesExpedientes } from "../models/index.model";

class SolicitantesExpedientesDAO {

  private static instance: SolicitantesExpedientesDAO;

  private constructor() {}

  public static getInstance(): SolicitantesExpedientesDAO{
    if(!SolicitantesExpedientesDAO.instance){
      SolicitantesExpedientesDAO.instance = new SolicitantesExpedientesDAO();
    }
    return SolicitantesExpedientesDAO.instance;
  }

  public async findOne(idIstituto:number,noExpediente:string){

    const solicitanteExpediente = SolicitantesExpedientes.findOne({
      where:{
        [Op.and]:[
          { noExpediente: noExpediente },
          { idInstituto: idIstituto },
        ]
      },
      raw: true
    });

    return solicitanteExpediente;
  }

  public async createOne(data:ISolicitantesExpedientesCreationAttributes){
    await SolicitantesExpedientes.create(data);
    return true;
  }
}

export default SolicitantesExpedientesDAO.getInstance();
