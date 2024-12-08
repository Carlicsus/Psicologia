import { DataTypes, Model } from "sequelize";
import ConnectionDatabaseService from "../db/connections";
import loggerService from "../helpers/loggerService";
import { IAlumnosAttributes, IAlumnosCreationAttributes } from "../interfaces/alumnos.interface";


class Alumnos extends Model<IAlumnosAttributes, IAlumnosCreationAttributes> implements IAlumnosAttributes {
    // Propiedades privadas
    private _matricula!: number;
    private _nombres!: string;
    private _apellidos!: string;
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

    public get nombres(): string  {
        return this._nombres;
    }

    public set nombres(value: string) {
        this._nombres = value;
    }

    public get apellidos(): string  {
        return this._apellidos;
    }

    public set apellidos(value: string) {
        this._apellidos = value;
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
export default Alumnos.init({
    matricula: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        unique: true,
        get() {
            return this.getDataValue('matricula');
        },
        set(value: number) {
            this.setDataValue('matricula', value);
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
    cuatrimestre: {
        type: DataTypes.INTEGER,
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
        type: DataTypes.INTEGER,
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
    modelName: 'Alumnos',
    tableName: 'Alumnos',
});

// Exportar el modelo
