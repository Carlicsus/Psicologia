import { DataTypes, Model } from "sequelize";
import ConnectionDatabaseService from "../db/connections";
import loggerService from "../helpers/loggerService";
import {} from "./index.model";
import { IExpedientesAtrributes, IExpedientesCreationAttributes } from "../interfaces/expedientes.interface";


class Expedientes extends Model<IExpedientesAtrributes, IExpedientesCreationAttributes> implements IExpedientesAtrributes {
    // Propiedades privadas
    private _matricula!: number;
    private _nombreCompleto!: string;
    private _cuatrimestre!: number ;
    private _carrera!: string;
    private _correo!: string;
    private _telefono!: number ;
    private _estatus!: boolean

    // Getters y setters públicos
    public get matricula(): number {
        return this._matricula;
    }

    public set matricula(value: number) {
        this._matricula = value;
    }

    public get nombreCompleto(): string  {
        return this._nombreCompleto;
    }

    public set nombreCompleto(value: string) {
        this._nombreCompleto = value;
    }

    public get cuatrimestre(): number {
        return this._cuatrimestre;
    }

    public set cuatrimestre(value: number) {
        this._cuatrimestre = value;
    }
    
    public get carrera(): string  {
        return this._carrera;
    }
    
    public set carrera(value: string) {
        this._carrera = value;
    }
    
    public get correo(): string  {
        return this._correo;
    }
    
    public set correo(value: string) {
        this._correo = value;
    }
    
    public get telefono(): number {
        return this._telefono;
    }

    public set telefono(value: number) {
        this._telefono = value;
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
    matricula: {
        type: DataTypes.STRING(20),
        primaryKey: true,
        unique: true,
        get() {
            return this.getDataValue('matricula');
        },
        set(value: number) {
            this.setDataValue('matricula', value);
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
    cuatrimestre: {
        type: DataTypes.TEXT,
        allowNull: true,
        get() {
            return this.getDataValue('cuatrimestre');
        },
        set(value: number) {
            this.setDataValue('cuatrimestre', value);
        }
    },
    carrera: {
        type: DataTypes.TEXT,
        allowNull: false,
        get() {
            return this.getDataValue('carrera');
        },
        set(value: string) {
            this.setDataValue('carrera', value);
        }
    },
    correo: {
        type: DataTypes.TEXT,
        allowNull: false,
        get() {
            return this.getDataValue('correo');
        },
        set(value: string) {
            this.setDataValue('correo', value);
        }
    },
    telefono: {
        type: DataTypes.TEXT,
        allowNull: true,
        get() {
            return this.getDataValue('telefono');
        },
        set(value: number) {
            this.setDataValue('telefono', value);
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
