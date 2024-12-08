import { Request, Response, NextFunction } from "express"
import serverInstance from '../index';
import jwt from "jsonwebtoken";

class AuthMiddleware{

    private static instance: AuthMiddleware;

    private constructor () {}

    public static getInstance(): AuthMiddleware{
        if(!AuthMiddleware.instance){
            AuthMiddleware.instance = new AuthMiddleware();
        }
        return AuthMiddleware.instance;
    }

    public validateToken (req:Request,res:Response,next:NextFunction): Response | void {
        console.log('validateToken');

        const headerToken = req.headers['authorization'];
        const clientId = req.headers.websocketclientid;

        if(typeof(headerToken) !== 'string'){
            return res.status(401).json({
                msg:'Token no valido'
            });
        }

        if(!headerToken.startsWith('Bearer')){
            return res.status(401).json({
                msg:'Token no valido'
            });
        }

        if(typeof(clientId) !== 'string'){
            return res.status(401).json({
                msg:'ws no valido'
            });
        } 

        try {
            const bearerToken = headerToken.slice(7);

            jwt.verify(bearerToken,process.env.SECRET_KEY || 'pepito123');

        } catch (error) {
            return res.status(401).json({
                msg:"Token no valido"
            })
        }

        const exist = serverInstance.isClientConnected(clientId);

        if(!exist){
            return res.status(401).json({
                msg:'ws no valido'
            });
        }

        return next();


    }
}

export default AuthMiddleware.getInstance();