import { Request, Response } from 'express';
import InventoresDAO from '../dao/inventores.dao';

class InventoresController {

  private static instance: InventoresController;

  private constructor() {}

  public static getInstance(): InventoresController{
    if(!InventoresController.instance){
      InventoresController.instance = new InventoresController();
    }
    return InventoresController.instance;
  }

  // TODO: Agregar {idInventor:number} a una interface
  public async getOneInventor (req: Request, res: Response): Promise<Response> {
    const idInventor: number = Number(req.params.idInventor);      
    const inventor = await InventoresDAO.findInventorById(idInventor);

    if (inventor){
      return res.status(200).json(inventor)
    }
    
    return res.status(404).json({ msg: 'Inventor no encontrado.' });
  }
      
  // TODO: Crear la interface para la request
  public async updateOneInventor (req: Request<{idInventor:number}>, res:Response): Promise<Response> {
    const { idInventor } = req.params;
    const { correo, direccion, CURP, telefono} = req.body;
    const updated = await InventoresDAO.updateInventorById(idInventor, {
      correo,
      direccion:direccion,
      CURP:CURP,
      telefono
    });

    if (updated) {
      return res.status(200).json({ msg: 'Inventor actualizado correctamente.' });
    } 
    
    return res.status(404).json({ msg: 'Inventor no encontrado.' });
  }
}

export default InventoresController.getInstance();