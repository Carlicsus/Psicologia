import { Optional } from "sequelize";

// Definir una interfaz para los atributos de Gaceta
export interface IGacetasAttributes {
    idGaceta: number;
    nombreGaceta: string;
}

// Definir una interfaz para los atributos que son opcionales al crear un nuevo Gaceta
export interface IGacetasCreationAttributes extends Optional<IGacetasAttributes, "idGaceta"> {}