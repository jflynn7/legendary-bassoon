'use strict';

const nconf = module.exports = require('nconf');
const path = require('path');

nconf
// 1. Command-line arguments
    .argv()
    // 2. Environment variables
    .env([
        'DATA_BACKEND',
        'GCLOUD_PROJECT',
        'INSTANCE_CONNECTION_NAME',
        'MONGO_URL',
        'MONGO_COLLECTION',
        'MYSQL_USER',
        'MYSQL_PASSWORD',
        'NODE_ENV',
        'PORT'
    ])
    // 3. Config file
    .file({ file: path.join(__dirname, 'config.json') })
    // 4. Defaults
    .defaults({
        // dataBackend can be 'datastore', 'cloudsql', or 'mongodb'. Be sure to
        // configure the appropriate settings for each storage engine below.
        // If you are unsure, use datastore as it requires no additional
        // configuration.
        //DATA_BACKEND: 'datastore',
        //
        //// This is the id of your project in the Google Cloud Developers Console.
        //GCLOUD_PROJECT: 'afs-engine',
        //
        //// MongoDB connection string
        //// https://docs.mongodb.org/manual/reference/connection-string/
        //MONGO_URL: 'mongodb://localhost:27017',
        //MONGO_COLLECTION: 'books',
        //
        MYSQL_DB_NAME: 'testDB',
        MYSQL_HOST: 'aws-db.cidisb0qgnbu.us-east-1.rds.amazonaws.com',
        MYSQL_PORT: '3306',
        MYSQL_USER: 'username',
        MYSQL_PASSWORD: 'password',

        PORT: 3000,
        IP_ADDRESS: 'localhost',
    });

// Check for required settings
checkConfig('GCLOUD_PROJECT');

if (nconf.get('DATA_BACKEND') === 'cloudsql') {
    checkConfig('MYSQL_USER');
    checkConfig('MYSQL_PASSWORD');
    if (nconf.get('NODE_ENV') === 'production') {
        checkConfig('INSTANCE_CONNECTION_NAME');
    }
} else if (nconf.get('DATA_BACKEND') === 'mongodb') {
    checkConfig('MONGO_URL');
    checkConfig('MONGO_COLLECTION');
}

function checkConfig (setting) {
    if (!nconf.get(setting)) {
        console.warn(`You must set ${setting} as an environment variable or in config.json!`);
    }
}
