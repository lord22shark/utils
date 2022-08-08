/**
 * 
 */
class Tools {

	/**
	 * 
	 */ 
	static deep = (input, path) => {

		let reference = input;

		const parts = path.split('.');

		for (const p of parts) {

			if (reference[p]) {

				reference = reference[p];

			}

		}

		if (reference === input) {

			return '---';

		} else {

			return reference.toString();

		}

	}

	/**
	 * 
	 */ 
	static isObjectId = (input) => {

		return ((input) && (/^[a-f0-9]{24}$/.test(input.toString().toLowerCase())));

	}
	
}

module.exports = Tools;
