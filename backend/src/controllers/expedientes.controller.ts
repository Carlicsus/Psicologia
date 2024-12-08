import { Request, Response } from 'express';
import ExpedientesDAO from '../dao/expedientes.dao';
import { IExpedientesError, IExpedientesOnlyNoExpediente } from '../interfaces/expedientes.interface';
import { Expedientes } from '../models/index.model';

class ExpedientesController {

    private static instance: ExpedientesController;

    private constructor() { }

    public static getInstance(): ExpedientesController {
        if (!ExpedientesController.instance) {
            ExpedientesController.instance = new ExpedientesController();
        }
        return ExpedientesController.instance;
    }


}

export default ExpedientesController.getInstance();