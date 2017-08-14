import { Product } from '../models/merchant/Product';
import { Merchant } from '../models/merchant/Merchant';
import {ConnectionOptions, getConnectionManager} from 'typeorm';
import { createConnection } from 'typeorm';
import { Supplier } from '../models/merchant/Supplier';
import { Customer } from '../models/customer/Customer';
import { Comment } from '../models/customer/Comment';
import { OrderedProduct } from '../models/ordering/OrderedProduct';
import { Order } from '../models/ordering/Order';

module.exports = {
    getDatabaseConfig() {
        const connectionOptions: ConnectionOptions = {
            driver : {
                type: 'mysql',
                url: process.env.DATABASE_URL,
                //host: process.env.OPENSHIFT_MYSQL_DB_HOST || 'localhost',
                //port: process.env.OPENSHIFT_MYSQL_DB_PORT || 3306,
                username: process.env.OPENSHIFT_MYSQL_DB_USERNAME || 'root',
                password: process.env.OPENSHIFT_MYSQL_DB_PASSWORD || 'password',
                database: 'afs'
            },
            autoSchemaSync: true,
            logging: {
                logQueries: true,
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