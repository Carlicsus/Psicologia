import { DataTypes, Model } from "sequelize";
import ConnectionDatabaseService from "../db/connections";
import { IGacetasAttributes, IGacetasCreationAttributes } from "../interfaces/gacetas.interface";

// Definir la clase Gaceta que extiende Model
class Gacetas extends Model<IGacetasAttributes, IGacetasCreationAttributes> implements IGacetasAttributes {
    // Propiedades privadas
    private _idGaceta!: number;
    private _nombreGaceta!: string;

    // Getters y setters públicos
    public get idGaceta(): number {
        return this._idGaceta;
    }

    public set idGaceta(value: number) {
        this._idGaceta = value;
    }

    public get nombreGaceta(): string {
        return this._nombreGaceta;
    }

    public set nombreGaceta(value: string) {
        this._nombreGaceta = value;
    }
}

// Inicializar el modelo Gaceta
export default Gacetas.init({
    idGaceta: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        get() {
            return this.getDataValue('idGaceta');
        },
        set(value: number) {
            this.setDataValue('idGaceta', value);
        }
    },
    nombreGaceta: {
        type: DataTypes.TEXT,
        allowNull: false,
        get() {
            return this.getDataValue('nombreGaceta');
        },
        set(value: string) {
            this.setDataValue('nombreGaceta', value);
        }
    }
}, {
    sequelize: ConnectionDatabaseService.getConnectionSequelize(),
    modelName: 'Gacetas',
    tableName: 'Gacetas'
});
