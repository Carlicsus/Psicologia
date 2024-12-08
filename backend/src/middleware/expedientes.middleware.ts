import { NextFunction, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';

class ExpedientesMiddleware{

    private static instance: ExpedientesMiddleware;

    private constructor () {}

    public static getInstance(): ExpedientesMiddleware{
        if(!ExpedientesMiddleware.instance){
            ExpedientesMiddleware.instance = new ExpedientesMiddleware();
        }
        return ExpedientesMiddleware.instance;
    }

    public async createExpedienteValidator (req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        await body().isArray().withMessage('El cuerpo de la solicitud no cumple con lo necesario para procesar la petición').run(req);
    
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                msg: 'Errores de validación',
                errors: errors.array()
            });
        }
    
        // Iterar sobre cada objeto en el array para aplicar las validaciones
        for (const [index] of req.body.entries()) {
            await body(`${index}.noExpediente`)
                .isString().withMessage('El cuerpo de la solicitud no cumple con lo necesario para procesar la petición').bail()
                .notEmpty().withMessage('El campo "No. Expediente" es obligatorio').bail()
                .matches(/^MX\/[auf]\/\d{4}\/\d{6}$/).withMessage('No cumple con la estructura MX/a/aaaa/nnnnnn').bail()
                .run(req);
        }
    
        await body('websocketclientid')
            .custom((value:string)=>!req.headers.websocketclientid?false: true).withMessage('El header "websocketclientid" es obligatorio').bail()
            .run(req);
    
        const finalErrors = validationResult(req);
        if (!finalErrors.isEmpty()) {
            return res.status(400).json({
                msg: 'Errores de validación',
                errors: finalErrors.array()
            });
        }
    
        return next();
    };
}

export default ExpedientesMiddleware.getInstance();