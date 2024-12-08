import { Router } from 'express';
import NotificacionesController from '../controllers/notificaciones.controller';
import AuthMiddleware from '../middleware/auth.middleware';
import NotificacionesMiddleware from '../middleware/notificaciones.middleware';


class NotificacionesRoutes{

    private static instance: NotificacionesRoutes;
    private router: Router;
    private notificacionController: typeof NotificacionesController;
    private notificacionMiddleware: typeof NotificacionesMiddleware;
    private authMiddleware: typeof AuthMiddleware;

    private constructor() {
        this.router = Router();
        this.notificacionController =  NotificacionesController;
        this.notificacionMiddleware = NotificacionesMiddleware;
        this.authMiddleware = AuthMiddleware;
        this.initializeRoutes();
    }

    public static getInstance(): NotificacionesRoutes{
        if(!NotificacionesRoutes.instance){
            NotificacionesRoutes.instance = new NotificacionesRoutes();
        }
        return NotificacionesRoutes.instance;
    }

    private initializeRoutes(): void {
        // TODO: Borrar esta ruta y agregar el validate token
        this.router.get("/getAll", this.notificacionMiddleware.xd, this.notificacionController.getAllLastRecords);
        this.router.get("/getNotificaciones/:noExpediente", this.notificacionMiddleware.xd, this.notificacionController.getNotificaciones);
        this.router.post("/launch", this.notificacionMiddleware.xd, this.notificacionController.lauchScraperNotificacion);
        this.router.post("/sendEmail", this.notificacionMiddleware.xd, this.notificacionController.sendEmailNotificacionPrueba);
    }

    public getRouter(): Router{
        return this.router;
    }
}

export default NotificacionesRoutes.getInstance();  