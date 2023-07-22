import {Sequelize} from 'sequelize-typescript';
import config from './lib/config';
config;

let sequelize = config.dev === true ? new Sequelize({
    dialect: 'postgres',
    database: config.dbName,
    password: config.dbPassword,
    username: config.dbUser,
    storage: ':memory:',
    models: [
        __dirname + '/models',
    ],
    logging: false,
    native: false
    }) : new Sequelize({
        dialect: 'postgres',
        database: config.dbName,
        password: config.dbPassword,
        username: config.dbUser,
        host: config.dbHost,
        port: Number(config.dbPort),
        models: [__dirname + '/models'],
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false
            }, 
            keepAlive: true
        },
        ssl : true,
        logging: false,
        native: false,
        pool: {
            max: 5,
            min: 0,
            idle: 300000,
            acquire: 300000,
        },
        benchmark: true,
    });

//exporto sequelize en un objeto para poder usarlo en otros archivos
export const connection = sequelize;
export const models = sequelize.models;
export default sequelize;