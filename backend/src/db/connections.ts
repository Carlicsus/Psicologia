import { Sequelize } from "sequelize";
import IORedis from 'ioredis';


class ConnectionDatabaseService{

    private static instance: ConnectionDatabaseService;
    private connectionSequelize: Sequelize;
    private connectionRedis: IORedis;

    private constructor(){        
        this.connectionSequelize = new Sequelize(`${process.env.POSTGRES_DB}`,`${process.env.POSTGRES_USER}`,`${process.env.POSTGRES_PASSWORD}`,{
            host:`${process.env.POSTGRES_HOST}`,
            port:Number(process.env.POSTGRES_PORT),
            dialect:"postgres"
        })

        this.connectionRedis = new IORedis({
            host: `${process.env.REDIS_HOST}`,
            port: Number(process.env.REDIS_PORT),     
            password: `${process.env.REDIS_PASSWORD}`,  
            maxRetriesPerRequest:null
        });
    }

    public static getInstance(): ConnectionDatabaseService{
        if(!ConnectionDatabaseService.instance){
            ConnectionDatabaseService.instance = new ConnectionDatabaseService();
        }
        return ConnectionDatabaseService.instance;
      }

    public getConnectionSequelize(): Sequelize{
        return this.connectionSequelize;
    }

    public getConnectionRedis(): IORedis{
        return this.connectionRedis;
    }
} 

export default ConnectionDatabaseService.getInstance();