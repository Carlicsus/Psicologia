// Importamos los módulos necesarios
import { DataTypes, Model } from "sequelize";
import ConnectionDatabaseService from "../db/connections";
import { ISeccionesAttributes, ISeccionesCreationAttributes } from "../interfaces/secciones.interface";

// Define la clase Seccion extendiendo Model e implementando la interfaz
class Secciones extends Model<ISeccionesAttributes, ISeccionesCreationAttributes> implements ISeccionesAttributes {
    // Propiedades privadas
    private _idSeccion!: number;
    private _nombreSeccion!: string;

    // Getters y setters públicos
    public get idSeccion(): number {
        return this._idSeccion;
    }

    public set idSeccion(value: number) {
        this._idSeccion = value;
    }

    public get nombreSeccion(): string {
        return this._nombreSeccion;
    }

    public set nombreSeccion(value: string) {
        this._nombreSeccion = value;
    }
}

// Inicializa el modelo Seccion
export default Secciones.init(
    {
        idSeccion: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            get() {
                return this.getDataValue('idSeccion');
            },
            set(value: number) {
                this.setDataValue('idSeccion', value);
            }
        },
        nombreSeccion: {
            type: DataTypes.TEXT,
            allowNull: false,
            get() {
                return this.getDataValue('nombreSeccion');
            },
            set(value: string) {
                this.setDataValue('nombreSeccion', value);
            }
        }
    },
    {
        sequelize: ConnectionDatabaseService.getConnectionSequelize(),
        modelName: 'Secciones',
        tableName: 'Secciones'
    }
);
