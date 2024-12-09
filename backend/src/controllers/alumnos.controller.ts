import { Request, Response } from 'express';
import AlumnosDAO from '../dao/alumnos.dao';

class AlumnosController {

    private static instance: AlumnosController;

    private constructor() { }

    public static getInstance(): AlumnosController {
        if (!AlumnosController.instance) {
            AlumnosController.instance = new AlumnosController();
        }
        return AlumnosController.instance;
    }

    public async getAllAlumnos(req: Request, res: Response): Promise<Response> {
        const expedientes = await AlumnosDAO.getAllAlumnos();
        return res.status(200).json(expedientes);
    }


}

export default AlumnosController.getInstance();