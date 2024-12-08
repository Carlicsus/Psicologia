// Importamos los tipos de datos de sequelize
import { DataTypes, Model } from "sequelize";
// Importamos la referencia a la base de datos
import ConnectionDatabaseService from "../db/connections";
import { IInventoresExpedientesAttributes, IInventoresExpedientesCreationAttributes } from "../interfaces/inventoresExpedientes.interface";
import { Expedientes, Inventores } from './index.model'

// Clase del modelo InventorExpediente que extiende de Model y representa la tabla en la base de datos
class InventoresExpedientes extends Model<IInventoresExpedientesAttributes, IInventoresExpedientesCreationAttributes> implements IInventoresExpedientesAttributes {
    // Propiedades privadas
    private _idInventorExpediente!: number;
    private _idInventor!: number;
    private _noExpediente!: string;

    // Getters y setters públicos
    public get idInventorExpediente(): number {
        return this._idInventorExpediente;
    }

    public set idInventorExpediente(value: number) {
        this._idInventorExpediente = value;
    }

    public get idInventor(): number {
        return this._idInventor;
    }

    public set idInventor(value: number) {
        this._idInventor = value;
    }

    public get noExpediente(): string {
        return this._noExpediente;
    }

    public set noExpediente(value: string) {
        this._noExpediente = value;
    }
}

// Inicializar el modelo con los atributos y la conexión sequelize
export default InventoresExpedientes.init({
    idInventorExpediente: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        get() {
            return this.getDataValue('idInventorExpediente');
        },
        set(value: number) {
            this.setDataValue('idInventorExpediente', value);
        }
    },
    idInventor: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Inventores,
            key: 'idInventor'
        },
        get() {
            return this.getDataValue('idInventor');
        },
        set(value: number) {
            this.setDataValue('idInventor', value);
        }
    },
    noExpediente: {
        type: DataTypes.STRING(20),
        allowNull: false,
        references: {
            model: Expedientes,
            key: 'noExpediente'
        },
        get() {
            return this.getDataValue('noExpediente');
        },
        set(value: string) {
            this.setDataValue('noExpediente', value);
        }
    }
}, {
    sequelize: ConnectionDatabaseService.getConnectionSequelize(), // referencia a la conexión sequelize
    modelName: 'InventoresExpedientes', // nombre del modelo en la base de datos
    tableName: 'InventoresExpedientes', // nombre de la tabla en la base de datos (opcional)
});
