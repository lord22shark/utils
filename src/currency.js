/**
 * Internal Dependencies
 */ 

/**
 * 
 */ 
class Currency {

	static BRL = {
		
		/**
		 * 
		 */ 
		format: (value) => {

			return `R$${value.toFixed(2)}`.replace('.', ',');

		}

	};

	/**
	 * 
	 */ 
	constructor (numberFormat, currency) {

		if (!Currency[numberFormat]) {

			this.numberFormat = numberFormat || 'pt-BR';

			this.currency = currency || 'BRL';

			if (Intl instanceof Object) {

				this.formatter = new Intl.NumberFormat(this.numberFormat, {
					style: 'currency',
					currency: this.currency,
					useGrouping: true
				});

			} else {

				if (Currency.hasOwnProperty(this.currency)) {

					this.formatter = Currency[this.currency];

				} else {

					this.formatter = {
						format: this.fallback
					};

				}

			}

			Currency[numberFormat] = this;

		}

		return Currency[numberFormat];

	}

	/**
	 * 
	 */ 
	fallback (value) {

		return `$${value.toFixed(2)}`;

	}

	/**
	 * 
	 */ 
	format (value) {

		return this.formatter.format(value).replace(/\s+/, '');

	}

}

module.exports = Currency;
