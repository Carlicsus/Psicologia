import { Router } from 'express';
import ExpedientesController from '../controllers/expedientes.controller';
import AuthMiddleware from '../middleware/auth.middleware';
import ExpedientesMiddleware from '../middleware/expedientes.middleware';

class ExpedientesRoutes{

    private static instance: ExpedientesRoutes;
    private router: Router;
    private expedienteController: typeof ExpedientesController;
    private expedienteMiddleware: typeof ExpedientesMiddleware;
    private authMiddleware: typeof AuthMiddleware;

    private constructor() {
        this.router = Router();
        this.expedienteController =  ExpedientesController;
        this.expedienteMiddleware = ExpedientesMiddleware;
        this.authMiddleware = AuthMiddleware;
        this.initializeRoutes();
    }

    public static getInstance(): ExpedientesRoutes{
        if(!ExpedientesRoutes.instance){
            ExpedientesRoutes.instance = new ExpedientesRoutes();
        }
        return ExpedientesRoutes.instance;
    }

    private initializeRoutes(): void {
        this.router.post("/create", /*this.authMiddleware.validateToken,*/ this.expedienteMiddleware.createExpedienteValidator, this.expedienteController.create);
        this.router.get("/getAll",this.expedienteController.getAll)
    }

    public getRouter(): Router{
        return this.router;
    }
}

export default ExpedientesRoutes.getInstance();  