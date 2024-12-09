import { Router } from 'express';
import AlumnosController from '../controllers/alumnos.controller';
import AuthMiddleware from '../middleware/auth.middleware';
import AlumnosMiddleware from '../middleware/alumnos.middleware';

class AlumnosRoutes {

  private static instance: AlumnosRoutes;
  private router: Router;
  private alumnoController: typeof AlumnosController;
  private alumnoMiddleware: typeof AlumnosMiddleware;
  private authMiddleware: typeof AuthMiddleware;

  private constructor() {
    this.router = Router();
    this.alumnoController = AlumnosController;
    this.alumnoMiddleware = AlumnosMiddleware;
    this.authMiddleware = AuthMiddleware;
    this.initializeRoutes();
  }

  public static getInstance(): AlumnosRoutes {
    if (!AlumnosRoutes.instance) {
      AlumnosRoutes.instance = new AlumnosRoutes();
    }
    return AlumnosRoutes.instance;
  }

  private initializeRoutes(): void {
    this.router.post("/create", this.authMiddleware.validateToken, /*TODO: Algo xd*/);
  }

  public getRouter(): Router {
    return this.router;
  }
}

export default AlumnosRoutes.getInstance();  