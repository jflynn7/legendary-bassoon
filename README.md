####**Node API Server with TypeORM and Typescript**

_Built with Heroku and AWS database_

#####Prerequisites
- Install mySQL
- Create database
- Update config with local database properties (./util/config.ts)
- (Comment out config to use default [localhost:3306])

#####Installation
~~~~
npm install
npm start
~~~~

##### Notes
- Tables are automatically created in devMode when first API endpoint is hit.
- autoSchemaSync on remote DBs isn't working well, yet. In the meantime, once table structure is built locally, you can export structure to a remote DB using `dumpSQLStructure.sh` in `./migrations` with the command:

`sh dumpSQLStructure.sh password`  (where password is your DB password).
