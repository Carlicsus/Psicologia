import { Request, Response } from 'express';
import HistoricosExpedientesDAO from '../dao/historicosExpedientes.dao';
import TokenService from "../helpers/token";
import path from 'path';
import fs from 'fs';
import { IHistoricosExpedientesNew } from '../interfaces/historicosExpedientes.interface';

class HistoricosExpedientesController {

    private static instance: HistoricosExpedientesController;

    private constructor() { }

    public static getInstance(): HistoricosExpedientesController {
        if (!HistoricosExpedientesController.instance) {
            HistoricosExpedientesController.instance = new HistoricosExpedientesController();
        }
        return HistoricosExpedientesController.instance;
    }

    public async getHistoricoExpediente(req: Request, res: Response): Promise<Response> {
        const noExpediente: string = req.params.noExpediente;
    
        const historico = await HistoricosExpedientesDAO.findHistoricoByNoExpediente(noExpediente);
    
        if (historico.length > 0) {
            return res.status(200).json(historico);
        }
    
        return res.status(404).json({ msg: 'El expediente no existe o aun no cuenta con un historico en el sistema' })
    }

    public async create(req: Request, res: Response): Promise<Response> {
        const historico: IHistoricosExpedientesNew = req.body;

        const { noExpediente, secion, resumen, actividad} = historico;

        // // Verificar que el noExpediente no se encuentre ya registrado en la base de datos
        // const exist = await HistoricosExpedientesDAO.findOneExpedienteByMatricula(matricula);

        // if (exist) {
        //     return res.status(409).json({ msg: `Ya existe un expediente con la matricula ${matricula}` });
        // }

        const noDocumento = TokenService.generarId();

        // Almacenar en la base de datos si todas las verificaciones fueron exitosas
        try {
            await HistoricosExpedientesDAO.createOneHistorico({
                noDocumento,
                noExpediente,
                secion,
                resumen,
                actividad
             });
        } catch (error) {
            return res.status(409).json({ msg: `Ocurrio un error en el resgitro` });
        }

        return res.status(200).json({msg: `Se registro nuevo documento ${noExpediente}, para el expediente: ${noExpediente}`})
    }

    // public async getHistoricoExpediente(req: Request, res: Response): Promise<Response> {
    //     const noExpediente: string = req.params.noExpediente.replace(/_/g, '/');

    //     const historico = await HistoricosExpedientesDAO.findHistoricoByNoExpediente(noExpediente);

    //     if (historico.length > 0) {
    //         return res.status(200).json(historico);
    //     }

    //     return res.status(404).json({ msg: 'El expediente no existe o aun no cuenta con un historico en el sistema' })
    // }

    // public async downloadPDF(req: Request, res: Response): Promise<Response | void> {
    //     const { noExpediente, noDocumento } = req.params;

    //     const filePath = path.join(__dirname, `../common/PDFS/historico/${noExpediente}/${noDocumento}.pdf`);

    //     if (fs.existsSync(filePath)) {
    //         return res.download(filePath, `${noDocumento}.pdf`, (err) => {
    //             if (err) {
    //                 console.error('Error al descargar el archivo:', err);
    //                 return res.status(500).json({ msg: 'Error al descargar el archivo' });
    //             }
    //         });
    //     }

    //     return res.status(404).json({ msg: 'Archivo no encontrado' });
    // }

}


export default HistoricosExpedientesController.getInstance();