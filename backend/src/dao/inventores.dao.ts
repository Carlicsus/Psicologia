import loggerService from '../helpers/loggerService';
import { IInventoresUpdateAttributes, IInventoresAttributes, IInventoresCreationAttributes } from '../interfaces/inventores.interface';
import { Institutos, Inventores } from '../models/index.model';

class InventoresDAO {

  private static instance: InventoresDAO;

  private constructor() {}

  public static getInstance(): InventoresDAO{
    if(!InventoresDAO.instance){
      InventoresDAO.instance = new InventoresDAO();
    }
    return InventoresDAO.instance;
  }

  public async updateInventorById(idInventor: number, data: IInventoresUpdateAttributes): Promise<boolean> {
    const inventor = await Inventores.findOne({where:{idInventor:idInventor}});
    if (inventor) {
      await inventor.update(data);
      await inventor.save();
      return true;
    }
    return false;
  }

  public async getAllInventores(): Promise<IInventoresAttributes[]> {
    const inventores = await Inventores.findAll({
      attributes:{exclude:['idArea','idInstituto','createdAt','updatedAt']},
      order: [['idInventor', 'ASC']],
      nest: true 
    });
    return inventores as IInventoresAttributes[];
  }

  public async findInventorById(idInventor: number): Promise<IInventoresAttributes | null> {
    const inventor = await Inventores.findByPk(idInventor, {
      attributes:{exclude:['idArea','idInstituto','createdAt','updatedAt']},
      nest: true 
    });
    return inventor as IInventoresAttributes | null;
  }

  public async findOneByNombreCompleto(nombreCompleto:string){
    const inventor = await Inventores.findOne({
      where:{nombreCompleto:nombreCompleto}
    });

    return inventor;
  }

  public async createOneInventor(data:IInventoresCreationAttributes){
    const inventor = await Inventores.create(data);
    return inventor;
  }

}

export default InventoresDAO.getInstance();
