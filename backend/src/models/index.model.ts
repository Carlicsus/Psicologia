import Expedientes from "./expedientes.model";
import HistoricosExpedientes from "./historicosExpedientes.model";
import Usuarios from "./usuarios.model";
import Alumnos from "./alumnos.model"

//hasMany = uno a muchos
//belongsTo = muchos a uno
//belongsToMany = muchos a muchos

Alumnos.hasOne(Expedientes,{foreignKey:'matricula',as:'expedeinte'});
Expedientes.belongsTo(Alumnos,{foreignKey:'matricula',as:'alumno'})

export {
    Expedientes, HistoricosExpedientes, Usuarios, Alumnos
};
