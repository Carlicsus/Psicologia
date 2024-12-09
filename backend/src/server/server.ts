import chokidar from 'chokidar';
import cors from 'cors';
import express, { Application } from "express";
import { openSync, readFileSync, readSync, statSync } from 'fs';
import { createServer, Server as HttpServer } from 'http';
import jwt from "jsonwebtoken";
import cron from 'node-cron';
import path from 'path';
import { v4 as uuidv4 } from 'uuid'; // Importa uuid
import { Server as SocketServer, WebSocket } from 'ws';
import ExpedientesDAO from "../dao/expedientes.dao";
import UsuariosDAO from "../dao/usuarios.dao";
import ConnectionDatabaseService from "../db/connections";
import Horarios from "../helpers/horarios";
import loggerService from "../helpers/loggerService";
import { Alumnos, Expedientes, HistoricosExpedientes, Usuarios } from "../models/index.model";
import ExpedientesRoutes from '../routes/expedientes.routes';
import HistoricosExpedientesRoutes from '../routes/historicosExpedientes.routes';
import AlumnosRoutes from '../routes/alumnos.routes';
import UsuarioRoutes from '../routes/usuarios.routes';
import usuariosSeed from '../seeders/usuarios.seeder';
import alumnosSeed from '../seeders/alumnos.seeder';
import HistoricosExpedientesDAO from '../dao/historicosExpedientes.dao';
import { DATE } from 'sequelize';


class Server {
    private static instance: Server;
    // Dentro de app se almacenara la instancia de express
    private app: Application;
    // Dentro de por se almacenara el puerto donde correra el servidor
    private port: string;
    // Dentro de server se almacenara el servidor http
    private server: HttpServer;
    // Servidor WebSocket
    private wss: SocketServer;
    // Mapa para gestionar todos los clientes del WebSocket
    private clients: Map<string, WebSocket>;
    private Horarios: typeof Horarios;
    private lastLogSize: number = 0;

    private constructor() {
        // Instancia express y todo lo necesario para construir la aplicacion web
        this.app = express();
        // Se almacena el puerto definido en las variables de entorno o por defecto el puerto 5000
        this.port = process.env.PORT_SERVER || "5000";
        // Se crea el servidor http con la configuracion de la aplicacion web
        this.server = createServer(this.app);
        // Inicializa el servidor WebSocket utilizando el servidor HTTP
        this.wss = new SocketServer({ server: this.server });
        // Instancia el mapa de los clientes del WebSocket
        this.clients = new Map<string, WebSocket>();
        // Configurar los horarios
        this.Horarios = Horarios;
        //Inicio de las configuraciones del servidor http
        this.listen();
        this.middlewares();
        this.routes();
        this.webSocketSetup();
        this.dbConnect();
        this.dalyTasks();
        this.chokidar();
    }

    public static getInstance(): Server {
        if (!Server.instance) {
            Server.instance = new Server();
        }
        return Server.instance;
    }

    // Funcion para inciar el servidor en el puerto especificado
    private listen(): void {
        this.server.listen(this.port, () => {
            loggerService.log('info', `Aplicación inciada correctamente`);
        });
    }

    // Configuracion de los prefijos a usar para acceder las diferentes rutas
    private routes(): void {
        this.app.use("/api/users", UsuarioRoutes.getRouter());
        this.app.use("/api/expedientes", ExpedientesRoutes.getRouter());
        this.app.use('/api/historico', HistoricosExpedientesRoutes.getRouter());
        this.app.use('/api/alumnos', AlumnosRoutes.getRouter());
    }

    // Configuracion de los middlewares del servidor
    private middlewares(): void {
        // Parseo body para entender json
        this.app.use(express.json());

        // Permite procesar el CORS
        this.app.use(cors());
    }

    // Configuracion del web socket para envio de notificaciones al cliente
    // TODO: Agregar lo del mensaje de reconexion jajsjajs
    private webSocketSetup(): void {
        // Funcion a realizar cada que se conecte un cliente web socket nuevo
        this.wss.on('connection', async (ws: WebSocket, req) => {

            const token = req.headers['sec-websocket-protocol'];
            const clientId = new URLSearchParams(req.url?.split('?')[1]).get('clientId') || uuidv4();

            if (!token) {
                ws.close();
                return;
            }

            try {
                jwt.verify(token, process.env.SECRET_KEY || 'pepito123');

                if (this.clients.has(clientId)) {
                    // Cerrar la conexión anterior si ya existe
                    this.clients.get(clientId)?.close();
                }

                this.clients.set(clientId, ws);

                ws.on('close', () => {
                    clearInterval(pingInterval);
                    this.clients.delete(clientId);
                });

                ws.on('message', (message) => {
                    // TODO: Procesar los mensajes recibidos del cliente
                });

                ws.send(JSON.stringify({ clientId }));

                const pingInterval = setInterval(() => {
                    if (ws.readyState === WebSocket.OPEN) {
                        ws.send(JSON.stringify({ ping: true }));
                    } else {
                        clearInterval(pingInterval);
                    }
                }, 10000);

                // Leer y enviar el contenido del archivo de logs
                const logFilePath = path.join(__dirname, '../common/logs/Daly.log');
                const logContent = readFileSync(logFilePath, 'utf-8');
                ws.send(JSON.stringify({ type: 'log', content: logContent }));

            } catch (error) {
                ws.close();
            }
        });
    }

    // Configuracion de la base de datos
    private async dbConnect(): Promise<void> {
        // Se intentar conectarse por medio de las credenciales a la base de datos si se logra se cargaran los modelos en la base de datos 
        try {
            await ConnectionDatabaseService.getConnectionSequelize().authenticate();
            await ConnectionDatabaseService.getConnectionSequelize().sync();
            await Promise.all([
                Usuarios.bulkCreate(usuariosSeed),
                Alumnos.bulkCreate(alumnosSeed),
                // Secciones.bulkCreate(seccionesSeeder),
                // Gacetas.bulkCreate(gacetasSeeder),
            ]);
            loggerService.log('info', "Connection has been established successfully");
        } catch (error) {
            loggerService.log('info', `Unable to connect to the database `);
        }
    }

    private chokidar(): void {
        // Monitorizar el archivo de logs para enviar nuevas entradas a través del WebSocket
        const logFilePath = path.join(__dirname, '../common/logs/Daly.log');
        chokidar.watch(logFilePath, {
            //Usar (usePolling: true,) si es necesario, exigue mas rendimiento al sistema
            interval: 100,
            binaryInterval: 300,
            awaitWriteFinish: {
                stabilityThreshold: 1100,
                pollInterval: 100
            }
        }).on('change', () => {
            const stats = statSync(logFilePath);
            const newSize = stats.size;

            if (newSize > this.lastLogSize) {
                const logFile = openSync(logFilePath, 'r');
                const buffer = Buffer.alloc(newSize - this.lastLogSize);
                readSync(logFile, buffer, 0, buffer.length, this.lastLogSize);
                const newEntries = buffer.toString('utf-8');

                this.clients.forEach((client) => {
                    client.send(JSON.stringify({ type: 'log', content: newEntries }));
                });

                this.lastLogSize = newSize;
            }
        });

        // Inicializar el tamaño del archivo al iniciar
        const stats = statSync(logFilePath);
        this.lastLogSize = stats.size;
    }

    // Configuracion de las tareas diarias
    private dalyTasks(): void {
        // Tarea diaria que se ejecutara todos los dias a las 12:00 AM
        cron.schedule('0 0 0 * * *', async () => {
            // Limpiar el contenido del archivo de logs
            this.lastLogSize = loggerService.cleanLogDaly();

            // Se crean nuevos horarios par usar en el dia
            this.Horarios = Horarios.makeNewHorarios();

            const fechaLimiteUsuarios = new Date();
            fechaLimiteUsuarios.setDate(fechaLimiteUsuarios.getDay() - 1);

            await UsuariosDAO.deleteUsersNoConfirmados(fechaLimiteUsuarios);

            const fechaLimiteExpedientes = new Date();
            fechaLimiteExpedientes.setDate(fechaLimiteExpedientes.getMonth() - 6);


        });
    }

    // Método para enviar mensajes a clientes específicos
    // TODO: Cambiar el tipo de dato del message
    public sendMessageToClient(clientId: string, message: any): void {
        const ws = this.clients.get(clientId);
        if (ws) {
            ws.send(JSON.stringify(message));
        }
    }

    public broadcast(data: any): void {
        this.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(data));
            }
        });
    }

    public isClientConnected(clientId: string): boolean {
        return this.clients.has(clientId);
    }

}

//Se exporta la configuracion del Servidor
export default Server.getInstance();
