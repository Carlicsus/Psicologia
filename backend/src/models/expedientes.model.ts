import { DataTypes, Model } from "sequelize";
import ConnectionDatabaseService from "../db/connections";
import loggerService from "../helpers/loggerService";
import { Alumnos, Usuarios } from "./index.model";
import { IExpedientesAtrributes, IExpedientesCreationAttributes } from "../interfaces/expedientes.interface";


class Expedientes extends Model<IExpedientesAtrributes, IExpedientesCreationAttributes> implements IExpedientesAtrributes {
    // Propiedades privadas
    private _noExpediente!: string;
    private _matricula!: number;
    private _usuario!: string;
    private _fecha!: Date;
    private _tipo!: string ;
    private _estatus!: boolean

    // Getters y setters públicos
    public get noExpediente(): string {
        return this._noExpediente;
    }

    public set noExpediente(value: string) {
        this._noExpediente = value;
    }

    public get matricula(): number {
        return this._matricula;
    }

    public set matricula(value: number) {
        this._matricula = value;
    }

    public get usuario(): string {
        return this._usuario;
    }

    public set usuario(value: string) {
        this._usuario = value;
    }

    public get fecha(): Date  {
        return this._fecha;
    }

    public set fecha(value: Date) {
        this._fecha = value;
    }

    public get tipo(): string {
        return this._tipo;
    }

    public set tipo(value: string) {
        this._tipo = value;
    }

    public get estatus(): boolean {
        return this._estatus;
    }

    public set estatus(value: boolean) {
        this._estatus = value;
    }
}

// Inicializar el modelo con los atributos y la conexión sequelize
export default Expedientes.init({
    noExpediente: {
        type: DataTypes.STRING(20),
        primaryKey: true,
        unique: true,
        get() {
            return this.getDataValue('noExpediente');
        },
        set(value: string) {
            this.setDataValue('noExpediente', value);
        }
    },
    matricula: {
        type: DataTypes.INTEGER,
        references: {
            model: Alumnos,
            key: 'matricula'
        },
        allowNull: false,
        get() {
            return this.getDataValue('noExpediente');
        },
        set(value: string) {
            this.setDataValue('noExpediente', value);
        }
    },
    usuario: {
        type: DataTypes.TEXT,
        references: {
            model: Usuarios,
            key: 'usuario'
        },
        allowNull: false,
        get() {
            return this.getDataValue('usuario');
        },
        set(value: string) {
            this.setDataValue('usuario', value);
        }
    },
    fecha: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        get() {
            return this.getDataValue('fecha');
        },
        set(value: Date) {
            this.setDataValue('fecha', value);
        }
    },
    tipo: {
        type: DataTypes.TEXT,
        allowNull: true,
        get() {
            return this.getDataValue('tipo');
        },
        set(value: string) {
            this.setDataValue('tipo', value);
        }
    },
    estatus:{
        type:DataTypes.BOOLEAN,
        allowNull:false,
        defaultValue:true,
        get() {
            return this.getDataValue('estatus');
        },
        set(value: boolean) {
            this.setDataValue('estatus', value);
        }
    }
}, {
    sequelize: ConnectionDatabaseService.getConnectionSequelize(), // referencia a la conexión sequelize
    modelName: 'Expedientes',
    tableName: 'Expedientes',
});

// Exportar el modelo
