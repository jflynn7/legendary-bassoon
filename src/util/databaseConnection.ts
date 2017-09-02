import { ConnectionOptions, getConnectionManager } from 'typeorm';
import { createConnection } from 'typeorm';
import { Comment } from '../core/models/user/Comment';
import { User } from '../core/models/user/User';
import { UserProfile } from '../core/models/user/UserProfile';
import {UserAddress} from '../core/models/user/UserAddress';

const config = require('../util/config');

module.exports = {
    getDatabaseConfig() {
        const connectionOptions: ConnectionOptions = {
            driver : {
                type: 'mysql',
                host: config.get('MYSQL_HOST') || 'localhost',
                port: config.get('MYSQL_PORT') || 3306,
                username: config.get('MYSQL_USER') || 'root',
                password: config.get('MYSQL_PASSWORD') || 'password',
                database: config.get('MYSQL_DB_NAME') || 'nunicornv1',
            },
            autoSchemaSync: !config.get('PROD_MODE'),
            logging: {
                logQueries: true,
                logSchemaCreation: true,
            },
            entities: [ User, UserProfile, UserAddress, Comment ],
        };

        return connectionOptions;
    },

    async getConnection() {
        const connectionManager = getConnectionManager();

        if (connectionManager.has('default')) {
            return connectionManager.get('default');
        }

        let dbConnection;
        await createConnection(this.getDatabaseConfig()).then(connection => {
            dbConnection = connection;
        });

        return dbConnection;
    }
};