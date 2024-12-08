import { DataTypes, Model } from "sequelize";
import ConnectionDatabaseService from "../db/connections";
import { IInstitutosAttributes, IInstitutosCreationAttributes } from "../interfaces/institutos.interface";

// Definir la clase Instituto que extiende Model
class Institutos extends Model<IInstitutosAttributes, IInstitutosCreationAttributes> implements IInstitutosAttributes {
    // Propiedades privadas
    private _idInstituto!: number;
    private _razonSocial!: string;
    private _RFC!: string;
    private _correo!: string;
    private _direccion!:string;
    private _telefono!:string;

    // Getters y setters públicos
    public get idInstituto(): number {
        return this._idInstituto;
    }

    public set idInstituto(value: number) {
        this._idInstituto = value;
    }

    public get razonSocial(): string {
        return this._razonSocial;
    }

    public set razonSocial(value: string) {
        this._razonSocial = value;
    }

    public get RFC(): string {
        return this._RFC;
    }

    public set RFC(value: string) {
        this._RFC = value;
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

    public get telefono(): string {
        return this._telefono;
    }

    public set telefono(value: string) {
        this._telefono = value;
    }
}

// Inicializar el modelo Instituto
export default Institutos.init({
    idInstituto: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        get() {
            return this.getDataValue('idInstituto');
        },
        set(value: number) {
            this.setDataValue('idInstituto', value);
        }
    },
    razonSocial: {
        type: DataTypes.TEXT,
        allowNull: false,
        unique: true,
        get() {
            return this.getDataValue('razonSocial');
        },
        set(value: string) {
            this.setDataValue('razonSocial', value);
        }
    },
    RFC: {
        type: DataTypes.STRING(13),
        allowNull: false,
        defaultValue: 'Por definir',
        get() {
            return this.getDataValue('RFC');
        },
        set(value: string) {
            this.setDataValue('RFC', value);
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
        allowNull: false,
        defaultValue: 'Por definir',
        get() {
            return this.getDataValue('direccion');
        },
        set(value: string) {
            this.setDataValue('direccion', value);
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
    modelName: 'Institutos',
    tableName: 'Institutos',
});
