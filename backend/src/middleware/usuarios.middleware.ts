import {NextFunction, Request,Response} from 'express';
import { check, validationResult } from 'express-validator';

class UsuariosMiddleware{

    private static instance: UsuariosMiddleware;

    private constructor() {}

    public static getInstance(): UsuariosMiddleware{
        if(!UsuariosMiddleware.instance){
            UsuariosMiddleware.instance = new UsuariosMiddleware();
        }
        return UsuariosMiddleware.instance;
    }
    
    public async newUserValidator (req:Request, res:Response, next:NextFunction): Promise<Response | void> {
        await check('usuario')
            .isString().withMessage('El cuerpo de la solicitud no cumple con lo necesario para procesar la peticion').bail()
            .notEmpty().withMessage('El campo "Usuario" es obligatorio').bail()
            .custom((value:string)=>value.trim()!==value?false: true).withMessage("El nombre de usuario no puede contener espacios en blanco al principio o al final").bail()
            .matches(/^(?!.*\s{2})[\w.-\s{1}]+$/).withMessage('Los nombres de usuario solo pueden contener letras, números, guiones bajos, puntos y ningun espacio doble')
            .run(req)
        await check('email')
            .isEmail().withMessage('El correo electrónico ingresado no cumple con la estructura de un correo válido').bail()
            .notEmpty().withMessage('El campo "Coreo" es obligatorio').bail()
            .run(req)
        await check('nombres')
            .isString().withMessage('El cuerpo de la solicitud no cumple con lo necesario para procesar la peticion').bail()
            .notEmpty().withMessage('El campo "Nombres" es obligatorio').bail()
            .custom((value:string)=>value.trim()!==value?false: true).withMessage('Los nombres no puede contener espacios en blanco al principio o al final').bail()
            .matches(/^(?!.*\s{2,}).*$/).withMessage('Los nombres no puede contener espacios dobles').bail()
            .run(req)
        await check('apellidos')
            .isString().withMessage('El cuerpo de la solicitud no cumple con lo necesario para procesar la peticion').bail()
            .notEmpty().withMessage('El campo "Apellidos" debe de contener al menos un apellido').bail()
            .custom((value:string)=>value.trim()!==value?false: true).withMessage('Los apellidos no puede contener espacios en blanco al principio o al final').bail()
            .matches(/^(?!.*\s{2,}).*$/).withMessage('Los apellidos no puede contener espacios dobles').bail()
            .run(req)
        await check('contrasena')
            .isString().withMessage('El cuerpo de la solicitud no cumple con lo necesario para procesar la peticion').bail()
            .notEmpty().withMessage('El campo "Contraseña" es obligatorio').bail()
            .matches(/^(?=.*\d)(?=.*[A-Z]).{8,30}$/).withMessage('La contraseña debe de contener al menos un digito, una mayuscula y entre 8 a 30 caracteres')
            .run(req)
        await check('repetirContrasena')
            .isString().withMessage('El cuerpo de la solicitud no cumple con lo necesario para procesar la peticion').bail()
            .notEmpty().withMessage('El campo "Repetir contraseña" es obligatorio').bail()
            .equals(req.body.contrasena).withMessage('Las contraseñas no son iguales').bail()
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

    public async loginUserValidator (req:Request, res:Response, next:NextFunction): Promise<Response | void> {
        await check('usuarioEmail')
            .isString().withMessage('El cuerpo de la solicitud no cumple con lo necesario para procesar la peticion').bail()
            .notEmpty().withMessage('El nombre de usuario es obligatorio').bail()
            .run(req)
        await check('contrasena')
            .isString().withMessage('El cuerpo de la solicitud no cumple con lo necesario para procesar la peticion').bail()
            .notEmpty().withMessage('El correo electrónico es obligatorio').bail()
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

    public async confirmarValidator (req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        await check('token')
            .notEmpty().withMessage('Se requiere un token en los parámetros de la solicitud')
            .isString().withMessage('El token debe ser una cadena de caracteres')
            .run(req);
    
        const errors = validationResult(req);
    
        if (!errors.isEmpty()) {
            return res.status(400).json({ 
                msg: 'Errores de validación',
                errors: errors.array() 
            });
        }
    
        return next();
    };
}

export default UsuariosMiddleware.getInstance();