import { IUsuariosCreationAttributes } from "../interfaces/usuarios.interfaces";
import bcrypt from "bcrypt";

const usuariosSeed:IUsuariosCreationAttributes[] = [
    {
        usuario: process.env.USUARIO_ADMIN!,
        nombres: process.env.NOMBRES_ADMIN!,
        apellidos: process.env.APELLIDOS_ADMIN!,
        contrasena: bcrypt.hashSync(process.env.CONTRASENA_ADMIN!,10),
        email: process.env.EMAIL_ADMIN!,
        confirmado:true
    }
]

export default usuariosSeed