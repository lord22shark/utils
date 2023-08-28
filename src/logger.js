/**
 * External Dependencies
 */  
const fs = require('fs');
const path = require('path');
const {v4:uuidv4} = require('uuid');
const winston = require('winston');

/**
 * Internal Dependencies
 */
const Exception = require('./exception.js'); 
const Time = require('./time.js');

/**
 * Log Levels to Exception Levels
 */ 
const MAP_EXCEPTION_LEVELS = {
	'emerg': 'BLOCK',
	'alert': 'CRASH',
	'crit': 'MAJOR',
	'error': 'MINOR'
};

/**
 * Console Colors
 */ 
const COLORS = {
	emerg:'red',
	alert:'red',
	crit:'magenta',
	error:'magenta',
	warning:'yellow',
	notice:'cyan',
	info:'green',
	debug:'gray'
};

/**
 * Log Levels
 */ 
const LEVELS = Object.keys(winston.config.syslog.levels);


/**
 * Plain Formatter
 */ 
const plain = winston.format.printf((input) => {

	return `${input.timestamp} ${input.name} [${input.level}] :: id=${input.id} message=${input.message}`;

});

/**
 * https://github.com/winstonjs/winston/blob/master/docs/transports.md
 */ 
const TRANSPORTERS = {
	
	/**
	 * 
	 */ 
	console: (level, kind) => {

		if (kind === 'plain') {

			return new winston.transports.Console({
				format: winston.format.combine(
					winston.format.colorize(),
					plain
				),
				level: level || 'debug'
			});

		} else if (kind === 'object') {

			return new winston.transports.Console({
				format: winston.format.json(),
				level: level || 'debug'
			});

		}


	},
	
	/**
	 * 
	 */ 
	file: (level, kind, settings) => {

		const {filename} = settings;

		if ((typeof(filename) !== 'string') || (!filename)) {

			throw new Exception('MINOR', 400, `Logger File Transport requires a full path for a log file`, null, null);

		} else {

			try {

				const resolved = path.dirname(path.resolve(filename));

				fs.mkdirSync(resolved, {
					recursive: true
				});

			} catch (directoryError) {

				throw new Exception('MINOR', 400, `Logger File Transport is facing problems to create directory`, directoryError, null);

			}

			if (kind === 'plain') {

				return new winston.transports.File({
					filename: filename,
					format: plain,
					level: level || 'debug'
				});

			} else if (kind === 'object') {

				return new winston.transports.File({
					filename: filename,
					format: winston.format.json(),
					level: level || 'debug'
				});

			}

		}

	},
	
	/**
	 * 
	 */ 
	mongodb: (level, kind, uri) => {

		throw new Exception('MINOR', 400, `"mongodb" transporter is not implemented`, null, null);

	},
	
	/**
	 * 
	 */ 
	syslog: (level, kind) => {

		throw new Exception('MINOR', 400, `"syslog" transporter is not implemented`, null, null);

	},
	
	/**
	 * 
	 */ 
	googlelogging: (level, kind) => {

		throw new Exception('MINOR', 400, `"googlelogging" transporter is not implemented`, null, null);

	},
	
	/**
	 * 
	 */ 
	cloudwatch: (level, kind) => {

		throw new Exception('MINOR', 400, `"cloudwatch" transporter is not implemented`, null, null);

	}
};

/**
 * "POJO", Log data structure, model, default
 * The Log record itself
 */ 
class Log {

	/**
	 * Constructor
	 */ 
	constructor (name, level, message) {

		if ((typeof(name) !== 'string') || (!name)) {

			throw new Exception('MAJOR', 400, 'Log constructor "name" must be a lowercase string, identifying the logger', null, null);

		}

		if ((typeof(level) !== 'string') || (!level)) {

			throw new Exception('MAJOR', 400, `Log constructor "level" must be a lowercase string of a syslog level`, null, null);

		} else if (LEVELS.indexOf(level) === -1) {

			throw new Exception('MAJOR', 400, `Log constructor "level" must valid syslog level: ${LEVELS.join(', ')}`, null, null);

		}

		if ((typeof(message) !== 'string') || (!message)) {

			throw new Exception('MAJOR', 400, 'Log constructor "message" must be a lowercase string, identifying the logger', null, null);

		}

		this.id = uuidv4();
		this.name = name;
		this.level = level;
		this.timestamp = Time.now(true);
		this.message = message;

		return this;

	}

	/**
	 * Label the log
	 */ 
	label (label) {

		this.label = label || null;

		return this;

	}

	/**
	 * Identify the user
	 */ 
	identify (user) {

		this.user = user || null;

		return this;

	}

	/**
	 * Append an Error or an Exception to the Log
	 * TODO (or think) - throw if level != (error, critical, alert, emergency), this.error === required?????
	 */ 
	error (error) {

		if (error instanceof Exception) {

			this.error = error.toObject();

		} else if (error instanceof Error) {

			this.error = new Exception(MAP_EXCEPTION_LEVELS[this.level], 500, 'Exception from Error in Log', error, null).toObject();

		} else {

			throw new Exception('MAJOR', 400, `To add an error to the logger it must be a native Error or Exception class - ${typeof(error)} is not accepted`, error, null);

		}

		return this;

	}

	/**
	 * References a row in a database
	 */
	reference (database, model, reference) {

		this.database = database || null;
		this.model = model || null;
		this.reference = reference || null;

		return this;

	}

	/**
	 * Append a payload - String, Object, and so on to the Log
	 * TODO (or think) Serialize payload?
	 */ 
	payload (payload) {

		this.payload = payload || null;

		return this;

	}

	/**
	 * Return a resumed plain structured of the log
	 */ 
	toPlain() {

		return `${this.timestamp.toISOString()} ${this.name} [${this.level}] :: id=${this.id} message=${this.message}`;

	}
	
	/**
	 * Apply JSON.stringify to this.toObject()
	 */
	toJSON() {

		return JSON.stringify(this.toObject());

	}

	/**
	 * Return a copy of this log as an object
	 */
	toObject() {

		return {
			id: this.id,
			name: this.name,
			level: this.level,
			timestamp: this.timestamp,
			message: this.message,
			label: this.label || null,
			user: this.user || null,
			error: this.error || null,
			database: this.database || null,
			model: this.model || null,
			reference: this.reference || null,
			payload: this.payload || null
		};

	}

}

/**
 * Uses https://tools.ietf.org/html/rfc5424
 */ 
class Logger {

	/**
	 * Enabled Transports
	 */ 
	static TRANSPORTS = Object.keys(TRANSPORTERS);

	/**
	 * Logger Constructor
	 * name:String, meta?:Object
	 * 
	 * throws Exception
	 */ 
	constructor (name) {

		if ((typeof(name) !== 'string') || (!name)) {

			throw new Exception('MAJOR', 400, 'Logger constructor "name" must be a lowercase string, identifying the logger', null, null);

		}

		// Setup Winston
		
		winston.addColors(COLORS);

		this.name = name;

		this.agent = winston.createLogger({
			levels: winston.config.syslog.levels,
			exitOnError: false,
			transports: []
		});

		return this;


	}

	/**
	 * transport: String (Logger.TRANSPORTS)
	 * level:String (winston.config.syslog.levels) 
	 * kind: String (plain|object)
	 * settings: Object? - Specific transport settings
	 * 
	 * throws Exception
	 */ 
	add (transport, level, kind, settings) {

		if ((typeof(transport) !== 'string') || (!transport)) {

			throw new Exception('MAJOR', 400, `Logger.add required a valid and not empty string"`, null, null);

		} else if (Logger.TRANSPORTS.indexOf(transport) === -1) {

			throw new Exception('MAJOR', 400, `Logger.add required a valid enabled transport - "${Logger.TRANSPORTS.join(', ')}"`, null, null);

		}

		if ((typeof(level) !== 'string') || (!level)) {

			throw new Exception('MAJOR', 400, `Logger.add required valid level string from should the transport log - "${Object.keys(winston.config.syslog.levels).join(', ')}" `, null, null);

		}

		if ((typeof(kind) !== 'string') || (!kind)) {

			throw new Exception('MAJOR', 400, `Logger.add required a string of "plain" | "object" to set the output format in logger`, null, null);

		}

		if ((settings) && (typeof(settings) !== 'object') && (Object.keys(settings).length === 0)) {

			throw new Exception('MAJOR', 400, `Logger.add required a fullfilled object if settings are required`, null, null);

		}

		this.agent.add(TRANSPORTERS[transport](level, kind, settings));

		return this;

	}

	/**
	 * Generic Method to perform LOG
	 * 
	 * throws Exception
	 */ 
	log (input) {

		if ((!input) || (!(input instanceof Log))) {

			throw new Exception('MINOR', 400, `Logger.log input must be an instance of Log`, null, input);

		} else {

			try {

				this.agent.log(input.toObject());

				return this;

			} catch (logError) {

				throw new Exception('MINOR', 500, `Internal error when performing Logger.log`, logError, input.toObject());

			}

		}

	}

}

module.exports = {Logger, Log};
