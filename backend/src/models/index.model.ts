import Expedientes from "./expedientes.model";
import HistoricosExpedientes from "./historicosExpedientes.model";
import Usuarios from "./usuarios.model";
import Alumnos from "./alumnos.model"

//hasMany = uno a muchos
//belongsTo = muchos a uno
//belongsToMany = muchos a muchos

Alumnos.hasOne(Expedientes,{foreignKey:'matricula',as:'expedeinte'});
Expedientes.belongsTo(Alumnos,{foreignKey:'matricula',as:'alumno'})

Expedientes.hasMany(HistoricosExpedientes,{foreignKey:'noExpediente',as:'historicoExpediente'})
HistoricosExpedientes.belongsTo(Expedientes,{foreignKey:'noExpediente',as:'expediente'})

Usuarios.hasMany(Expedientes,{foreignKey:'usuario',as:'expediente'});
Expedientes.belongsTo(Usuarios,{foreignKey:'usuario',as:'usuarios'});

export {
    Expedientes, HistoricosExpedientes, Usuarios, Alumnos
};
