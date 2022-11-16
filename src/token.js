/**
 * External Dependencies
 */ 
const fs = require('fs');
const {createSigner, createVerifier, createDecoder} = require('fast-jwt');

/**
 * Internal Dependencies
 */
const Exception = require('./exception.js'); 

/**
 * Algorithms
 */ 
const ALGORITHMS = [
	'ES256',
	'ES384',
	'ES512',
	'RS256',
	'RS384',
	'RS512',
	'PS256',
	'PS384',
	'PS512',
	'EdDSA'
];

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

			this.algorithm = algorithm;

			this.signer = createSigner({
				algorithm: this.algorithm,
				key: this.privateKey
			});

			this.verifier = createVerifier({
				key: this.publicKey
			});

			this.decoder = createDecoder({
				complete: true
			});

		} else {

			throw new Exception('BLOCK', 500, 'All input parameters must be set and keys must be valid certificates, initiating with -----BEGIN.', null, null);

		}

	}

	/**
	 * 
	 */ 
 	async sign (payload) {

		let error = null;

		if ((!payload) || (typeof(payload) !== 'object')) {

			error = new Exception('BLOCK', 500, 'To sign something, it must be a valid Object', null, null);

			return Promise.reject(error);

		} else {

			try {

				return Promise.resolve(this.signer(payload));

			} catch (signError) {

				error = new Exception('BLOCK', 500, 'Something went wrong when signing the payload', signError, payload);

				return Promise.reject(error);

			}

		}

		/*
		const n = new Date();
		return jwt.sign({
			sub: user,
			iat: n.getTime(),
			iss: I18N.Settings.ISSUER.toUpperCase(),
			expiresIn: new Date(n.getTime() + 3.154e+10).getTime(),
			aud: ''
		}, privateKey, {
			algorithm: algorithm
		});
		*/

	}

	/**
	 * 
	 */ 
	async verify (token) {

		let error = null;

		if ((!token) || (typeof(token) !== 'string')) {

			error = new Exception('BLOCK', 500, 'To verify something, it must be a valid String of JWT', null, null);

			return Promise.reject(error);

		} else {

			try {

				return Promise.resolve(this.verifier(token));

			} catch (verifyError) {

				error = new Exception('BLOCK', 500, 'Something went wrong when verifying the token', verifyError, {token});

				return Promise.reject(error);

			}

		}

	}

	/**
	 * 
	 */
	async decode (token) {

		let error = null;

		if ((!token) || (typeof(token) !== 'string')) {

			error = new Exception('BLOCK', 500, 'To decode something, it must be a valid String of JWT', null, null);

			return Promise.reject(error);

		} else {

			try {

				return Promise.resolve(this.decoder(token));

			} catch (decodeError) {

				error = new Exception('BLOCK', 500, 'Something went wrong when decoding the token', decodeError, {token});

				return Promise.reject(error);

			}

		}

	} 

}

module.exports = Token;
