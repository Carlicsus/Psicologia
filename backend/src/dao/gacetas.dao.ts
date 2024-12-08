import loggerService from '../helpers/loggerService';
import { IGacetasAttributes, IGacetasCreationAttributes } from '../interfaces/gacetas.interface';
import { Gacetas } from '../models/index.model';

class GacetasDAO {

  private static instance: GacetasDAO;

  private constructor() { }

  public static getInstance(): GacetasDAO {
    if (!GacetasDAO.instance) {
      GacetasDAO.instance = new GacetasDAO();
    }
    return GacetasDAO.instance;
  }

  public async findOrCreate(nombreGaceta: string): Promise<IGacetasAttributes> {
    let existGaceta = await Gacetas.findOne({
      where: {
        nombreGaceta: nombreGaceta
      },
      raw: true
    });
    if (!existGaceta) {
      existGaceta = await Gacetas.create({ nombreGaceta: nombreGaceta });
    }
    return existGaceta as IGacetasAttributes;
  }
}

export default GacetasDAO.getInstance();
