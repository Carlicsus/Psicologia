import {NextFunction, Request,Response} from 'express';
import { check, validationResult } from 'express-validator';

class InventoresMiddleware{

    private static instance: InventoresMiddleware;

    private constructor() {}

    public static getInstance(): InventoresMiddleware{
        if(!InventoresMiddleware.instance){
            InventoresMiddleware.instance = new InventoresMiddleware();
        }
        return InventoresMiddleware.instance;
    }

    // TODO: Agregar {idInventor:number} a una interface
    public async getOneInventorValidator (req:Request, res:Response, next:NextFunction): Promise<Response | void> {
        await check('idInventor')
            .notEmpty().withMessage('El parametro "Id Inventor" es obligatorio').bail()
            .isNumeric().withMessage('El id Inventor debe de ser de tipo numérico').bail()
            .custom((value) => Number.isInteger(Number(value))).withMessage('El id Inventor debe de ser un número entero')
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

    public async updateOneValidator (req:Request<{idInventor:number}>, res:Response, next:NextFunction): Promise<Response | void> {
        await check('idInventor')
            .notEmpty().withMessage('El parametro "Id Inventor" es obligatorio').bail()
            .isNumeric().withMessage('El id Inventor debe de ser de tipo numérico').bail()
            .custom((value) => Number.isInteger(Number(value))).withMessage('El id Inventor debe de ser un número entero')
            .run(req);
        await check('correo')
            .isEmail().withMessage('El correo electrónico ingresado no cumple con la estructura de un correo válido').bail()
            .notEmpty().withMessage('El campo "Coreo" es obligatorio').bail()
            .run(req)
        await check('direccion')
            .isString().withMessage('El cuerpo de la solicitud no cumple con lo necesario para procesar la peticion').bail()
            .notEmpty().withMessage('El campo "Dirección" es obligatorio').bail()
            .custom((value:string)=>value.trim()!==value?false: true).withMessage('Las direcciones, no puede contener espacios en blanco al principio o al final').bail()
            .matches(/^(?!.*\s{2,}).*$/).withMessage('Las direcciones, no puede contener espacios dobles').bail()
            .run(req)
        await check('CURP')
            .isString().withMessage('El cuerpo de la solicitud no cumple con lo necesario para procesar la peticion').bail()
            .notEmpty().withMessage('El campo "CURP" es obligatorio').bail()
            .custom((value:string)=>value.trim()!==value?false: true).withMessage('El CURP no puede contener espacios en blanco al principio o al final').bail()
            .matches(/^[A-Z0-9]{18}$/).withMessage('El CURP debe contener exactamente 18 caracteres alfanuméricos en mayúsculas sin espacios').bail()
            .matches(/^([A-Z][AEIOUX][A-Z]{2}\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])[HM](?:AS|B[CS]|C[CLMSH]|D[FG]|G[TR]|HG|JC|M[CNS]|N[ETL]|OC|PL|Q[TR]|S[PLR]|T[CSL]|VZ|YN|ZS)[B-DF-HJ-NP-TV-Z]{3}[A-Z\d])(\d)$/).withMessage('El CURP no cumple con la estructura de un CURP').bail()
            .run(req)
        await check('telefono')
            .custom((value) => typeof(value)!=='number'?false:true).bail().withMessage('El cuerpo de la solicitud no cumple con lo necesario para procesar la peticion').bail()
            .notEmpty().withMessage('El campo "Numero de telefono" es obligatorio').bail()
            .matches(/^[0-9]{10}$/).withMessage('El numero de telefono solo puede contener 10 digitos numericos').bail()
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

export default InventoresMiddleware.getInstance();