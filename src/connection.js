/**
 * External Dependencies
 */  
const {BigQuery} = require('@google-cloud/bigquery');
const Mongoose = require('mongoose');
const Redis = require('redis');
const ParseUrl = require('parse-url');
const pg = require('pg');
const mysql = require('mysql2');

/**
 * Internal Dependencies
 */
const Exception = require('./exception.js'); 

/**
 * 
 */ 
class Connection {

	/**
	 * 
	 */
	constructor (uri, settings) {

		let error = null;

		if ((!uri) || (typeof(uri) !== 'string')) {

			error = new Exception('BLOCK', 400, 'Missing URI parameter', null, null);

			return Promise.reject(error);

		} else {

			if ((settings) && !(settings instanceof Object)) {

				error = new Exception('BLOCK', 400, 'Settings merge parameter should be an object', null, null);

				return Promise.reject(error);

			}

			this.settings = settings || null;

			this.attributes = null;

			this.client = null;

			try {

				this.attributes = ParseUrl(uri);

			} catch (parseError) {

				error = new Exception('BLOCK', 500, 'Failed to parse URI', parseError, {uri});

				return Promise.reject(error);

			}

			switch (this.attributes.protocol) {

				case 'mongodb+srv':
				case 'mongodb':

					return this.createMongoDBConnection(this.attributes, this.settings);

				case 'redis':

					return this.createRedisConnection(this.attributes, this.settings);

				case 'bigquery':

					return this.createBigQueryConnection(this.attributes, this.settings);

				case 'postgres':
				case 'postgresql':
				case 'redshift':

					return this.createPostgreSQLConnection(this.attributes, this.settings);

				case 'mysql':
				case 'mariadb':

					return this.createMySQLConnection(this.attributes, this.settings);

				default:

					error = new Exception('BLOCK', 400, 'Unrecognized protocol', null, {protocol: this.attributes.protocol});

					return Promise.reject(error);

			}

		}

	}

	/**
	 * mongodb://localhost:27017/database
	 */ 
	createMongoDBConnection (parsedURI, settings) {

		return new Promise(async (resolve, reject) => {

			Mongoose.connect(parsedURI.href, settings).then(() => {

				resolve({
					'pool': null,
					'client': null,
					'engine': Mongoose
				});

			}).catch((mongooseError) => {

				const error = new Exception('BLOCK', 500, 'Fail to connect to MongoDB through Mongoose', mongooseError, {href: parsedURI.href});

				reject(error);

			});

		});
	
	}

	/**
	 * redis://localhost:6379/5
	 */ 
	createRedisConnection (parsedURI, settings) {

		return new Promise(async (resolve, reject) => {

			const connectionParameters = {
				url: parsedURI.href,
				pingInterval: 60000,
				socket: {
					tls: (parsedURI.href.match(/rediss:/) != null),
					rejectUnauthorized: false
				}
			};

			if ((parsedURI.query.legacyMode) && (parsedURI.query.legacyMode === 'true')) {

				connectionParameters.legacyMode = true;

			}

			if (settings) {

				Object.assign(connectionParameters, settings);

			}

			const client = Redis.createClient(connectionParameters);

			client.on('error', (redisCreateClientError) => {

				const error = new Exception('BLOCK', 500, 'Event Error on Redis Connection', redisCreateClientError, {href: parsedURI.href});

				reject(error);

			});

			try {

				await client.connect();

				resolve({
					'pool': null,
					'client': client,
					'engine': Redis
				});

			} catch (redisConnectError) {

				const error = new Exception('BLOCK', 500, 'Fail to connect to Redis', redisConnectError, {href: parsedURI.href});

				reject(error);

			}

		});

	}
	
	/**
	 * bigquery:///path/9ef1441ad213.json?project_id=23483243
	 */ 
	createBigQueryConnection (parsedURI, settings) {

		return new Promise(async (resolve, reject) => {

			if (!parsedURI.query.project) {

				const error = new Exception('BLOCK', 500, 'Cannot start Google BigQuery API without Project ID', null, {href: parsedURI.href});

				reject(error);

			} else {

				try {

					const connectionParameters = {
						keyFilename: parsedURI.pathname,
						projectId: parsedURI.query.project
					};

					if (settings) {

						Object.assign(connectionParameters, settings);

					}

					const client = new BigQuery(connectionParameters);

					resolve({
						'pool': null,
						'client': client,
						'engine': BigQuery
					});

				} catch (bigQueryError) {

					const error = new Exception('BLOCK', 500, 'Could not instanciate BigQuery engine', bigQueryError, {href: parsedURI.href});

					reject(error);

				}

			}

		});

	}

	/**
	 * postgres://postgres:postgres@localhost:5432/arteimpressa
	 */ 
	createPostgreSQLConnection (parsedURI, settings) {

		return new Promise(async (resolve, reject) => {

			let connectionPool = null;

			let client = null;

			let error = null;

			try {

				//process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;

				const connectionParameters = {
					connectionString: parsedURI.href,
					ssl: false
				};

				if ((parsedURI.query) && (parsedURI.query.sslmode)) {

					connectionParameters.ssl = {
						rejectUnauthorized: false
					};

				}

				if (settings) {

					Object.assign(connectionParameters, settings);

				}

				connectionPool = new pg.Pool(connectionParameters);

			} catch (postgresPoolError) {

				error = new Exception('BLOCK', 500, 'Fail to create PostgreSQL pg.Pool', postgresPoolError, {href: parsedURI.href});

				reject(error);

				return;

			}

			try {

				client = await connectionPool.connect();

				resolve({
					'pool': connectionPool,
					'client': client,
					'engine': pg
				});

			} catch (postgresConnectionError) {

				console.log(postgresConnectionError);

				error = new Exception('BLOCK', 500, 'Fail to connect to PostgreSQL through pg.Pool client', postgresConnectionError, {href: parsedURI.href});

				reject(error);

				return;

			}

		});
	
	}

	/**
	 * mysql://root:mysql@localhost:3306/mysql
	 */ 
	createMySQLConnection (parsedURI, settings) {

		return new Promise(async (resolve, reject) => {

			let connectionPool = null;

			let error = null;

			try {

				const connectionParameters = {
					host: parsedURI.hostname,
					port: parsedURI.port || 3306,
					user: parsedURI.username,
					password: parsedURI.password,
					database: parsedURI.pathname ? parsedURI.pathname.replace(/^\//, '') : null
				};

				if ((parsedURI.query) && (parsedURI.query.sslmode)) {

					connectionParameters.ssl = {
						rejectUnauthorized: false
					};

				}

				if (settings) {

					Object.assign(connectionParameters, settings);

				}

				connectionPool = await mysql.createPool(connectionParameters);

			} catch (mysqlPoolError) {

				error = new Exception('BLOCK', 500, 'Fail to create MySQL Pool', mysqlPoolError, {href: parsedURI.href});

				reject(error);

				return;

			}

			connectionPool.getConnection((mysqlConnectionError, connection) => {

				if (mysqlConnectionError) {

					error = new Exception('BLOCK', 500, 'Fail to connect to MySQL through mysql.createPool connection', mysqlConnectionError, {href: parsedURI.href});

					reject(error);

				} else {

					resolve({
						'pool': connectionPool,
						'client': connection,
						'engine': mysql
					});

				}

				return;

			});

		});
	
	}

}

module.exports = Connection;
