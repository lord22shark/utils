/**
 * External Dependencies
 */
const _ = require('lodash');

/**
 * 
 */
class Sorting {

	/**
	 *
	 */ 
	static orderBy = (source, property, language) => {

		if ((source instanceof Array) && (source.length > 0)) {

			source.sort((a, b) => {

				let vA = null;

				if (property) {

					vA = _.get(a, property);

					if (!vA) {

						return 0;

					} else {

						vA = vA.toString();

					}

				} else {

					if (!a) {

						return 0;

					} else {

						a = a.toString();

					}

				}

				let vB = null;

				if (property) {

					vB = _.get(b, property);

					if (!vB) {

						return 0;

					} else {

						vB = vB.toString();

					}

				} else {

					if (!b) {

						return 0;

					} else {

						b = b.toString();

					}

				}

				return vA.localeCompare(vB, language || 'pt-BR', {
					sensitivity: 'base',
					usage: 'sort',
					ignorePunctuation: true,
					numeric: true,
					caseFirst: false
				});

			});

		}

	}

}

module.exports = Sorting;
