import { DataTypes, Model } from "sequelize";
import ConnectionDatabaseService from "../db/connections";
import { IHistoricosExpedientesAttributes, IHistoricosExpedientesCreationAttributes } from "../interfaces/historicosExpedientes.interface";
import { Expedientes } from "./index.model";

// Definir la clase HistoricoExpediente que extiende Model
class HistoricosExpedientes extends Model<IHistoricosExpedientesAttributes, IHistoricosExpedientesCreationAttributes> implements IHistoricosExpedientesAttributes {
    // Propiedades privadas
    private _noDocumento!: string;
    private _noExpediente!: string;
    private _secion!: number;
    private _resumen!: string;
    private _actividad!: string | null;
    private _fecha!: Date;

    // Getters y setters públicos
    public get noDocumento(): string {
        return this._noDocumento;
    }

    public set noDocumento(value: string) {
        this._noDocumento = value;
    }

    public get noExpediente(): string {
        return this._noExpediente;
    }

    public set noExpediente(value: string) {
        this._noExpediente = value;
    }

    public get secion(): number {
        return this._secion;
    }

    public set secion(value: number) {
        this._secion = value;
    }

    public get resumen(): string {
        return this._resumen;
    }

    public set resumen(value: string) {
        this._resumen = value;
    }

    public get actividad(): string | null {
        return this._actividad;
    }

    public set actividad(value: string | null) {
        this._actividad = value;
    }

    public get fecha(): Date {
        return this._fecha;
    }

    public set fecha(value: Date) {
        this._fecha = value;
    }
}

// Inicializar el modelo HistoricoExpediente
export default HistoricosExpedientes.init({
    noDocumento: {
        type: DataTypes.STRING(20),
        primaryKey: true,
        get() {
            return this.getDataValue('noDocumento');
        },
        set(value: string) {
            this.setDataValue('noDocumento', value);
        }
    },
    noExpediente: {
        type: DataTypes.STRING(20),
        references: {
            model: Expedientes,
            key: 'noExpediente'
        },
        allowNull: false,
        get() {
            return this.getDataValue('noExpediente');
        },
        set(value: string) {
            this.setDataValue('noExpediente', value);
        }
    },
    secion: {
        type: DataTypes.INTEGER,
        allowNull: false,
        get() {
            return this.getDataValue('secion');
        },
        set(value: number) {
            this.setDataValue('secion', value);
        }
    },
    resumen: {
        type: DataTypes.TEXT,
        allowNull: false,
        get() {
            return this.getDataValue('resumen');
        },
        set(value: string) {
            this.setDataValue('resumen', value);
        }
    },
    actividad: {
        type: DataTypes.TEXT,
        allowNull: true,
        get() {
            return this.getDataValue('actividad');
        },
        set(value: string | null) {
            this.setDataValue('actividad', value);
        }
    },
    fecha: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        get() {
            return this.getDataValue('fecha');
        },
        set(value: Date) {
            this.setDataValue('fecha', value);
        }
    }
}, {
    sequelize: ConnectionDatabaseService.getConnectionSequelize(),
    modelName: 'HistoricosExpedientes',
    tableName: 'HistoricosExpedientes'
});
