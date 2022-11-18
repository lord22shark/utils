/**
 * External Dependencies
 */
const fs = require('fs');

/**
 * Internal Dependencies
 */
const Exception = require('./exception.js'); 

/**
 * 
 */ 
class E9T {

	/**
	 * 
	 */ 
	constructor (prefix, dotenvPath) {

		if ((prefix) && (typeof(prefix) === 'string') && (prefix.length === 3)) {

			if (dotenvPath) {

				if (typeof(dotenvPath) !== 'string') {

					throw new Exception('BLOCK', 400, 'DOTENVPath must be a string with .env full path', null, null);

				}

				if (!fs.existsSync(dotenvPath)) {

					throw new Exception('BLOCK', 400, `${dotenvPath} does not exist in your filesystem`, null, null);

				}

				require('dotenv').config({path: dotenvPath});

			}

			const defaultNaming = new RegExp(`^(${prefix})_(STR|INT|OBJ|FLO|PEM)_([A-Z_0-9]+)$`);

			Object.keys(process.env).reduce((previous, current) => {

				const matches = current.match(defaultNaming);

				if (matches) {

					const key = `${matches[1]}_${matches[3]}`;

					const value = process.env[matches[0]].trim();

					switch (matches[2]) {

						case 'STR':
							previous[key] = value;
						break;

						case 'INT':
							previous[key] = parseInt(value);
						break;

						case 'FLO':
							previous[key] = parseFloat(value);
						break;

						case 'OBJ':
							previous[key] = JSON.parse(value);
						break;

						case 'BOL':
							previous[key] = Boolean(parseInt(value));
						break;

						case 'PEM':
							previous[key] = value.replace(/\\n/g, '\n');
						break;

						default:
							previous[key] = value;
						break;

					}

				}

				return previous;

			}, this);

			return this;

		} else {

			throw new Exception('BLOCK', 400, 'Prefix for E9T must be a string with only 3 capital letters', null, null);

		}

	}

}

module.exports = E9T;
