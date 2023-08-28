/**
 * Logger Tests
 */ 
const {Logger, Log} = require('../src/logger.js');
const Exception = require('../src/exception.js');


/**
 * Global :: beforeAll
 */ 
beforeAll(() => {

	//console.log('[LOGGER]', 'GLOBAL', 'Nothing to do beforeAll');

});

/**
 * Global :: afterAll
 */ 
afterAll(() => {

	//console.log('[LOGGER]', 'GLOBAL', 'Nothing to do afterAll');

});

/**
 * Global :: beforeEach
 */ 
beforeEach(() => {

	//console.log('[LOGGER]', 'GLOBAL', 'Nothing to do beforeEach');

});

/**
 * Global :: afterEach
 */ 
afterEach(() => {

	//console.log('[LOGGER]', 'GLOBAL', 'Nothing to do afterEach');

});

/**
 * Global :: Test
 */ 
test('Logger is imported', () => {

	expect(Logger).toBeDefined();

});

/**
 * Global :: Test
 */ 
test('Log is imported', () => {

	expect(Log).toBeDefined();

});

/**
 * Scenario :: Grouping Tests
 */ 
describe('Check all kinds of Exception', () => {

	/**
	 * Local :: beforeAll
	 */ 
	beforeAll(() => {

		//console.log('[LOGGER]', 'LOCAL', 'Nothing to do beforeAll');

	});

	/**
	 * Local :: afterAll
	 */ 
	afterAll(() => {

		//console.log('[LOGGER]', 'LOCAL', 'Nothing to do afterAll');

	});

	/**
	 * Local :: beforeEach
	 */ 
	beforeEach(() => {

		//console.log('[LOGGER]', 'LOCAL', 'Nothing to do beforeEach');

	});

	/**
	 * Local :: afterEach
	 */ 
	afterEach(() => {

		//console.log('[LOGGER]', 'LOCAL', 'Nothing to do afterEach');

	});

	/**
	 * 
	 */
	test('Full logger executed with plain scenario', () => {

		const _logger = new Logger('utils');

		_logger.add('console', 'debug', 'plain')

		const _exception = new Exception('MAJOR', 400, 'Jest Logger Test Exception', null, null);

		const _log = new Log('utils', 'error', 'cillum aute magna sint excepteur laborum magna').label('utils').identify('jest').reference('localStorage', 'log', new Date().toISOString()).payload({'test': 'jest'}).error(_exception);

		expect(_log.toObject().level).toBe('error');

		expect(() => {
		
			_logger.log(_log);

		}).not.toThrow();

	});

});  

/*
const mockCallback = jest.fn(x => 42 + x);
forEach([0, 1], mockCallback);

// The mock function is called twice
expect(mockCallback.mock.calls.length).toBe(2);

import axios from 'axios';
import Users from './users';

jest.mock('axios');
*/
