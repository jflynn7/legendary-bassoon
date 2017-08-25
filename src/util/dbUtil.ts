import { Product } from '../models/merchant/Product';
import { Merchant } from '../models/merchant/Merchant';
import { ConnectionOptions, getConnectionManager } from 'typeorm';
import { createConnection } from 'typeorm';
import { Supplier } from '../models/merchant/Supplier';
import { Customer } from '../models/customer/Customer';
import { Comment } from '../models/customer/Comment';
import { OrderedProduct } from '../models/ordering/OrderedProduct';
import { Order } from '../models/ordering/Order';

const config = require('../util/config');

module.exports = {
    getDatabaseConfig() {
        const connectionOptions: ConnectionOptions = {
            driver : {
                type: 'mysql',
                host: config.get('MYSQL_HOST') || process.env.OPENSHIFT_MYSQL_DB_HOST || 'localhost',
                port: config.get('MYSQL_PORT') || process.env.OPENSHIFT_MYSQL_DB_PORT || 3306,
                username: config.get('MYSQL_USER') || process.env.OPENSHIFT_MYSQL_DB_USERNAME || 'root',
                password: config.get('MYSQL_PASSWORD') || process.env.OPENSHIFT_MYSQL_DB_PASSWORD || 'password',
                database: config.get('MYSQL_DB_NAME') || 'afs'
            },
            dropSchemaOnConnection: true,
            autoSchemaSync: true,
            logging: {
                logQueries: true,
                logSchemaCreation: true,
            },
            entities: [Merchant, Product, Supplier, Customer, Comment, Order, OrderedProduct],
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