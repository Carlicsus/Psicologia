import { Request, Response } from 'express';
import HistoricosExpedientesDAO from '../dao/historicosExpedientes.dao';
import path from 'path';
import fs from 'fs';

class HistoricosExpedientesController {

    private static instance: HistoricosExpedientesController;

    private constructor() { }

    public static getInstance(): HistoricosExpedientesController {
        if (!HistoricosExpedientesController.instance) {
            HistoricosExpedientesController.instance = new HistoricosExpedientesController();
        }
        return HistoricosExpedientesController.instance;
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