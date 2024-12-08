import loggerService from '../helpers/loggerService';
import { ISeccionesAttributes, ISeccionesCreationAttributes } from '../interfaces/secciones.interface';
import { Secciones } from '../models/index.model';

class SeccionesDAO {

  private static instance: SeccionesDAO;

  private constructor() { }

  public static getInstance(): SeccionesDAO {
    if (!SeccionesDAO.instance) {
      SeccionesDAO.instance = new SeccionesDAO();
    }
    return SeccionesDAO.instance;
  }

  public async findOrCreate(nombreSeccion:string): Promise<ISeccionesAttributes> {
    let existSeccion = await Secciones.findOne({ where: { nombreSeccion: nombreSeccion }, raw: true });
    if (!existSeccion) {
      existSeccion = await Secciones.create({ nombreSeccion: nombreSeccion });
    }

    return existSeccion as ISeccionesAttributes;
  }

}

export default SeccionesDAO.getInstance();
