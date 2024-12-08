import { Request, Response, NextFunction } from "express"

class NotificacionesMiddleware{

    private static instance: NotificacionesMiddleware;

    private constructor () {}

    public static getInstance(): NotificacionesMiddleware{
        if(!NotificacionesMiddleware.instance){
            NotificacionesMiddleware.instance = new NotificacionesMiddleware();
        }
        return NotificacionesMiddleware.instance;
    }

    // TODO: Adaptar este middleware
    public xd (req:Request,res:Response,next:NextFunction): Response | void {
    
        return next();
    }
}

export default NotificacionesMiddleware.getInstance();