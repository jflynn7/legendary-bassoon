/**
 * Module dependencies.
 */
import 'reflect-metadata';
import * as express from 'express';
import * as compression from 'compression';  // compresses requests
import * as bodyParser from 'body-parser';
import * as logger from 'morgan';
import * as errorHandler from 'errorhandler';
import * as lusca from 'lusca';
import * as dotenv from 'dotenv';
import * as flash from 'express-flash';
import * as path from 'path';
import expressValidator = require('express-validator');

/**
 * Database Setup
 */
const dbUtil = require('./util/dbUtil');

/**
 * Load environment variables from .env file, where API keys and passwords are configured.
 */
dotenv.config({ path: '.env.example' });

/**
 * Controllers (route handlers).
 */
import * as merchantController from './controllers/merchantController';
import * as customerController from './controllers/customerController';
import * as productController from './controllers/productController';

/**
 * Create Express server.
 */
const app = express();

/**
 * Express configuration.
 */
app.set('port', process.env.OPENSHIFT_NODEJS_PORT || 3001);
app.set('ip_address', process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1');
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'pug');
app.use(compression());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());
app.use(flash());
app.use(lusca.xframe('SAMEORIGIN'));
app.use(lusca.xssProtection(true));

/**
 * Merchant Routes
 */
app.get('/merchant/:merchantId', merchantController.loadMerchant);
app.post('/merchant/create', merchantController.createMerchant);

/**
 * Customer Routes
 */
app.post('/customer/create', customerController.createCustomer);
app.get('/customer/:customerId', customerController.loadCustomer);
app.post('/customer/:customerId/favourites', customerController.addFavourites);
app.post('/customer/:customerId/orders/create', customerController.createOrder);
app.get('/customer/:customerId/orders/:orderId', customerController.findOrder);
app.post('/customer/login', customerController.loginCustomer);

/**
 * Product Routes
 */
app.post('/product/:productId/:customerId/comment/add', productController.addComment);
app.delete('/product/comment/:commentId', productController.removeComment);

/**
 * Error Handler. Provides full stack - remove for production
 */
app.use(errorHandler());

/**
 * Start Express server.
 */
app.listen(app.get('port'), app.get('ip_address'), () => {
  console.log(('  App is running on port :%d in %s mode'), app.get('port'), app.get('env'));
  console.log('  Press CTRL-C to stop\n');
});

module.exports = app;