import { NextFunction, Request, Response } from 'express';
import { body, validationResult, check } from 'express-validator';

class ExpedientesMiddleware{

    private static instance: ExpedientesMiddleware;

    private constructor () {}

    public static getInstance(): ExpedientesMiddleware{
        if(!ExpedientesMiddleware.instance){
            ExpedientesMiddleware.instance = new ExpedientesMiddleware();
        }
        return ExpedientesMiddleware.instance;
    }

    public async createExpedienteValidator (req:Request, res:Response, next:NextFunction): Promise<Response | void> {
        await check('matricula')
            .isString().withMessage('El cuerpo de la solicitud no cumple con lo necesario para procesar la peticion').bail()
            .notEmpty().withMessage('El campo "matricuka" es obligatorio').bail()
            .matches(/^\d{6}$/).withMessage('Las matriculas solo pueden contener 6 digitos consecutivos')
            .run(req)
        await check('usuario')
            .isString().withMessage('El cuerpo de la solicitud no cumple con lo necesario para procesar la peticion').bail()
            .notEmpty().withMessage('El campo "Usuario" es obligatorio').bail()
            .custom((value:string)=>value.trim()!==value?false: true).withMessage("El nombre de usuario no puede contener espacios en blanco al principio o al final").bail()
            .matches(/^(?!.*\s{2})[\w.-\s{1}]+$/).withMessage('Los nombres de usuario solo pueden contener letras, números, guiones bajos, puntos y ningun espacio doble')
            .run(req)
        await check('tipo')
            .isString().withMessage('El cuerpo de la solicitud no cumple con lo necesario para procesar la peticion').bail()
            .notEmpty().withMessage('El campo "Tipo" es obligatorio').bail()
            .custom((value:string)=>value.trim()!==value?false: true).withMessage('Los tipos no puede contener espacios en blanco al principio o al final').bail()
            .run(req)
    
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

export default ExpedientesMiddleware.getInstance();