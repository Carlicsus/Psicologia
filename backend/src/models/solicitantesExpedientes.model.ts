import { DataTypes, Model } from "sequelize";
import ConnectionDatabaseService from "../db/connections";
import { ISolicitantesExpedientesAttributes, ISolicitantesExpedientesCreationAttributes } from "../interfaces/solicitantesExpedientes.interface";
import { Expedientes, Institutos, Inventores } from './index.model';

class SolicitantesExpedientes extends Model<ISolicitantesExpedientesAttributes, ISolicitantesExpedientesCreationAttributes> implements ISolicitantesExpedientesAttributes {
    private _solicitanteExpedienteID!: number;
    private _idInstituto!: number | null;
    private _idInventor!: number | null;
    private _noExpediente!: string;

    public get solicitanteExpedienteID(): number {
        return this._solicitanteExpedienteID;
    }

    public set solicitanteExpedienteID(value: number) {
        this._solicitanteExpedienteID = value;
    }

    public get idInstituto(): number | null {
        return this._idInstituto;
    }

    public set idInstituto(value: number | null) {
        this._idInstituto = value;
    }

    public get idInventor(): number | null {
        return this._idInventor;
    }

    public set idInventor(value: number | null) {
        this._idInventor = value;
    }

    public get noExpediente(): string {
        return this._noExpediente;
    }

    public set noExpediente(value: string) {
        this._noExpediente = value;
    }
}

export default SolicitantesExpedientes.init({
    solicitanteExpedienteID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    idInstituto: {
        type: DataTypes.INTEGER,
        references: {
            model: Institutos,
            key: 'idInstituto'
        },
        allowNull: true,
    },
    idInventor: {
        type: DataTypes.INTEGER,
        references: {
            model: Inventores,
            key: 'idInventor'
        },
        allowNull: true,
    },
    noExpediente: {
        type: DataTypes.STRING(20),
        references: {
            model: Expedientes,
            key: 'noExpediente'
        },
        allowNull: false,
    }
}, {
    sequelize: ConnectionDatabaseService.getConnectionSequelize(),
    modelName: 'SolicitantesExpedientes',
    tableName: 'SolicitantesExpedientes',
    indexes: [
        {
            unique: true,
            fields: ['idInstituto', 'idInventor', 'noExpediente']
        }
    ]
});
