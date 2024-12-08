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
import WorkerSeederService from "../helpers/workers/scraperSeederWorker";
import WorkerHistoricoService from "../helpers/workers/scraperHistoricoWorker";
import WorkerNotificacionService from "../helpers/workers/scraperNotificacionWorker";
import { Expedientes, Gacetas, HistoricosExpedientes, Institutos, Notificaciones, Secciones, TemporalesNotificaciones, Usuarios } from "../models/index.model";
import ExpedientesRoutes from '../routes/expedientes.routes';
import HistoricosExpedientesRoutes from '../routes/historicosExpedientes.routes';
import InventoresRoutes from '../routes/inventores.routes';
import UsuarioRoutes from '../routes/usuarios.routes';
import NotificacionesRoutes from '../routes/notificaciones.routes';
import gacetasSeeder from "../seeders/gacetas.seeder";
import institutosSeeder from '../seeders/institutos.seeder';
import seccionesSeeder from '../seeders/secciones.seeder';
import usuariosSeed from '../seeders/usuarios.seeder';
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
        this.app.use('/api/inventores', InventoresRoutes.getRouter());
        this.app.use('/api/notificaciones', NotificacionesRoutes.getRouter());
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
                ws.send(JSON.stringify({ buttonEnable: await WorkerSeederService.queueStatus() }));
                ws.send(JSON.stringify({ buttonEnableHistorico: await WorkerHistoricoService.queueStatus() }));
                ws.send(JSON.stringify({ buttonEnableNotificaion: await WorkerNotificacionService.queueStatus() }));

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
                Institutos.bulkCreate(institutosSeeder),
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
        cron.schedule(this.Horarios.getHorarioScrapperSeeder(), async () => {
            // Obtenemos los expedientes incompletos de la base de datos
            const expedientesPendientes = await ExpedientesDAO.getAllExpedientesPendientes();

            if (expedientesPendientes.length > 0) {
                //Mandar a llamar a la cola de trabajo de scraper seeder
                WorkerSeederService.addJob('scrapeJob', {
                    expedientesPendientes
                });

                loggerService.log('info', "Ejecutando tarea diaria del scraper seeder, hay expedientes pendientes");
                return
            }

            loggerService.log('info', "No fue necesario ejecutar la tarea diaria del scraper seeder, no hay expedientes pendientes");
            return
        });

        cron.schedule(this.Horarios.getHorarioScrapperHistorico(), async () => {
            loggerService.log('info', "Ejecutando tarea diaria del scraper de historico");

            // TODO: Obtenemos los ultimos registros de historico de la base de datos
            const ultimosHistoricos = await HistoricosExpedientesDAO.getLastRecords();
            console.log(ultimosHistoricos);

            //Mandar a llamar a la cola de trabajo de scraper DE HISTORICO
            WorkerHistoricoService.addJob('scrapeJob', {
                ultimosHistoricos
            });
        });

        cron.schedule(this.Horarios.getHorarioScrapperNotificacion(), async () => {
            loggerService.log('info', "Ejecutando tarea diaria del scraper de notificacion");

            // TODO: se necesita obtener los ultimos registros de notificacion de la base de datos

            interface ha {
                noExpediente: string;
                Notificaciones: Notificacione[];
                TemporalesNotificaciones: Notificacione[];
            }

            interface Notificacione {
                numeroOficio: number | null;
                fechaCirculacion: Date;
            }


            const expedientes = await Expedientes.findAll({
                where:{status:true},
                include: [
                    {
                        model: TemporalesNotificaciones,
                        order: [['fechaCirculacion', 'DESC']],
                        attributes: ['numeroOficio', 'fechaCirculacion'],
                        limit: 1,
                    },
                    {
                        model: Notificaciones,
                        order: [['fechaCirculacion', 'DESC']],
                        attributes: ['numeroOficio', 'fechaCirculacion'],
                        limit: 1,
                    }
                ],
                attributes: ['noExpediente'],
                nest: true
            }) as unknown as ha[];

            //Procesa los resultados para determinar la notificación más reciente
            const ultimasNotificaciones = expedientes.map(expediente => {
                const lastTemporalNotificacion = expediente.TemporalesNotificaciones[0];
                const lastNotificacion = expediente.Notificaciones[0];

                let lastNotificaionCompare;

                // Compara las fechas de circulación para determinar la notificación más reciente
                if (lastTemporalNotificacion && lastNotificacion) {
                    lastNotificaionCompare = new Date(lastTemporalNotificacion.fechaCirculacion) > new Date(lastNotificacion.fechaCirculacion)
                        ? {
                            fechaCirculacion: lastTemporalNotificacion.fechaCirculacion,
                            numeroOficio: lastTemporalNotificacion.numeroOficio,
                        }
                        : {
                            fechaCirculacion: lastNotificacion.fechaCirculacion,
                            numeroOficio: lastNotificacion.numeroOficio,
                        };
                } else if (lastTemporalNotificacion) {
                    lastNotificaionCompare = {
                        fechaCirculacion: lastTemporalNotificacion.fechaCirculacion,
                        numeroOficio: lastTemporalNotificacion.numeroOficio,
                    };
                } else if (lastNotificacion) {
                    lastNotificaionCompare = {
                        fechaCirculacion: lastNotificacion.fechaCirculacion,
                        numeroOficio: lastNotificacion.numeroOficio,
                    };
                } else {
                    lastNotificaionCompare = {
                        fechaCirculacion: null,
                        numeroOficio: null
                    }
                }

                return {
                    noExpediente: expediente.noExpediente,
                    numeroOficio: lastNotificaionCompare.numeroOficio,
                    fechaCirculacion: lastNotificaionCompare.fechaCirculacion
                };
            });

            //Mandar a llamar a la cola de trabajo de scrape r DE HISTORICO
            WorkerNotificacionService.addJob('scrapeJob', {
                ultimasNotificaciones
            });
        });

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

            await ExpedientesDAO.deleteExpedeintesNoEncontrados(fechaLimiteExpedientes);

            const expedientes = await ExpedientesDAO.getAllNoExpedientes();

            for (const expediente of expedientes) {
                const temporales = await TemporalesNotificaciones.findAll({ where: { noExpediente: expediente.noExpediente } });
                const historicos = await HistoricosExpedientes.findAll({ where: { noExpediente: expediente.noExpediente, tipo: 'OFICIO' }, attributes: ['codigoBarras', 'noDocumento'], order: [['fecha', 'ASC']], raw: true });
                console.log(historicos);
                // Modificar el valor de codigoBarras para que solo contenga los últimos digitos
                for (let historico of historicos) {
                    const partes = historico.codigoBarras.split('/');
                    historico.codigoBarras = partes[partes.length - 1];
                }
                console.log(historicos);
                for (const temporal of temporales) {
                    const historicoMatch = historicos.find(h => h.codigoBarras === String(temporal.numeroOficio));
                    if (historicoMatch) {
                        console.log(`Encontrado historico con noDocumento ${temporal.numeroOficio}:`, historicoMatch);
                        let existGaceta = await Gacetas.findOne({ where: { idGaceta: temporal.idGaceta }, raw: true });
                        // TODO: Buscar por similitud?
                        let existSeccion = await Secciones.findOne({ where: { idSeccion: temporal.idSeccion }, raw: true });
                        // TODO: cambiar la fecha de circulacion por la correcta que viene del scraper
                        let existNotificacion = await Notificaciones.findOne({ where: { fechaCirculacion: temporal.fechaCirculacion, numeroOficio: temporal.numeroOficio }, raw: true });
                        if (!existNotificacion) {
                            existNotificacion = await Notificaciones.create({
                                noExpediente: temporal.noExpediente,
                                noDocumento: historicoMatch.noDocumento,
                                ejemplar: temporal.ejemplar,
                                idGaceta: existGaceta!.idGaceta,
                                idSeccion: existSeccion!.idSeccion,
                                fechaCirculacion: temporal.fechaCirculacion,
                                descripcionGeneralAsunto: temporal.descripcionGeneralAsunto,
                                fechaOficio: temporal.fechaOficio,
                                numeroOficio: temporal.numeroOficio
                            });
                        }
                        await TemporalesNotificaciones.destroy({ where: { idTemporalNotificacion: temporal.idTemporalNotificacion } });
                        continue;
                    } else {
                        console.log(`No se encontró historico con noDocumento ${temporal.numeroOficio}`);
                    }
                }
            }

            // TODO: Ver que hacer cuando no encuentra ni un solo historico D,:


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
