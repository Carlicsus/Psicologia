import { Request, Response } from 'express';
import ExpedientesDAO from '../dao/expedientes.dao';
import WorkerSeederService from '../helpers/workers/scraperSeederWorker';
import { IExpedientesError, IExpedientesOnlyNoExpediente } from '../interfaces/expedientes.interface';
import { Expedientes, Inventores } from '../models/index.model';

class ExpedientesController {

    private static instance: ExpedientesController;

    private constructor() { }

    public static getInstance(): ExpedientesController {
        if (!ExpedientesController.instance) {
            ExpedientesController.instance = new ExpedientesController();
        }
        return ExpedientesController.instance;
    }

    //Funcion para registrar los expedientes y mandar a llamar al scrapper
    public async create(req: Request, res: Response): Promise<Response> {
        // Se almacena en la variable expedientes el body de la petición
        const expedientes: IExpedientesOnlyNoExpediente[] = req.body;

        // Arreglo para almacenar los errores encontrados
        const errores: IExpedientesError[] = [];
        // Arreglo para almacenar los expedientes que pasen todas las validaciones
        const correctos: IExpedientesOnlyNoExpediente[] = [];

        // Se itera sobre cada expediente en el arreglo
        for (let expediente of expedientes) {
            const { noExpediente } = expediente;

            // Verificar que el noExpediente no se encuentre ya registrado en la base de datos
            const exist = await ExpedientesDAO.findOneExpedienteByNoExpediente(noExpediente);

            if (exist) {
                errores.push({
                    noExpediente: expediente.noExpediente,
                    msg: `Ya existe el expediente ${noExpediente} en la base de datos`
                });
                continue;
            }

            // Almacenar en la base de datos si todas las verificaciones fueron exitosas
            try {
                await ExpedientesDAO.createOneExpediente({ noExpediente });
                correctos.push({ noExpediente });
            } catch (error) {
                errores.push({
                    noExpediente: expediente.noExpediente,
                    msg: "Error al registrar el expediente en la base de datos",
                    error: (error as Error).message
                });
            }
        }

        // De la base de datos extraer los expedientes sin finalizar
        const expedientesPendientes = await ExpedientesDAO.getAllExpedientesPendientes();

        let escrappermsg = "No hay expedientes pendientes, no es necesario realizar un scraping";
        const clientId = req.headers.websocketclientid as string;

        if (expedientesPendientes.length > 0) {
            WorkerSeederService.addJob('scrapeJob', { expedientesPendientes, clientId });
            escrappermsg = "Hay expedientes pendientes, se iniciara un scraping";
        }

        const correctosNoExpedientes = correctos.map(exp => exp.noExpediente);

        return res.status(200).json({
            msg: correctosNoExpedientes.length > 0
                ? `Se registraron expediente(s):\n${correctosNoExpedientes.join(", ")}`
                : `Todos los expedientes ya registrados.\n${escrappermsg}`,
            errores,
            correctos
        });
    };

    public async getAllExpedientes(req: Request, res: Response): Promise<Response> {
        const expedientes = await ExpedientesDAO.findAllExpedientes();
        return res.status(200).json(expedientes);
    }

    public async getAllInventores(req: Request, res: Response): Promise<Response> {
        const expedientes = await Expedientes.findAll({
            include: [
                {
                    model: Inventores,
                    attributes: { exclude: ['createdAt', 'updatedAt'] },
                    through: { attributes: [] }
                },
            ],
            attributes: ['noExpediente'],
            nest: true
        });
        return res.status(200).json(expedientes);
    }

}

export default ExpedientesController.getInstance();