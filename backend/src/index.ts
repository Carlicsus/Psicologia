import Server from "./server/server";
// Configuración de dotenv
import dotenv from "dotenv";
dotenv.config();

// Se crea la instancia del servidor http
const server = Server;

// Se exporta la instancia del servidor http
export default server;
