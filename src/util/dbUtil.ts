import { Product } from '../models/merchant/Product';
import { Merchant } from '../models/merchant/Merchant';
import {ConnectionOptions, getConnectionManager} from 'typeorm';
import { createConnection } from 'typeorm';
import { Supplier } from '../models/merchant/Supplier';
import { Customer } from '../models/customer/Customer';
import { Comment } from '../models/customer/Comment';
import { OrderedProduct } from '../models/ordering/OrderedProduct';
import { CustomerOrder } from '../models/ordering/CustomerOrder';

module.exports = {
    getDatabaseConfig() {
        const connectionOptions: ConnectionOptions = {
            driver : {
                type: 'mysql',
                host: 'localhost',
                port: 3306,
                username: 'root',
                password: 'password',
                database: 'testDB'
            },
            autoSchemaSync: true,
            logging: {
                logQueries: true,
            },
            entities: [Merchant, Product, Supplier, Customer, Comment, CustomerOrder, OrderedProduct],
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