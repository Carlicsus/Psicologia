import { DataTypes, Model } from "sequelize";
import ConnectionDatabaseService from "../db/connections";
import { ITemporalesNotificacionesAttributes, ITemporalesNotificacionesCreationAttributes } from "../interfaces/temporalesNotificaciones.interface";
import { Expedientes, Gacetas, HistoricosExpedientes, Secciones } from './index.model';

// Definir la clase Notificaciones que extiende Model
class TemporalesNotificaciones extends Model<ITemporalesNotificacionesAttributes, ITemporalesNotificacionesCreationAttributes> implements ITemporalesNotificacionesAttributes {
    // Propiedades privadas
    private _idTemporalNotificacion!: number;
    private _noExpediente!: string;
    private _ejemplar!: string;
    private _idGaceta!: number;
    private _idSeccion!: number;
    private _fechaCirculacion!: Date;
    private _descripcionGeneralAsunto!: string;
    private _fechaOficio!: string | null;
    private _numeroOficio!: number | null;

    // Getters y setters públicos
    public get idTemporalNotificacion(): number {
        return this._idTemporalNotificacion;
    }

    public set idTemporalNotificacion(value: number) {
        this._idTemporalNotificacion = value;
    }

    public get noExpediente(): string {
        return this._noExpediente;
    }

    public set noExpediente(value: string) {
        this._noExpediente = value;
    }

    public get ejemplar(): string {
        return this._ejemplar;
    }

    public set ejemplar(value: string) {
        this._ejemplar = value;
    }

    public get idGaceta(): number {
        return this._idGaceta;
    }

    public set idGaceta(value: number) {
        this._idGaceta = value;
    }

    public get idSeccion(): number {
        return this._idSeccion;
    }

    public set idSeccion(value: number) {
        this._idSeccion = value;
    }

    public get fechaCirculacion(): Date {
        return this._fechaCirculacion;
    }

    public set fechaCirculacion(value: Date) {
        this._fechaCirculacion = value;
    }

    public get descripcionGeneralAsunto(): string {
        return this._descripcionGeneralAsunto;
    }

    public set descripcionGeneralAsunto(value: string) {
        this._descripcionGeneralAsunto = value;
    }

    public get fechaOficio(): string | null {
        return this._fechaOficio;
    }

    public set fechaOficio(value: string | null) {
        this._fechaOficio = value;
    }

    public get numeroOficio(): number | null {
        return this._numeroOficio;
    }

    public set numeroOficio(value: number | null) {
        this._numeroOficio = value;
    }
}

// Inicializar el modelo Notificaciones
export default TemporalesNotificaciones.init({
    idTemporalNotificacion: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        get() {
            return this.getDataValue('idTemporalNotificacion');
        },
        set(value: number) {
            this.setDataValue('idTemporalNotificacion', value);
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
    ejemplar: {
        type: DataTypes.TEXT,
        allowNull: false,
        get() {
            return this.getDataValue('ejemplar');
        },
        set(value: string) {
            this.setDataValue('ejemplar', value);
        }
    },
    idGaceta: {
        type: DataTypes.INTEGER,
        references: {
            model: Gacetas,
            key: 'idGaceta'
        },
        allowNull: false,
        get() {
            return this.getDataValue('idGaceta');
        },
        set(value: number) {
            this.setDataValue('idGaceta', value);
        }
    },
    idSeccion: {
        type: DataTypes.INTEGER,
        references: {
            model: Secciones,
            key: 'idSeccion'
        },
        allowNull: false,
        get() {
            return this.getDataValue('idSeccion');
        },
        set(value: number) {
            this.setDataValue('idSeccion', value);
        }
    },
    fechaCirculacion: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        get() {
            return this.getDataValue('fechaCirculacion');
        },
        set(value: Date) {
            this.setDataValue('fechaCirculacion', value);
        }
    },
    descripcionGeneralAsunto: {
        type: DataTypes.TEXT,
        allowNull: false,
        get() {
            return this.getDataValue('descripcionGeneralAsunto');
        },
        set(value: string) {
            this.setDataValue('descripcionGeneralAsunto', value);
        }
    },
    fechaOficio: {
        type: DataTypes.TEXT,
        allowNull: true,
        get() {
            return this.getDataValue('fechaOficio');
        },
        set(value: string | null) {
            this.setDataValue('fechaOficio', value);
        }
    },
    numeroOficio: {
        type: DataTypes.INTEGER,
        allowNull: true,
        get() {
            return this.getDataValue('numeroOficio');
        },
        set(value: number | null) {
            this.setDataValue('numeroOficio', value);
        }
    }
}, {
    sequelize: ConnectionDatabaseService.getConnectionSequelize(),
    modelName: 'TemporalesNotificaciones',
    tableName: 'TemporalesNotificaciones'
});
