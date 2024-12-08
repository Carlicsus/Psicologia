import { createLogger, format, transports, Logger } from 'winston';
import path, { join } from 'path';
import { writeFileSync } from 'fs';

class LoggerService {
  
  private static instance: LoggerService;
  private loggerSystem: Logger;

  private constructor() {

    // Crear el logger System
    this.loggerSystem = this.loggerSetup("System")

    this.cleanLogDaly();

  }

  public static getInstance(): LoggerService{
    if(!LoggerService.instance){
      LoggerService.instance = new LoggerService();
    }
    return LoggerService.instance;
  }

  private loggerSetup(customName:string):Logger{
    const { combine, timestamp, printf } = format;

    // Define el formato de los logs
    const logFormat = printf(({ level, message, timestamp }) => {
        return `${timestamp} - [Backend] - ${level.toUpperCase()} - ${message}`;
    });

    const newLogger = createLogger({
        level: 'info',
        format: combine(
          timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
          logFormat
        ),
        transports: [
          new transports.File({ filename: join(__dirname, `../common/logs/${customName}.log`) })
        ],
    });

    // TODO: Agregar esta variable de entorno al .env
    if (process.env.NODE_ENV !== 'production') {
        const consoleTransport = new transports.Console({
        format: combine(
            timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
            logFormat
            ),
        });
        newLogger.add(consoleTransport);
    }
    
    return newLogger;
  }

  public log(level: string, message: string): void {
    this.loggerSystem.log(level, message);
  }

  public cleanLogDaly(): number{
    const logFilePath = path.join(__dirname, '../common/logs/Daly.log');
    try {
      writeFileSync(logFilePath, '');
      this.log('info','Se reiniciaron los logs diarios');
    } catch (error) {
      this.log('error',`Error al limpiar el archivo de logs:${error}`);
    }
    return 0
  }

}

// Exportar una instancia de la clase
export default LoggerService.getInstance();
