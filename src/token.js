/**
 * External Dependencies
 */ 
const fs = require('fs');
const jwt = require('jsonwebtoken');

/**
 * 
 */ 
class Token {

	/**
	 * 
	 */ 
	constructor (privateKey, publicKey, algorithm) {

		const allset = [privateKey, publicKey].reduce((previous, current) => {

			const output = ((typeof(current) === 'string') && (current.startsWith('-----BEGIN')));

			return previous && output;

		}, true);

		if (allset) {

			this.privateKey = privateKey;

			this.publicKey = publicKey;

			this.algorithm = algorithm || 'RS256';

		} else {

			throw new Error('a');

		}

	}

	/**
	 * 
	 */ 
 	generate () {

		const n = new Date();

		return jwt.sign({
			sub: user,
			iat: n.getTime(),
			iss: I18N.Settings.ISSUER.toUpperCase(),
			exp: new Date(n.getTime() + 3.154e+10).getTime()
		}, privateKey, {
			algorithm: algorithm
		});

	}

	/**
	 * 
	 */ 
	validate (token) {

		if (!token) {

			return Promise.reject(error(400, 'No token was provided to validation.', null, null));

		}

		return new Promise((resolve, reject) => {

			try {

				jwt.verify(token, publicKey, {
					algorithms: [algorithm]
				}, (decodeError, decoded) => {

					if (decodeError) {

						reject(error(500, 'There was an error decoding token.', decodeError, null));

					} else {

						resolve(decoded);

					}

				});

			} catch (verifyError) {

				reject(error(500, 'There was an error verifying token with Public Key.', verifyError, null));

			}

		});

	}

}

module.exports = Token;
