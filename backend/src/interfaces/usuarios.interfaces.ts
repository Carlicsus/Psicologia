import { Optional } from "sequelize";

export interface IUsuariosUsernameOnly{
    usuario:string;
}

export interface IUsuariosEmailOnly{
    email:string;
}

export interface IUsuariosRegisteredStatus{
    usuario:string;
    confirmado:boolean;
}

export interface IUsuariosLogin {
    usuario:string;
    contrasena:string;
    confirmado:boolean;
}

export interface IUsuariosAttributes {
    usuario: string;
    nombres: string;
    apellidos: string;
    contrasena: string;
    email: string;
    confirmado: boolean;
    token: string | null;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface IUsuariosNewUserBody{
    usuario: string; 
    email: string;
    nombres: string;
    apellidos: string;
    contrasena: string;
}

export interface IUsuariosLoginUserBody{
    usuarioEmail: string;
    contrasena: string;
}

export interface IUsuariosCreationAttributes
  extends Optional<IUsuariosAttributes, 'token' | 'confirmado' | 'createdAt' | 'updatedAt' > {}