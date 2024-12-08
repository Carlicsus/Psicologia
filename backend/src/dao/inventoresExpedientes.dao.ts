import { Op } from "sequelize";
import loggerService from "../helpers/loggerService";
import { IInventoresExpedientesAttributes, IInventoresExpedientesCreationAttributes } from "../interfaces/inventoresExpedientes.interface";
import { InventoresExpedientes } from "../models/index.model";

class InventoresExpedientesDAO {

  private static instance: InventoresExpedientesDAO;

  private constructor() {}

  public static getInstance(): InventoresExpedientesDAO{
    if(!InventoresExpedientesDAO.instance){
      InventoresExpedientesDAO.instance = new InventoresExpedientesDAO();
    }
    return InventoresExpedientesDAO.instance;
  }

  public async findOne(idInventor:number, noExpediente:string){
    const inventorExpediente = InventoresExpedientes.findOne({
      where:{
        [Op.and]:[
          {idInventor:idInventor},
          {noExpediente:noExpediente}
        ]
      },
      raw:true
    });

    return inventorExpediente;
  }

  public async createOne(data:IInventoresExpedientesCreationAttributes){
    await InventoresExpedientes.create(data);

    return true;
  }

}

export default InventoresExpedientesDAO.getInstance();
