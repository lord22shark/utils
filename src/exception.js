/**
 * External Dependencies
 */  
const path = require('path');
const {v4:uuidv4} = require('uuid');

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

		this.date = new Date().toISOString();

		return this;

	}

	/**
	 * 
	 */ 
	_getSource () {

		const stacks = [this.stack];

		if (this.cause && this.cause.stack) {

			stacks.push(this.cause.stack);

		}

		return stacks.map((s) => {

			const basename = path.basename(module.parent.filename);
			
			const dirname = path.dirname(module.parent.filename);

			const line = s.split('\n').slice(1).find((x) => {

				return x.indexOf(module.parent.filename) !== -1;

			});

			if (!line) {

				return {
					path: dirname,
					file: basename,
					line: 0,
					column: 0
				};

			} else {

				const parser = new RegExp(`(.*)\\(${module.parent.filename}:(\\d+):(\\d+)\\)`);

				const matches = line.trim().match(parser);

				if (matches) {

					return {
						path: dirname,
						file: basename,
						line: parseInt(matches[2]),
						column: parseInt(matches[3])
					};

				} else {

					return {
						path: dirname,
						file: basename,
						line: 0,
						column: 0
					};

				}

			}

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
			version: '1.0.0',
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

		}).join(',');

		return `${this.date} ${this.level}[${this.status}] :: id=${this.id} message=${this.message.replace(needle, '')} files=${files}`;

	}

}

module.exports = Exception;