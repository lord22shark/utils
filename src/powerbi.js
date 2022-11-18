/**
 * External Depedencies
 */
const axios = require('axios');
const moment = require('moment-timezone');
const qs = require('qs');
const _ = require('lodash');

/**
 * Internal Dependencies
 */
const Connection = require('./connection.js');
const Exception = require('./exception.js');

/**
 * Main Function
 */
class PowerBI {

	/**
	 * Static required properties
	 */
	static Settings = [
		'client_id',
		'username',
		'password',
		'redis_url',
		'expires'
	];

	/**
	 * 
	 */ 
	static OAuth2Key = '_powerbi-oauth2';

	/**
	 * Default timeout
	 */
	static Timeout = 3;

	/**
	 *
	 */
	constructor (input) {

		if ((input) && (typeof(input) === 'object')) {

			const fails = [];

			this.connection = null;

			this.Settings = PowerBI.Settings.reduce((previous, current) => {

				if (!_.isNil(input[current]) && (typeof(input[current] === 'string')) && (input[current] !== '')) {

					const key = `PBI_${current.toUpperCase()}`;

					previous[key] = input[current];

				} else {

					fails.push(current);

				}

				return previous;

			}, {});

			if (fails.length > 0) {

				throw new Exception('MAJOR', 400, `The following keys are missing or ain\'t valid: ${fails.join(', ')}`, null, null);

			}

		} else {

			throw new Exception('MAJOR', 400, 'Settings must be a valid object', null, null);

		}
	
	}

	/**
	 * Connect to redis
	 */
	async connect () {

		try {

			this.connection = await new Connection(this.Settings.PBI_REDIS_URL);

		} catch (connectionError) {

			throw connectionError;

		}

	}

	/**
	 * Disconnect from redis
	 */
	disconnect () {

		if ((this.connection) && (this.connection.client)) {

			this.connection.client.disconnect();

		}

	}

	/**
	 * Fetches masteruser token from microsoftonline OAUth2
	 * No params :: already set in constructor (clientId, username, password)
	 */
	fetchOAuth2Token () {

		return new Promise((resolve, reject) => {

			axios({
				url: 'https://login.microsoftonline.com/common/oauth2/token',
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				},
				data: qs.stringify({
					'client_id': this.Settings.PBI_CLIENT_ID,
					'username': this.Settings.PBI_USERNAME,
					'password': this.Settings.PBI_PASSWORD,
					'grant_type': 'password',
					'resource': 'https://analysis.windows.net/powerbi/api',
					'scope': 'openid'
				})
			}).then((response) => {

				resolve(response.data.access_token);

			}).catch((fetchTokenError) => {

				reject(new Exception('MAJOR', 500, 'Error fetching Microsoft Online OAuth2 Token', fetchTokenError, {response: fetchTokenError.response.data}));

			});

		});

	}

	/**
	 * Fetches "Oauth2Key" token from redis
	 */
	getOAuth2Token () {

		return new Promise(async (resolve, reject) => {

			try {
			
				const reply = await this.connection.client.get(PowerBI.OAuth2Key);

				if (reply === null) {

					this.fetchOAuth2Token().then(async (accessToken) => {

						await this.connection.client.set(PowerBI.OAuth2Key, accessToken, 'EX', this.Settings.PBI_EXPIRES);

						resolve(accessToken);

					}).catch((fetchOAuth2TokenError) => {

						reject(fetchOAuth2TokenError);

					});

				} else {

					try {

						const ttl = await this.connection.client.ttl(PowerBI.OAuth2Key);

						if ((!ttl) || (ttl <= 120)) {

							this.fetchOAuth2Token().then(async (accessToken) => {

								await this.connection.client.set(PowerBI.OAuth2Key, accessToken, 'EX', this.Settings.PBI_EXPIRES);

								resolve(accessToken);

							}).catch((fetchOAuth2TokenError) => {

								reject(fetchOAuth2TokenError);

							});

						} else {

							resolve(reply);

						}

					} catch (ttlError) {

						reject(new Exception('MAJOR', 500, 'Error performing Redis.TTL OAuth2Token', ttlError, null));

					}

				}

			} catch (redisError) {

				reject(new Exception('MAJOR', 500, 'Error performing Redis.GET OAuth2Token', redisError, null));

			}

		});

	}

	/**
	 * Get the report token from PowerBI API - MyOrg
	 * report:String - PowerBI report ID, group:String - PowerBI Report's Group ID
	 */
	fetchReportToken (accessToken, reportId, groupId) {

		return new Promise((resolve, reject) => {

			if ((!accessToken) || (!reportId) || (!groupId)) {

				reject(new Exception('MAJOR', 400, 'To fetch report token, accessToken, reportId and groupId are required', null, null));

			} else {

				axios({
					url: `https://api.powerbi.com/v1.0/myorg/groups/${groupId}/reports/${reportId}/GenerateToken`,
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						'Authorization': `Bearer ${accessToken}`
					},
					data: {
						'accessLevel' : 'view'
					}
				}).then((response) => {

					resolve(response.data.token);

				}).catch((fetchTokenError) => {

					reject(new Exception('MAJOR', 500, `Error fetching Report Token for ${reportId}`, fetchTokenError, {response: fetchTokenError.response.data}));

				});

			}

		});

	}	

	/**
	 * Fetches Report token from redis
	 * report:String - PowerBI report ID, group:String - PowerBI Report's Group ID
	 */
	getReportToken (accessToken, reportId, groupId) {

		return new Promise(async (resolve, reject) => {

			try {

				const reply = await this.connection.client.get(reportId);

				if (reply === null) {

					this.fetchReportToken(accessToken, reportId, groupId).then(async (reportToken) => {

						await this.connection.client.set(reportId, reportToken, 'EX', this.Settings.PBI_EXPIRES);

						resolve({
							id: reportId,
							token: reportToken,
							url: `https://app.powerbi.com/reportEmbed?reportId=${reportId}&groupId=${groupId}`,
							expires: this.Settings.PBI_EXPIRES,
							accessToken
						});

					}).catch((fetchReportTokenError) => {

						reject(fetchReportTokenError);

					});

				} else {

					try {

						const ttl = await this.connection.client.ttl(reportId);

						if ((!ttl) || (ttl <= 10)) {

							this.fetchReportToken(accessToken, reportId, groupId).then(async (reportToken) => {

								await this.connection.client.set(reportId, reportToken, 'EX', this.Settings.PBI_EXPIRES);

								resolve({
									id: reportId,
									token: reportToken,
									url: `https://app.powerbi.com/reportEmbed?reportId=${reportId}&groupId=${groupId}`,
									expires: this.Settings.PBI_EXPIRES,
									accessToken
								});

							}).catch((fetchReportTokenError) => {

								reject(fetchReportTokenError);

							});

						} else {

							resolve({
								id: reportId,
								token: reply,
								url: `https://app.powerbi.com/reportEmbed?reportId=${reportId}&groupId=${groupId}`,
								expires: ttl,
								accessToken
							});

						}

					} catch (ttlError) {

						reject(new Exception('MAJOR', 500, `Error performing Redis.TTL for report ${reportId}`, ttlError, null));

					}

				}

			} catch (redisError) {

				reject(new Exception('MAJOR', 500, `Error performing Redis.GET for report ${reportId}`, redisError, null));

			}

		});

	}

	/**
	 *
	 */
	async getToken (reportId, groupId) {

		if ((!reportId) || (!groupId)) {

			throw new Exception('MAJOR', 400, 'To getToken, reportId and groupId are required', null, null);

		}

		try {

			if ((!this.connection) || (!this.connection.client)) {

				await this.connect();

			}

			const oauth2token = await this.getOAuth2Token();

			const reporttoken = await this.getReportToken(oauth2token, reportId, groupId);

			this.disconnect();

			return reporttoken;

		} catch (internalError) {

			throw internalError;

		}
		
	}

}

module.exports = PowerBI;
