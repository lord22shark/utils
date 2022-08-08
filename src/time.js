/**
 * External Dependencies
 */
const moment = require('moment-timezone');

/**
 * 
 */ 
class Time {

	/**
	 * 
	 */ 
	static tz = 'America/Sao_Paulo';

	/**
	 * 
	 */ 
	static now = (format) => {

		//I18N.Settings.TZ TODO

		const m = moment().tz(Time.tz);

		return (format === true) ? m.format() : m;

	};

	/**
	 * 
	 */
	static monthEdge = (format) => {

		const start = now().tz(Time.tz);
		
		start.date(1);
		
		start.second(0);
		start.minute(0);
		start.hour(0);

		const end = start.clone().add(1, 'month').subtract(1, 'day');

		end.second(59);
		end.minute(59);
		end.hour(23);

		if (format === true) {

			return [start.format(), end.format()];

		} else {

			return [start, end];

		}

	};

}

module.exports = Time;
