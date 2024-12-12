import { Router } from "express";
import HistoricosController from "../controllers/historicosExpedientes.controller";
import AuthMiddleware from "../middleware/auth.middleware";
import HistoricosMiddleware from "../middleware/historicosExpedientes.middleware";

class HistoricosExpedientesRoutes{

    private static instance: HistoricosExpedientesRoutes;
    private router: Router;
    private historicoController: typeof HistoricosController;
    private historicoMiddleware: typeof HistoricosMiddleware;
    private authMiddleware: typeof AuthMiddleware;

    private constructor(){
        this.router = Router()
        this.historicoController = HistoricosController;
        this.historicoMiddleware = HistoricosMiddleware;
        this.authMiddleware = AuthMiddleware;
        this.initializeRoutes();
    }

    public static getInstance(): HistoricosExpedientesRoutes{
        if(!HistoricosExpedientesRoutes.instance){
            HistoricosExpedientesRoutes.instance = new HistoricosExpedientesRoutes();
        }
        return HistoricosExpedientesRoutes.instance;
    }

    private initializeRoutes(): void {
        // TODO: Agregar el validateToken !!!!!!!!!!!!!!
        this.router.get('/getHistorico/:noExpediente',this.historicoController.getHistoricoExpediente);
        this.router.post('/create',this.historicoMiddleware.createHistoricoExpedienteValidator,this.historicoController.create);
    }

    public getRouter(): Router{
        return this.router;
    }
}

export default HistoricosExpedientesRoutes.getInstance();