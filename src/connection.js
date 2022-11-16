/**
 * External Dependencies
 */  
const {BigQuery} = require('@google-cloud/bigquery');
const fs = require('fs');
const Mongoose = require('mongoose');
const Redis = require('redis');
const ParseUrl = require('parse-url');
const Path = require('path');
const pg = require('pg');

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
	constructor (uri) {

		let error = null;

		if ((!uri) || (typeof(uri) !== 'string')) {

			error = new Exception('BLOCK', 400, 'Missing URI parameter', null, null);

			return Promise.reject(error);

		} else {

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

					return this.createMongoDBConnection(this.attributes);

				case 'redis':

					return this.createRedisConnection(this.attributes);

				case 'bigquery':

					return this.createBigQueryConnection(this.attributes);

				case 'postgres':
				case 'postgresql':
				case 'redshift':

					return this.createPostgreSQLConnection(this.attributes);

				default:

					error = new Exception('BLOCK', 400, 'Unrecognized protocol', null, {protocol: this.attributes.protocol});

					return Promise.reject(error);

			}

		}

	}

	/**
	 * mongodb://localhost:27017/tworkh
	 */ 
	createMongoDBConnection (parsedURI) {

		return new Promise(async (resolve, reject) => {

			Mongoose.connect(parsedURI.href, {
				useNewUrlParser: true,
				useUnifiedTopology: true
			}, (mongodbError, client) => {

				if (mongodbError) {

					const error = new Exception('BLOCK', 500, 'Fail to connect to MongoDB through Mongoose', mongodbError, {href: parsedURI.href});

					reject(error);

				} else {

					resolve({
						'pool': null,
						'client': client,
						'engine': Mongoose
					});

				}

			});

		});
	
	}

	/**
	 * redis://localhost:6379/5
	 */ 
	createRedisConnection (parsedURI) {

		return new Promise(async (resolve, reject) => {

			const connectionParameters = {
				url: parsedURI.href
			};

			if ((parsedURI.query.legacyMode) && (parsedURI.query.legacyMode === 'true')) {

				connectionParameters.legacyMode = true;

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
	 * bigquery:///Users/lordshark/Downloads/tab-foundation-9ef1441ad213.json?project_id=23483243
	 */ 
	createBigQueryConnection (parsedURI) {

		return new Promise(async (resolve, reject) => {

			if (!parsedURI.query.project) {

				const error = new Exception('BLOCK', 500, 'Cannot start Google BigQuery API without Project ID', null, {href: parsedURI.href});

				reject(error);

			} else {

				try {

					const client = new BigQuery({
						keyFilename: parsedURI.pathname,
						projectId: parsedURI.query.project
					});

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
	createPostgreSQLConnection (parsedURI) {

		return new Promise(async (resolve, reject) => {

			let connectionPool = null;

			let client = null;

			let error = null;

			try {

				process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;

				const settings = {
					connectionString: parsedURI.href,
					ssl: false
				};

				if ((parsedURI.query) && (parsedURI.query.sslmode)) {

					settings.ssl = {
						rejectUnauthorized: false
					};

				}

				connectionPool = new pg.Pool(settings);

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
					'engine': Mongoose
				});

			} catch (postgresConnectionError) {

				console.log(postgresConnectionError);

				error = new Exception('BLOCK', 500, 'Fail to connect to PostgreSQL through pg.Pool client', postgresConnectionError, {href: parsedURI.href});

				reject(error);

				return;

			}

		});
	
	}

}

module.exports = Connection;
