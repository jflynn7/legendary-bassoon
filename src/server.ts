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
import * as flash from 'express-flash';
import expressValidator = require('express-validator');
import * as session from 'express-session';

/**
 * Database Setup
 */
const dbUtil = require('./util/databaseConnection');

/**
 * Load environment variables from .env file, where API keys and passwords are configured.
 */
//dotenv.config({ path: '.env.example' });

/**
 * Controllers (route handlers).
 */
import * as userResource from './core/controllers/UserResource';

/**
 * Create Express server.
 */
const app = express();


/**
 * Load Config
 */
const config = require('./util/config');

/**
 * Express configuration.
 */
app.set('port', (process.env.PORT || 5000));
app.set('view engine', 'pug');
app.use(compression());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());
app.use(flash());
app.use(lusca.xframe('SAMEORIGIN'));
app.use(lusca.xssProtection(true));
app.use(session({
    name: 'nunicorn.sid',
    secret: 'nunicorn-test-session'}));
app.get('/', userResource.helloMoto);


/**
 * UserProfile Routes
 */
app.get('/user/:userId', userResource.loadUser);
app.put('/user/update', userResource.updateUserProfile);
app.post('/user/create', userResource.registerUser);
app.post('/user/login', userResource.loginUser);


/**
 * Error Handler. Provides full stack - remove for production
 */
app.use(errorHandler());

/**
 * Start Express server.
 */
app.listen(app.get('port'), () => {
  console.log(`App is running on port ${app.get('port')}`);
});

module.exports = app;