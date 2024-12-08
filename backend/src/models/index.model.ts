import Expedientes from "./expedientes.model";
import Notificaciones from "./notificaciones.model";
import TemporalesNotificaciones from './temporalesNotificaciones.model'
import Gacetas from "./gacetas.model";
import HistoricosExpedientes from "./historicosExpedientes.model";
import Institutos from "./institutos.model";
import SolicitantesExpedientes from "./solicitantesExpedientes.model";
import Inventores from "./inventores.model";
import InventoresExpedientes from "./inventoresExpedientes.model";
import Secciones from "./secciones.model";
import Usuarios from "./usuarios.model";

//hasMany = uno a muchos
//belongsTo = muchos a uno
//belongsToMany = muchos a muchos

Institutos.belongsToMany(Expedientes, { through: SolicitantesExpedientes, foreignKey: 'idInstituto' });
Expedientes.belongsToMany(Institutos, { through: SolicitantesExpedientes, foreignKey: 'noExpediente' });

Inventores.belongsToMany(Expedientes, { through: SolicitantesExpedientes, foreignKey: 'idInventor'});
Expedientes.belongsToMany(Inventores, { through: SolicitantesExpedientes, foreignKey: 'noExpediente' });

Institutos.belongsToMany(Inventores, { through: SolicitantesExpedientes, foreignKey:'idInstituto'});
Inventores.belongsToMany(Institutos, { through: SolicitantesExpedientes, foreignKey:'idInventor'})

Inventores.belongsToMany(Expedientes, { through: InventoresExpedientes, foreignKey: 'idInventor' });
Expedientes.belongsToMany(Inventores, { through: InventoresExpedientes, foreignKey: 'noExpediente' });

Expedientes.hasMany(HistoricosExpedientes, { foreignKey: 'noExpediente' });
HistoricosExpedientes.belongsTo(Expedientes, { foreignKey: 'noExpediente' });

Expedientes.hasMany(Notificaciones, { foreignKey: 'noExpediente' });
Notificaciones.belongsTo(Expedientes, { foreignKey: 'noExpediente' });

HistoricosExpedientes.hasMany(Notificaciones, { foreignKey: 'noDocumento' });
Notificaciones.belongsTo(HistoricosExpedientes, { foreignKey: 'noDocumento' });

Notificaciones.belongsTo(Gacetas, { foreignKey: 'idGaceta' });
Gacetas.hasMany(Notificaciones, { foreignKey: 'idGaceta' });

Secciones.hasMany(Notificaciones, { foreignKey: 'idSeccion' });
Notificaciones.belongsTo(Secciones, { foreignKey: 'idSeccion' });

Expedientes.hasMany(TemporalesNotificaciones, { foreignKey: 'noExpediente'});
TemporalesNotificaciones.belongsTo(Expedientes, { foreignKey: 'noExpediente'});

TemporalesNotificaciones.belongsTo(Gacetas, {foreignKey: 'idGaceta'});
Gacetas.hasMany(TemporalesNotificaciones, {foreignKey:'idGaceta'});

Secciones.hasMany(TemporalesNotificaciones,{foreignKey:'idSeccion'});
TemporalesNotificaciones.belongsTo(Secciones, {foreignKey:'idSeccion'});

export {
    Expedientes, Notificaciones, TemporalesNotificaciones, Gacetas, HistoricosExpedientes, Institutos, SolicitantesExpedientes,
    InventoresExpedientes, Inventores, Secciones, Usuarios
};
