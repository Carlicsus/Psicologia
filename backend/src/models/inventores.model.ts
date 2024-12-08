// Importamos los tipos de datos de sequelize
import { DataTypes, Model } from "sequelize";
// Importamos la referencia a la base de datos
import ConnectionDatabaseService from "../db/connections";
import { IInventoresAttributes, IInventoresCreationAttributes } from "../interfaces/inventores.interface";
import { Institutos } from "./index.model";

// Definir la clase Inventores que extiende Model
class Inventores extends Model<IInventoresAttributes, IInventoresCreationAttributes> implements IInventoresAttributes {
    // Propiedades privadas
    private _idInventor!: number;
    private _nombreCompleto!: string;
    private _correo!: string;
    private _direccion!: string;
    private _CURP!: string;
    private _telefono!: string;

    // Getters y setters públicos
    public get idInventor(): number {
        return this._idInventor;
    }

    public set idInventor(value: number) {
        this._idInventor = value;
    }

    public get nombreCompleto(): string {
        return this._nombreCompleto;
    }

    public set nombreCompleto(value: string) {
        this._nombreCompleto = value;
    }

    public get correo(): string {
        return this._correo;
    }

    public set correo(value: string) {
        this._correo = value;
    }

    public get direccion(): string {
        return this._direccion;
    }

    public set direccion(value: string) {
        this._direccion = value;
    }

    public get CURP(): string {
        return this._CURP;
    }

    public set CURP(value: string) {
        this._CURP = value;
    }

    public get telefono(): string {
        return this._telefono;
    }

    public set telefono(value: string) {
        this._telefono = value;
    }
}

// Inicializar el modelo Inventores
export default Inventores.init({
    idInventor: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        get() {
            return this.getDataValue('idInventor');
        },
        set(value: number) {
            this.setDataValue('idInventor', value);
        }
    },
    nombreCompleto: {
        type: DataTypes.TEXT,
        allowNull: false,
        get() {
            return this.getDataValue('nombreCompleto');
        },
        set(value: string) {
            this.setDataValue('nombreCompleto', value);
        }
    },
    correo: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: 'Por definir',
        get() {
            return this.getDataValue('correo');
        },
        set(value: string) {
            this.setDataValue('correo', value);
        }
    },
    direccion: {
        type: DataTypes.TEXT,
        allowNull:false,
        defaultValue: 'Por definir',
        get() {
            return this.getDataValue('direccion');
        },
        set(value: string) {
            this.setDataValue('direccion', value);
        }
    },
    CURP:{
        type:DataTypes.STRING(18),
        allowNull:false,
        defaultValue: 'Por definir',
        get() {
            return this.getDataValue('CURP');
        },
        set(value: string) {
            this.setDataValue('CURP', value);
        }
    },
    telefono:{
        type:DataTypes.STRING(10),
        allowNull:false,
        defaultValue:'0000000000',
        get() {
            return this.getDataValue('telefono');
        },
        set(value: string) {
            this.setDataValue('telefono', value);
        }
    }
}, {
    sequelize: ConnectionDatabaseService.getConnectionSequelize(),
    modelName: 'Inventores',
    tableName: 'Inventores',
});
