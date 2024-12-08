import { Router } from 'express';
import AuthMiddleware from '../middleware/auth.middleware';
import InventoresController from '../controllers/inventores.controller';
import InventoresMiddleware from '../middleware/inventores.middleware';

class InventoresRoutes{

    private static instance: InventoresRoutes;
    private router: Router;
    private inventoresController: typeof InventoresController;
    private inventoresMiddleware: typeof InventoresMiddleware;
    private authMiddleware: typeof AuthMiddleware;

    private constructor() {
        this.router = Router();
        this.inventoresController = InventoresController;
        this.inventoresMiddleware = InventoresMiddleware;
        this.authMiddleware = AuthMiddleware;
        this.initializeRoutes();
    }

    public static getInstance(): InventoresRoutes{
        if(!InventoresRoutes.instance){
            InventoresRoutes.instance = new InventoresRoutes();
        }
        return InventoresRoutes.instance;
    }

    private initializeRoutes(): void {
        // TODO: Agregar el validate token !!!!!!!!!!!
        this.router.get('/getOne/:idInventor', this.authMiddleware.validateToken, this.inventoresMiddleware.getOneInventorValidator, this.inventoresController.getOneInventor);
        this.router.put('/updateOne/:idInventor', this.inventoresMiddleware.updateOneValidator, this.inventoresController.updateOneInventor);
    }

    public getRouter(): Router{
        return this.router;
    }
}

export default InventoresRoutes.getInstance();  