/**
 * External Dependencies
 */  
const path = require('path');
const {v4:uuidv4} = require('uuid');

/**
 * Internal Dependencies
 */
const Time = require('./time.js'); 

/**
 * Error Severities
 */ 
const FEL = {
	'FEATURE': 'Feature', // no negative impact on current processes; request for additional functionality
	'TRIVIAL': 'Trivial', // annoyance/hindrance; a simple workaround is available
	'TEXT': 'Text', // tiny negative impact; text-based content needs updated
	'TWEAK': 'Tweak', // small negative impact; workaround is unavailable or is very complex/inefficient
	'MINOR': 'Minor', // medium negative impact; no workaround available
	'MAJOR': 'Major', // large negative impact; no workaround available
	'CRASH': 'Crash', // severe negative impact; hardware/software necessary for job duties is crashed/crashing
	'BLOCK': 'Block', // critical negative impact; this issue is holding up progress on another issue/task/project
};

/**
 * Parsers
 */ 
//const parserA = /at(\s+)?(.*)(\s+)?\(((.*)\:(\d+)\:(\d+))\)/;
//const parserB = /at(\s+)?((.*)\:(\d+)\:(\d+))/;

const parserC = /at\s.*?\s\(([^:]+):(\d+):(\d+)\)/;
const parserD = /([^:]+):(\d+):(\d+)/;

/**
 * 
 */ 
class Exception extends Error {

	/**
	 * 
	 */ 
	static KEYS = Object.keys(FEL);

	/**
	 * 
	 */ 
	constructor (level, status, message, cause, data) {

		if (cause && cause instanceof Error) {

			super(`[${FEL[level]} ${status}] ${message} due to ${cause.message}`, {cause: cause});

		} else {

			super(`[${FEL[level]} ${status}] ${message}`);
		
		}

		this.name = FEL[level];

		this.id = uuidv4();

		this.level = (Exception.KEYS.indexOf(level) !== -1) ? level : 'BLOCK';

		this.status = status || 501;

		this.data = data;

		this.date = Time.now(true);

		return this;

	}

	/**
	 * 
	 * @param {*} stack 
	 * @returns 
	 */
	_parseStack (stack) {
		
		if ((!stack) || (typeof stack !== 'string')) {
			
			return null;

		}

		let filename = module.parent.main ? path.basename(module.parent.main.filename) : path.basename(module.parent.filename);
	
		const lines = stack.split('\n').slice(1);
	
		for (const line of lines) {

			const match = line.match(parserC) || line.match(parserD);

			if (match) {

				const [, filepath, line, column] = match;
			
				try {

					return {
						main: filename,
						path: path.dirname(filepath),
						file: path.basename(filepath),
						line: parseInt(line, 10),
						column: parseInt(column, 10)
					};


				} catch (e) {

					continue;
		
				}
		
			}
		
		}

		return {
			main: filename,
			path: null,
			file: null,
			line: null,
			column: null
		};

	};

	/**
	 * 
	 */ 
	_getSource () {

		const stacks = [this.stack];

		if (this.cause && this.cause.stack) {

			stacks.push(this.cause.stack);

		}

		return stacks.map((s) => {

			return this._parseStack(s);	

		});		

	}

	/**
	 * 
	 */ 
	toObject () {

		const output = {
			name: this.name,
			id: this.id,
			level: this.level,
			status: this.status,
			message: this.message,
			data: this.data,
			date: this.date,
			files: this._getSource()
		};

		return output;

	}

	/**
	 * 
	 */ 
	toJSON () {

		return JSON.stringify(this.toObject());

	}

	/**
	 * 
	 */ 
	toText () {

		const needle = `[${this.name} ${this.status}] `;

		const files = this._getSource().map((f) => {

			return f.file;

		}).join(', ');

		return `${this.date} ${this.level}[${this.status}] :: id=${this.id} message=${this.message.replace(needle, '')} files=${files}`;

	}

}

module.exports = Exception;
