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
        this.router.get('/getHistorico/:noExpediente',this.authMiddleware.validateToken,this.historicoMiddleware.getAllHistoricoExpedienteValidator,this.historicoController.getHistoricoExpediente);
        this.router.get('/downloadPDF/:noExpediente/:noDocumento',this.authMiddleware.validateToken,this.historicoMiddleware.downloadPDFValidator,this.historicoController.downloadPDF)
        this.router.post('/launch',this.authMiddleware.validateToken,this.historicoController.lauchScraperHistorico);
    }

    public getRouter(): Router{
        return this.router;
    }
}

export default HistoricosExpedientesRoutes.getInstance();