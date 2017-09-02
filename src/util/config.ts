'use strict';

const nconf = module.exports = require('nconf');
const path = require('path');

nconf
// 1. Command-line arguments
    .argv()
    // 2. Environment variables
    .env([
        'MYSQL_DB_NAME',
        'MYSQL_HOST',
        'MYSQL_USER',
        'MYSQL_PASSWORD',
        'PROD_MODE',
        'NODE_ENV',
        'PORT',
        'IP_ADDRESS'
    ])
    // 3. Config file
    .file({ file: path.join(__dirname, 'config.json') })
    // 4. Defaults
    .defaults({
        //MYSQL_DB_NAME: 'testDB',
        //MYSQL_HOST: 'aws-db.cidisb0qgnbu.us-east-1.rds.amazonaws.com',
        //MYSQL_PORT: '3306',
        //MYSQL_USER: 'username',
        //MYSQL_PASSWORD: 'password',
        PROD_MODE: false,
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
