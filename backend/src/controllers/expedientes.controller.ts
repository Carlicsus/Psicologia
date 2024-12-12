import { Request, Response } from 'express';
import ExpedientesDAO from '../dao/expedientes.dao';
import { Expedientes } from '../models/index.model';
import { IExpedienteNew } from '../interfaces/expedientes.interface';
import TokenService from "../helpers/token";


class ExpedientesController {

    private static instance: ExpedientesController;

    private constructor() { }

    public static getInstance(): ExpedientesController {
        if (!ExpedientesController.instance) {
            ExpedientesController.instance = new ExpedientesController();
        }
        return ExpedientesController.instance;
    }

    public async create(req: Request, res: Response): Promise<Response> {
        const expediente: IExpedienteNew = req.body;

        const { matricula, usuario, tipo } = expediente;

        // Verificar que el noExpediente no se encuentre ya registrado en la base de datos
        const exist = await ExpedientesDAO.findOneExpedienteByMatricula(matricula);

        if (exist) {
            return res.status(409).json({ msg: `Ya existe un expediente con la matricula ${matricula}` });
        }

        const noExpediente = TokenService.generarId();

        // Almacenar en la base de datos si todas las verificaciones fueron exitosas
        try {
            await ExpedientesDAO.createOneExpediente({
                noExpediente,
                matricula,
                usuario,
                tipo
             });
        } catch (error) {
            return res.status(409).json({ msg: `Ocurrio un error en el resgitro` });
        }

        return res.status(200).json({msg: `Se registro nuevo expediente ${noExpediente}, para la matricula: ${matricula}`})
    }

    public async getAll(req: Request, res: Response): Promise<Response> {
        const expedientes = await ExpedientesDAO.getAllExpedientes();
        return res.status(200).json(expedientes);
    }

}

export default ExpedientesController.getInstance();