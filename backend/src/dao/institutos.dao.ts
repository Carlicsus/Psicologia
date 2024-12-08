import loggerService from "../helpers/loggerService";
import { IInstitutosAttributes, IInstitutosCreationAttributes } from "../interfaces/institutos.interface";
import NaturalLenguajeService from "../helpers/naturalLenguaje";
import { Institutos } from "../models/index.model";

class InstitutosDAO {

  private static instance: InstitutosDAO

  private constructor() {}

  public static getInstance(): InstitutosDAO{
    if(!InstitutosDAO.instance){
      InstitutosDAO.instance = new InstitutosDAO();
    }
    return InstitutosDAO.instance;
  }

  public async findSimilarInstituto(razonSocial:string) : Promise<IInstitutosAttributes | null>{
    const institutos = await Institutos.findAll();

    let bestMatch: IInstitutosAttributes | null = null;
    let highestSimilarity = 0;

    for (const instituto of institutos) {
      const similarity = NaturalLenguajeService.calculateSimilarity(razonSocial, instituto.razonSocial);
      if (similarity > highestSimilarity) {
        highestSimilarity = similarity;
        bestMatch = instituto;
      }
    }

    if(highestSimilarity>=0.93){
      return bestMatch;
    }

    return null;
  }

  public async createOneInstituto(data:IInstitutosCreationAttributes): Promise<IInstitutosAttributes>{
    const instituto = await Institutos.create(data);
    return instituto;
  }

      
}

export default InstitutosDAO.getInstance();