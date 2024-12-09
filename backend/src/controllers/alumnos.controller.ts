import { Request, Response } from 'express';
import ExpedientesDAO from '../dao/expedientes.dao';
import { Expedientes } from '../models/index.model';

class AlumnosController {

    private static instance: AlumnosController;

    private constructor() { }

    public static getInstance(): AlumnosController {
        if (!AlumnosController.instance) {
            AlumnosController.instance = new AlumnosController();
        }
        return AlumnosController.instance;
    }


}

export default AlumnosController.getInstance();