import { DataTypes, Model } from "sequelize";
import ConnectionDatabaseService from "../db/connections";
import { IHistoricosExpedientesAttributes, IHistoricosExpedientesCreationAttributes } from "../interfaces/historicosExpedientes.interface";
import { Expedientes } from "./index.model";

// Definir la clase HistoricoExpediente que extiende Model
class HistoricosExpedientes extends Model<IHistoricosExpedientesAttributes, IHistoricosExpedientesCreationAttributes> implements IHistoricosExpedientesAttributes {
    // Propiedades privadas
    private _noDocumento!: string;
    private _noExpediente!: string;
    private _codigoBarras!: string;
    private _descripcion!: string;
    private _tipo!: string;
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

    public get codigoBarras(): string {
        return this._codigoBarras;
    }

    public set codigoBarras(value: string) {
        this._codigoBarras = value;
    }

    public get descripcion(): string {
        return this._descripcion;
    }

    public set descripcion(value: string) {
        this._descripcion = value;
    }

    public get tipo(): string {
        return this._tipo;
    }

    public set tipo(value: string) {
        this._tipo = value;
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
    codigoBarras: {
        type: DataTypes.STRING(255),
        allowNull: false,
        get() {
            return this.getDataValue('codigoBarras');
        },
        set(value: string) {
            this.setDataValue('codigoBarras', value);
        }
    },
    descripcion: {
        type: DataTypes.TEXT,
        allowNull: false,
        get() {
            return this.getDataValue('descripcion');
        },
        set(value: string) {
            this.setDataValue('descripcion', value);
        }
    },
    tipo: {
        type: DataTypes.TEXT,
        allowNull: false,
        get() {
            return this.getDataValue('tipo');
        },
        set(value: string) {
            this.setDataValue('tipo', value);
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
