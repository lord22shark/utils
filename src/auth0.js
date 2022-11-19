/**
 * External Depedencies
 */
const axios = require('axios');
const fs = require('fs');
const moment = require('moment-timezone');
const path = require('path');
const qs = require('qs');
const _ = require('lodash');

/**
 * Internal Dependencies
 */
const Exception = require('./exception.js'); 

//Search for all users whose name contains "john" :: name:"john"
//Search all users whose name is exactly "john" :: name.raw:"john"
//Search for all user names starting with "john" :: name:john*
//Search for user names that start with "john" and end with "smith" :: name:john*smith
//Search for all users whose email is exactly "john@contoso.com" :: email.raw:"john@contoso.com"
//Search for all users whose email is exactly "john@contoso.com" or "mary@contoso.com" using OR :: email.raw:("john@contoso.com" OR "mary@contoso.com")

/**
 *
 */
class Auth0 {

	/**
	 * Static required properties
	 */ 
	static Settings = [
		'audience',
		'client_id',
		'client_secret',
		'connection',
		'domain',
		'logout_url',
		'response_type',
		'redirect_uri',
		'state',
		'version'
	];

	/**
	 *
	 */
	constructor (input) {

		if ((input) && (typeof(input) === 'object')) {

			const fails = [];

			this.AccessToken = null;

			this.User = null;

			this.Settings = Auth0.Settings.reduce((previous, current) => {

				if (!_.isNil(input[current]) && (typeof(input[current] === 'string')) && (input[current] !== '')) {
				//if ((_.isNil(input[current])) || (typeof(input[current] !== 'string')) || (input[current] === '')) {

					const key = `AUTH0_${current.toUpperCase()}`;

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
	 * Get the URL Authentication
	 */
	getAuthenticationUrl () {

		return `https://${this.Settings.AUTH0_DOMAIN}/authorize?response_type=${this.Settings.AUTH0_RESPONSE_TYPE}&client_id=${this.Settings.AUTH0_CLIENT_ID}&connection=${this.Settings.AUTH0_CONNECTION}&redirect_uri=${this.Settings.AUTH0_REDIRECT_URI}&state=${this.Settings.AUTH0_STATE}&scope=openid profile email user_metadata app_metadata`;

	}

	/**
	 * 
	 */ 
	async fetchAccessToken (mode, code) {

		if (!mode) {

			throw new Exception('MAJOR', 400, 'To fetch access token, mode should be authorization_code or client_credentials', null, null);

		}

		if ((mode === 'authorization_code') && (!code)) {

			throw new Exception('MAJOR', 400, 'To fetch token with authorization_code, code must informed', null, null);

		}

		const accessTokenRequest = {
			method: 'POST',
			url: `https://${this.Settings.AUTH0_DOMAIN}/oauth/token`,
			headers: {
				'Content-Type': null
			},
			data: {
				client_id: this.Settings.AUTH0_CLIENT_ID,
				client_secret: this.Settings.AUTH0_CLIENT_SECRET,
				grant_type: mode
			}
		};

		switch (mode) {

			case 'authorization_code':

				accessTokenRequest.headers['Content-Type'] = 'application/x-www-form-urlencoded';

				accessTokenRequest.data.code = code;

				accessTokenRequest.data.redirect_uri = this.Settings.AUTH0_REDIRECT_URI;

				accessTokenRequest.data = qs.stringify(accessTokenRequest.data);

			break;

			case 'client_credentials':

				accessTokenRequest.data.audience = this.Settings.AUTH0_AUDIENCE;

				accessTokenRequest.headers['Content-Type'] = 'application/json';

			break;

			default:

				throw new Exception('MAJOR', 400, `${code} is an unrecognized method`, null, null);

		}

		let accessTokenResponse = null;

		try {

			accessTokenResponse = await axios(accessTokenRequest);

			this.AccessToken = accessTokenResponse.data;

		} catch (accessTokenError) {

			throw new Exception('MAJOR', 500, 'Fail to fetch access token from Auth0', accessTokenError, null);

		}

	}

	/**
	 * 
	 */
	async getAccessToken () {

		if ((!this.AccessToken) || (!this.AccessToken.access_token)) {

			throw new Exception('MAJOR', 404, 'Access Token is null or was not fetched', null, null);

		}

		// TODO check expires and renew

		return `Bearer ${this.AccessToken.access_token}`;

	}

	/**
	 * 
	 */ 
	async getUserInfo (cache) {

		if ((!this.AccessToken) || (!this.AccessToken.id_token)) {

			throw new Exception('MAJOR', 400, 'Cannot fetch user info without token id - mode = authorization_code', null, null);

		}

		const _token = await this.getAccessToken();

		const tokenInfoRequest = {
			method: 'POST',
			url: `https://${this.Settings.AUTH0_DOMAIN}/userinfo`,
			headers: {
				'Content-Type':'application/json',
				'Authorization': _token
			},
			data: {
				id_token: this.AccessToken.id_token
			}
		};

		let tokenInfoResponse = null;

		try {

			tokenInfoResponse = await axios(tokenInfoRequest);

			if (cache === true) {

				this.User = tokenInfoResponse.data;

			}

			return tokenInfoResponse.data;

		} catch (tokenInfoError) {

			throw new Exception('MAJOR', 500, 'Fail to fetch user info from Auth0', tokenInfoError, null);

		}

	}

	/**
	 *
	 */
	async getProfileById (cache, id) {

		if ((!id) || (type(id) !== 'string') || (id === '')) {

			throw new Exception('MAJOR', 400, 'Cannot get profile by id without id', null, null);

		}

		const _token = await this.getAccessToken();

		const profileRequest = {
			method: 'GET',
			url: `https://${this.Settings.AUTH0_DOMAIN}/api/${this.Settings.AUTH0_VERSION}/users/${id}`,
			headers: {
				'Content-Type':'application/json',
				'Authorization': _token
			}
		};

		let profileResponse = null;

		try {

			profileResponse = await axios(profileRequest);

			if (cache === true) {

				this.User = profileResponse.data;

			}

			return profileResponse.data;

		} catch (profileError) {

			throw new Exception('MAJOR', 500, 'Fail to fetch user by id from Auth0', profileError, null);

		}

	}

	/**
	 *
	 */
	async addUserWithCredentials (cache, name, email, password, metadata) {

		if ((!name) || (type(name) !== 'string') || (name === '')) {

			throw new Exception('MAJOR', 400, 'Cannot add user without name', null, null);

		}

		if ((!email) || (type(email) !== 'string') || (email === '')) {

			throw new Exception('MAJOR', 400, 'Cannot add user without email', null, null);

		}

		if ((!password) || (type(password) !== 'string') || (password === '')) {

			throw new Exception('MAJOR', 400, 'Cannot add user without password', null, null);

		}

		if ((metadata) && (typeof(metadata) !== 'object')) {

			throw new Exception('MAJOR', 400, 'Metadata, if set, must be an object', null, null);

		}

		const _token = await this.getAccessToken();

		const addUserRequest = {
			method: 'POST',
			url: `https://${this.Settings.AUTH0_DOMAIN}/api/${this.Settings.AUTH0_VERSION}/users`,
			headers: {
				'Content-Type': 'application/json',
				'Authorization': _token
			},
			data: {
				'email': email.trim(),
				'blocked': false,
				'email_verified': true,
				'name': name,
				'connection': 'Username-Password-Authentication',
				'password': password,
				'verify_email': false,
				'app_metadata': null
			}
		};

		addUserRequest.data.app_metadata = metadata || {};

		let addUserResponse = null;

		try {

			addUserResponse = await axios(addUserRequest);

			if (cache === true) {

				this.User = addUserResponse.data;

			}

			return addUserResponse.data;

		} catch (addUserError) {

			throw new Exception('MAJOR', 500, 'Fail to add user by credentials in Auth0', addUserError, null);

		}

	}

	/**
	 *
	 */
	async blockUserById (id) {

		if ((!id) || (type(id) !== 'string') || (id === '')) {

			throw new Exception('MAJOR', 400, 'Cannot block user by id without id', null, null);

		}

		const _token = await this.getAccessToken();

		const blockUserRequest = {
			method: 'PATCH',
			url: `https://${this.Settings.AUTH0_DOMAIN}/api/${this.Settings.AUTH0_VERSION}/users/${id}`,
			headers: {
				'Content-Type':'application/json',
				'Authorization': _token
			},
			data: {
				blocked: true
			}
		};

		let blockUserResponse = null;

		try {

			blockUserResponse = await axios(blockUserRequest);

			return blockUserResponse.data;

		} catch (blockUserError) {

			throw new Exception('MAJOR', 500, 'Fail to block user by id in Auth0', blockUserError, null);

		}

	}

	/**
	 *
	 */
	async unblockUserById (id) {

		if ((!id) || (type(id) !== 'string') || (id === '')) {

			throw new Exception('MAJOR', 400, 'Cannot unblock user by id without id', null, null);

		}

		const _token = await this.getAccessToken();

		const unblockUserRequest = {
			method: 'PATCH',
			url: `https://${this.Settings.AUTH0_DOMAIN}/api/${this.Settings.AUTH0_VERSION}/users/${id}`,
			headers: {
				'Content-Type':'application/json',
				'Authorization': _token
			},
			data: {
				blocked: false
			}
		};

		let unblockUserResponse = null;

		try {

			unblockUserResponse = await axios(unblockUserRequest);

			return unblockUserResponse.data;

		} catch (unblockUserError) {

			throw new Exception('MAJOR', 500, 'Fail to unblock user by id in Auth0', unblockUserError, null);

		}

	}

	/**
	 *
	 */
	async setPasswordById (id, password) {

		if ((!id) || (type(id) !== 'string') || (id === '')) {

			throw new Exception('MAJOR', 400, 'Cannot set password to user by id without id', null, null);

		}

		if ((!password) || (type(password) !== 'string') || (password === '')) {

			throw new Exception('MAJOR', 400, 'Cannot set password to user by id without password', null, null);

		}

		const _token = await this.getAccessToken();

		const setPasswordRequest = {
			method: 'PATCH',
			url: `https://${this.Settings.AUTH0_DOMAIN}/api/${this.Settings.AUTH0_VERSION}/users/${id}`,
			headers: {
				'Content-Type':'application/json',
				'Authorization': _token
			},
			data: {
				password: password,
				connection: 'Username-Password-Authentication'
			}
		};

		let setPasswordResponse = null;

		try {

			setPasswordResponse = await axios(setPasswordRequest);

			return setPasswordResponse.data;

		} catch (setPasswordError) {

			throw new Exception('MAJOR', 500, 'Fail to set password to user by id in Auth0', setPasswordError, null);

		}

	}

	/**
	 *
	 */
	async updateMetadataById (id, metadata) {

		if ((!id) || (type(id) !== 'string') || (id === '')) {

			throw new Exception('MAJOR', 400, 'Cannot update metadata to user by id without id', null, null);

		}

		if ((!metadata) || (type(metadata) !== 'object')) {

			throw new Exception('MAJOR', 400, 'Cannot update metadata to user by id without metadata', null, null);

		}

		const _token = await this.getAccessToken();

		const updateMetadataRequest = {
			method: 'PATCH',
			url: `https://${this.Settings.AUTH0_DOMAIN}/api/${this.Settings.AUTH0_VERSION}/users/${id}`,
			headers: {
				'Content-Type':'application/json',
				'Authorization': _token
			},
			data: {
				app_metadata: metadata
			}
		};

		let updateMetadataResponse = null;

		try {

			updateMetadataResponse = await axios(updateMetadataRequest);

			return updateMetadataResponse.data;

		} catch (updateMetadataError) {

			throw new Exception('MAJOR', 500, 'Fail to update metadata to user by id in Auth0', updateMetadataError, null);

		}

	}

	/**
	 *
	 */
	async fetchUsers (query) {

		const _token = await this.getAccessToken();

		let output = [];

		let page = 0;

		try {

			while (true) {

				const fetchUsersRequest = {
					method: 'GET',
					url: `https://${this.Settings.AUTH0_DOMAIN}/api/${this.Settings.AUTH0_VERSION}/users`,
					params: {
						search_engine: 'v3',
						q: query || '',
						page: page.toString(),
						per_page: '50'
					},
					headers: {
						'Authorization': _token
					}
				};

				const fetchUsersresponse = await axios(fetchUsersRequest);

				if ((!fetchUsersresponse.data) || (fetchUsersresponse.data.length === 0)) {

					break;

				} else {

					output = output.concat(fetchUsersresponse.data);

					page += 1;

				}

			}

		} catch (fetchUsersError) {

			throw new Exception('MAJOR', 500, 'Fail to fetch users in Auth0', fetchUsersError, null);

		}

	}

	/**
	 *
	 */
	async fetchLogs () {

		const _token = await this.getAccessToken();

		let output = [];

		let page = 0;

		try {

			while (true) {

				const fetchLogsRequest = {
					method: 'GET',
					url: `https://${this.Settings.AUTH0_DOMAIN}/api/${this.Settings.AUTH0_VERSION}/logs`,
					params: {
						page: page.toString(),
						per_page: 100,
						sort: 'date:-1',
						take: 100
					},
					headers: {
						'Authorization': _token
					}
				};

				const fetchLogsresponse = await axios(fetchLogsRequest);

				if ((!fetchLogsresponse.data) || (fetchLogsresponse.data.length === 0)) {

					break;

				} else {

					output = output.concat(fetchLogsresponse.data);

					page += 1;

				}

			}

		} catch (fetchLogsError) {

			throw new Exception('MAJOR', 500, 'Fail to fetch users in Auth0', fetchLogsError, null);

		}

	}

}

module.exports = Auth0;
