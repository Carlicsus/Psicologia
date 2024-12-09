import { Op } from 'sequelize';
import loggerService from '../helpers/loggerService';
import { IAlumnosAttributes, IAlumnosMatriculaOnly } from '../interfaces/alumnos.interface';
import { Alumnos } from '../models/index.model';

class AlumnosDAO {

  private static instance: AlumnosDAO;

  private constructor() { }

  public static getInstance(): AlumnosDAO {
    if (!AlumnosDAO.instance) {
      AlumnosDAO.instance = new AlumnosDAO();
    }
    return AlumnosDAO.instance;
  }

  public async getAllAlumnos(): Promise<IAlumnosMatriculaOnly[]>{
    const alumnos = await Alumnos.findAll({attributes:['matricula', 'nombres','apellidos']});
    return alumnos as IAlumnosMatriculaOnly[];
  }


}

export default AlumnosDAO.getInstance();