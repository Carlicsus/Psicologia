import { Request, Response } from "express";
import { IUsuariosLoginUserBody, IUsuariosNewUserBody } from "../interfaces/usuarios.interfaces";
import UsuariosDAO from "../dao/usuarios.dao";
import TokenService from "../helpers/token";

class UsuarioController {

    private static instance: UsuarioController;

    private constructor() {}

    public static getInstance(): UsuarioController{
        if(!UsuarioController.instance){
            UsuarioController.instance = new UsuarioController();
        }
        return UsuarioController.instance;
    }
    
    public async newUser(req: Request, res: Response): Promise<Response> {
    const body: IUsuariosNewUserBody = req.body;

    const { usuario, email, nombres, apellidos, contrasena } = body;

    const usernameInUse = await UsuariosDAO.findOneUserByUsername(usuario);
    
    if (usernameInUse) {
        return res.status(409).json({ msg: `Ya existe un usuario con el nombre ${usuario}` });
    }

    const emailInUse = await UsuariosDAO.findOneUserByEmail(email);
    if (emailInUse) {
        return res.status(409).json({ msg: `Ya existe un usuario con el correo ${email}` });
    }

    const newToken = TokenService.generarId();

    try {
        await UsuariosDAO.createOneUser({
            usuario,
            nombres,
            apellidos,
            contrasena,
            email,
            token: newToken
        });
    } catch (error) {
        return res.status(500).json({ msg: "Upss ocurrió un error"});
    }

    return res.status(201).json({ msg: `Se le mando un correo al admin espere su confirmación` });
    }

    public async loginUser(req: Request, res: Response): Promise<Response> {
        const body: IUsuariosLoginUserBody = req.body

    const { usuarioEmail, contrasena } = body

    //validamos si el usuario existe en la db
    const user = await UsuariosDAO.findOneUserByLogin(usuarioEmail,contrasena);
    
    if(!user){
        return res.status(401).json({
            msg:`El nombre de usuario o la contraseña no es valido`
        })
    }
    
    if(!user.confirmado){
        return res.status(401).json({
            msg:`Tu cuenta no ha sido confirmada`
        })
    }

    //generamos token
    const token = TokenService.generarJWT({usuario:user.usuario})

    return res.status(200).json(token)
    }

    public async confirmar(req: Request, res: Response): Promise<Response | void> {
        const token: string = req.params.token; 
  
        // Verificar si el token es valido
        const confirm = await UsuariosDAO.confirmUserByToken(token);

        if (!confirm){
            return res.status(302).redirect("/noConfirmed");
        }
    
        return res.status(302).redirect("/confirmed");
    }
}

export default UsuarioController.getInstance();
