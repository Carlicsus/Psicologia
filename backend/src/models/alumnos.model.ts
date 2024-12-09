import { DataTypes, Model } from "sequelize";
import ConnectionDatabaseService from "../db/connections";
import loggerService from "../helpers/loggerService";
import { IAlumnosAttributes, IAlumnosCreationAttributes } from "../interfaces/alumnos.interface";


class Alumnos extends Model<IAlumnosAttributes, IAlumnosCreationAttributes> implements IAlumnosAttributes {
    // Propiedades privadas
    private _matricula!: string;
    private _nombres!: string;
    private _apellidos!: string;
    private _cuatrimestre!: string ;
    private _grupo!: string ;
    private _carrera!: string;
    private _correo!: string;
    private _telefono!: string ;
    private _estatus!: boolean

    // Getters y setters públicos
    public get matricula(): string {
        return this._matricula;
    }

    public set matricula(value: string) {
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

    public get cuatrimestre(): string {
        return this._cuatrimestre;
    }

    public set cuatrimestre(value: string) {
        this._cuatrimestre = value;
    }

    public get grupo(): string {
        return this._grupo;
    }

    public set grupo(value: string) {
        this._grupo = value;
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
    
    public get telefono(): string {
        return this._telefono;
    }

    public set telefono(value: string) {
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
        type: DataTypes.STRING(8),
        primaryKey: true,
        unique: true,
        get() {
            return this.getDataValue('matricula');
        },
        set(value: string) {
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
        type: DataTypes.STRING(2),
        allowNull: true,
        get() {
            return this.getDataValue('cuatrimestre');
        },
        set(value: string) {
            this.setDataValue('cuatrimestre', value);
        }
    },
    grupo: {
        type: DataTypes.TEXT,
        allowNull: false,
        get() {
            return this.getDataValue('grupo');
        },
        set(value: string) {
            this.setDataValue('grupo', value);
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
        type: DataTypes.STRING(10),
        allowNull: true,
        get() {
            return this.getDataValue('telefono');
        },
        set(value: string) {
            this.setDataValue('telefono', value);
        }
    },
    estatus:{
        type:DataTypes.BOOLEAN,
        allowNull:false,
        defaultValue:false,
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
