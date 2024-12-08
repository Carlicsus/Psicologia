import { DataTypes, Model } from "sequelize";
import ConnectionDatabaseService from "../db/connections";
import loggerService from "../helpers/loggerService";
import { Institutos, SolicitantesExpedientes, Inventores, InventoresExpedientes } from "./index.model";
import { IExpedientesAtrributes, IExpedientesCreationAttributes } from "../interfaces/expedientes.interface";
import InstitutosDAO from '../dao/institutos.dao'
import SolicitantesExpedientesDAO from '../dao/solicitantesExpedientes.dao'
import InventoresDAO from "../dao/inventores.dao";
import InventoresExpedientesDAO from "../dao/inventoresExpedientes.dao";

class Expedientes extends Model<IExpedientesAtrributes, IExpedientesCreationAttributes> implements IExpedientesAtrributes {
    // Propiedades privadas
    private _noExpediente!: string;
    private _fechaPresentacion!: Date | null;
    private _titulo!: string | null;
    private _resumen!: string | null;
    private _status!: boolean

    // Getters y setters públicos
    public get noExpediente(): string {
        return this._noExpediente;
    }

    public set noExpediente(value: string) {
        this._noExpediente = value;
    }

    public get fechaPresentacion(): Date | null {
        return this._fechaPresentacion;
    }

    public set fechaPresentacion(value: Date | null) {
        this._fechaPresentacion = value;
    }

    public get titulo(): string | null {
        return this._titulo;
    }

    public set titulo(value: string | null) {
        this._titulo = value;
    }

    public get resumen(): string | null {
        return this._resumen;
    }

    public set resumen(value: string | null) {
        this._resumen = value;
    }

    public get status(): boolean {
        return this._status;
    }

    public set status(value: boolean) {
        this._status = value;
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
    fechaPresentacion: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        get() {
            return this.getDataValue('fechaPresentacion');
        },
        set(value: Date | null) {
            this.setDataValue('fechaPresentacion', value);
        }
    },
    titulo: {
        type: DataTypes.TEXT,
        allowNull: true,
        get() {
            return this.getDataValue('titulo');
        },
        set(value: string | null) {
            this.setDataValue('titulo', value);
        }
    },
    resumen: {
        type: DataTypes.TEXT,
        allowNull: true,
        get() {
            return this.getDataValue('resumen');
        },
        set(value: string | null) {
            this.setDataValue('resumen', value);
        }
    },
    status:{
        type:DataTypes.BOOLEAN,
        allowNull:false,
        defaultValue:true,
        get() {
            return this.getDataValue('status');
        },
        set(value: boolean) {
            this.setDataValue('status', value);
        }
    }
}, {
    sequelize: ConnectionDatabaseService.getConnectionSequelize(), // referencia a la conexión sequelize
    modelName: 'Expedientes',
    tableName: 'Expedientes',
});

// Exportar el modelo
