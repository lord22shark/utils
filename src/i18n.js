/**
 * External Dependencies
 */
const _ = require('lodash');
const fs = require('fs'); 
const path = require('path');

/**
 * 
 */ 
class I18N {

	//https://github.com/smhg/gettext-parser
	//https://github.com/alexanderwallin/node-gettext
	//https://www.gnu.org/software/gettext/manual/gettext.html

	constructor (language) {

		this.default = language || process.env.LANGUAGE || 'pt_BR';

		this.Settings = {};

		// ...Strings[defaultLanguage]

		// TODO: parse *.po/mo existing
		// merge here... where?

		const dotenv = path.resolve(__dirname, '../.env');

		if (fs.existsSync(dotenv)) {

			const environment = fs.readFileSync(dotenv).toString('utf-8');

			environment.split(/[\r\n]+/g).reduce((previous, current) => {

				const line = [...current.matchAll(/^([a-zA-Z_0-9\-\_]+)\=(.*)$/g)];

				if (line.length === 0) {

					return previous;

				} else {

					previous[line[0][1]] = _.isNil(line[0][2]) ? null : line[0][2].toString();

					return previous;

				}

			}, Settings);

		} else {

			Object.keys(process.env).reduce((previous, current) => {

				previous[current] = process.env[current];

				return previous;

			}, Settings);

		}

	}

}

module.exports = I18N;
