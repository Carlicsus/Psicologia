import {NextFunction, Request,Response} from 'express';
import { check, validationResult } from 'express-validator';

class HistoricosExpedientesMiddleware{
    
    private static instance: HistoricosExpedientesMiddleware;

    private constructor() {}

    public static getInstance(): HistoricosExpedientesMiddleware{
        if(!HistoricosExpedientesMiddleware.instance){
            HistoricosExpedientesMiddleware.instance = new HistoricosExpedientesMiddleware();
        }
        return HistoricosExpedientesMiddleware.instance;
    }

    public async getAllHistoricoExpedienteValidator (req:Request, res:Response, next:NextFunction): Promise<Response | void> {
        await check('noExpediente')
            .notEmpty().withMessage('Los parametros no cumplen con lo necesario para procesar la solicitud')
            .isString().withMessage('El No. de expediente debe de ser una cadena de texto')
            .matches(/^MX\_[auf]\_\d{4}\_\d{6}$/).withMessage('No cumple con la estructura MX_[auf]_aaaa_nnnnnn').bail()
            .run(req);

        const errors = validationResult(req);
    
        if (!errors.isEmpty()) {
            return res.status(400).json({
                msg: 'Errores de validación',
                errors: errors.array()
            });
        }
        
        return next();
    }

    public async downloadPDFValidator (req:Request, res:Response, next:NextFunction): Promise<Response | void> {
        await check('noExpediente')
            .notEmpty().withMessage('Los parametros no cumplen con lo necesario para procesar la solicitud')
            .isString().withMessage('El No. de expediente debe de ser una cadena de texto')
            .matches(/^MX\_[auf]\_\d{4}\_\d{6}$/).withMessage('No cumple con la estructura MX_[auf]_aaaa_nnnnnn').bail()
            .run(req);
        await check('noDocumento')
            .notEmpty().withMessage('Los parametros no cumplen con lo necesario para procesar la solicitud')
            .isString().withMessage('El No. de documento debe de ser una cadena de texto')
            .matches(/^MX\_[WE]\_\d{4}\_\d{6}$/).withMessage('No cumple con la estructura MX_[WE]_aaaa_nnnnnn').bail()
            .run(req);

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                msg: 'Errores de validación',
                errors: errors.array()
            });
        }
        
        return next();
            
    }
}

export default HistoricosExpedientesMiddleware.getInstance();