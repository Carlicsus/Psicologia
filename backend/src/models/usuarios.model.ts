import bcrypt from 'bcrypt';
import { DataTypes, Model } from 'sequelize';
import ConnectionDatabaseService from "../db/connections";
import EmailService from "../helpers/email";
import { IUsuariosAttributes, IUsuariosCreationAttributes } from '../interfaces/usuarios.interfaces';

class Usuarios extends Model<IUsuariosAttributes, IUsuariosCreationAttributes> implements IUsuariosAttributes {
  // Propiedades privadas
  private _usuario!: string;
  private _nombres!: string;
  private _apellidos!: string;
  private _contrasena!: string;
  private _email!: string;
  private _confirmado!: boolean;
  private _token!: string | null;

  // Getters y setters públicos
  public get usuario(): string {
    return this._usuario;
  }

  public set usuario(value: string) {
    this._usuario = value;
  }

  public get nombres(): string {
    return this._nombres;
  }

  public set nombres(value: string) {
    this._nombres = value;
  }

  public get apellidos(): string {
    return this._apellidos;
  }

  public set apellidos(value: string) {
    this._apellidos = value;
  }

  public get contrasena(): string {
    return this._contrasena;
  }

  public set contrasena(value: string) {
    this._contrasena = value;
  }

  public get email(): string {
    return this._email;
  }

  public set email(value: string) {
    this._email = value;
  }

  public get confirmado(): boolean {
    return this._confirmado;
  }

  public set confirmado(value: boolean) {
    this._confirmado = value;
  }

  public get token(): string | null {
    return this._token;
  }

  public set token(value: string | null) {
    this._token = value;
  }

  // Métodos estáticos
  static async beforeCreateHook(usuario: Usuarios) {
    if (usuario.contrasena) {
      const hashedPassword = await bcrypt.hash(usuario.contrasena, 10);
      usuario.contrasena = hashedPassword;
    }
  }

  static async afterCreateHook(usuario: Usuarios) {
    EmailService.sendEmailRegistro({ usuario: usuario.usuario, token: usuario.token! });
  }
}

export default Usuarios.init({
  usuario: {
    type: DataTypes.TEXT,
    primaryKey: true,
    unique: true,
    allowNull: false,
    get() {
      return this.getDataValue('usuario');
    },
    set(value: string) {
      this.setDataValue('usuario', value);
    }
  },
  nombres: {
    type: DataTypes.TEXT,
    allowNull: false,
    get() {
      return this.getDataValue('nombres');
    },
    set(value: string) {
      this.setDataValue('nombres', value);
    }
  },
  apellidos: {
    type: DataTypes.TEXT,
    allowNull: false,
    get() {
      return this.getDataValue('apellidos');
    },
    set(value: string) {
      this.setDataValue('apellidos', value);
    }
  },
  contrasena: {
    type: DataTypes.STRING(60),
    allowNull: false,
    get() {
      return this.getDataValue('contrasena');
    },
    set(value: string) {
      this.setDataValue('contrasena', value);
    }
  },
  email: {
    type: DataTypes.STRING(50),
    allowNull: false,
    get() {
      return this.getDataValue('email');
    },
    set(value: string) {
      this.setDataValue('email', value);
    }
  },
  confirmado: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    get() {
      return this.getDataValue('confirmado');
    },
    set(value: boolean) {
      this.setDataValue('confirmado', value);
    }
  },
  token: {
    type: DataTypes.STRING(50),
    get() {
      return this.getDataValue('token');
    },
    set(value: string | null) {
      this.setDataValue('token', value);
    }
  }
},{
  sequelize: ConnectionDatabaseService.getConnectionSequelize(),
  modelName: 'Usuarios',
  tableName: 'Usuarios',
  hooks: {
      beforeCreate: Usuarios.beforeCreateHook,
      afterCreate: Usuarios.afterCreateHook
  }
});
