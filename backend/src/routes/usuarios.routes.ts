import { Router } from "express";
import UsuarioController from "../controllers/usuarios.controller";
import UsuarioMiddleware from "../middleware/usuarios.middleware";

class UsuarioRoutes {

    private static instance: UsuarioRoutes;
    private router: Router;
    private userController: typeof UsuarioController;
    private userMiddleware: typeof UsuarioMiddleware;

    private constructor() {
        this.router = Router();
        this.userController = UsuarioController;
        this.userMiddleware = UsuarioMiddleware;
        this.initializeRoutes();
    }

    public static getInstance(): UsuarioRoutes{
        if(!UsuarioRoutes.instance){
            UsuarioRoutes.instance = new UsuarioRoutes();
        }
        return UsuarioRoutes.instance;
    }

    private initializeRoutes(): void {
        this.router.post("/", this.userMiddleware.newUserValidator, this.userController.newUser);
        this.router.post("/login", this.userMiddleware.loginUserValidator, this.userController.loginUser);
        this.router.get("/confirmar/:token", this.userMiddleware.confirmarValidator, this.userController.confirmar);
    }

    public getRouter(): Router{
        return this.router;
    }
}

export default UsuarioRoutes.getInstance();
