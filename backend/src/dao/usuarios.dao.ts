import { Op } from "sequelize";
import bcrypt from "bcrypt";
import { Usuarios } from "../models/index.model";
import { IUsuariosRegisteredStatus, IUsuariosEmailOnly, IUsuariosLogin, IUsuariosUsernameOnly, IUsuariosCreationAttributes } from "../interfaces/usuarios.interfaces";
import loggerService from "../helpers/loggerService";

class UsuariosDAO {

    private static instance: UsuariosDAO;

    private constructor() {}

    public static getInstance(): UsuariosDAO{
        if(!UsuariosDAO.instance){
            UsuariosDAO.instance = new UsuariosDAO();
        }
        return UsuariosDAO.instance;
    }

    public async findOneUserByUsername(username: string): Promise<IUsuariosUsernameOnly | null> {
        const user = await Usuarios.findOne({
            where: {
                usuario: username
            },
            attributes: { exclude: ['nombres', 'apellidos', 'contrasena', 'email', 'confirmado', 'token', 'createdAt', 'updatedAt'] },
            raw: true
        });
        return user as IUsuariosUsernameOnly | null;
    }

    public async findOneUserByEmail(email: string): Promise<IUsuariosEmailOnly | null> {
        const user = await Usuarios.findOne({
            where: {
                email: email
            },
            attributes: { exclude: ['nombres', 'apellidos', 'contrasena', 'usuario', 'confirmado', 'token', 'createdAt', 'updatedAt'] },
            raw: true
        });
        return user as IUsuariosEmailOnly | null;
    }

    public async findOneUserByLogin(usuarioEmail: string, contrasena: string): Promise<IUsuariosRegisteredStatus | null> {
        const user = await Usuarios.findOne({
            where: {
                [Op.or]: [
                    { usuario: usuarioEmail },
                    { email: usuarioEmail }
                ]
            },
            attributes: { exclude: ['nombres', 'apellidos', 'email', 'token', 'createdAt', 'updatedAt'] },
            raw: true
        }) as IUsuariosLogin | null;

        if (!user) {
            return null;
        }

        const passwordValid = await bcrypt.compare(contrasena, user.contrasena!);

        if (!passwordValid) {
            return null;
        }

        return { usuario: user.usuario, confirmado: user.confirmado } as IUsuariosRegisteredStatus;
    }

    public async createOneUser(data: IUsuariosCreationAttributes): Promise<void> {
        await Usuarios.create(data);
    }

    public async confirmUserByToken(token: string): Promise<boolean> {
        const usuario = await Usuarios.findOne({
            where: {
                token: token
            }
        });

        if (!usuario) {
            return false;
        }

        usuario.token = null;
        usuario.confirmado = true;

        await usuario.save();

        return true;
    }

    public async deleteUsersNoConfirmados(fechaLimite: Date): Promise<void> {
        const usuariosNoConfirmados = await Usuarios.findAll({
            where: {
                confirmado: false,
                createdAt: {
                    [Op.lt]: fechaLimite
                }
            },
            raw: true
        });

        if (usuariosNoConfirmados.length > 0) {
            await Usuarios.destroy({
                where: {
                    usuario: usuariosNoConfirmados.map((usuario) => usuario.usuario)
                }
            });
            loggerService.log('info', "Usuarios no confirmados eliminados con éxito.");
            return;
        }
        loggerService.log('info', "No se encontraron usuarios con mas de 1 dia sin ser confirmados");
        return;
    }
}

export default UsuariosDAO.getInstance();
