/**
 * Exception Tests
 */ 
const Exception = require('../src/exception.js');


/**
 * Global :: beforeAll
 */ 
beforeAll(() => {

	//console.log('[EXCEPTION]', 'GLOBAL', 'Nothing to do beforeAll');

});

/**
 * Global :: afterAll
 */ 
afterAll(() => {

	//console.log('[EXCEPTION]', 'GLOBAL', 'Nothing to do afterAll');

});

/**
 * Global :: beforeEach
 */ 
beforeEach(() => {

	//console.log('[EXCEPTION]', 'GLOBAL', 'Nothing to do beforeEach');

});

/**
 * Global :: afterEach
 */ 
afterEach(() => {

	//console.log('[EXCEPTION]', 'GLOBAL', 'Nothing to do afterEach');

});

/**
 * Global :: Test
 */ 
test('Exception is imported', () => {

	expect(Exception).toBeDefined();

});

/**
 * Scenario :: Grouping Tests
 */ 
describe('Check all kinds of Exception', () => {

	/**
	 * Local :: beforeAll
	 */ 
	beforeAll(() => {

		//console.log('[EXCEPTION]', 'LOCAL', 'Nothing to do beforeAll');

	});

	/**
	 * Local :: afterAll
	 */ 
	afterAll(() => {

		//console.log('[EXCEPTION]', 'LOCAL', 'Nothing to do afterAll');

	});

	/**
	 * Local :: beforeEach
	 */ 
	beforeEach(() => {

		//console.log('[EXCEPTION]', 'LOCAL', 'Nothing to do beforeEach');

	});

	/**
	 * Local :: afterEach
	 */ 
	afterEach(() => {

		//console.log('[EXCEPTION]', 'LOCAL', 'Nothing to do afterEach');

	});

	/**
	 * 
	 */
	test('Exception instanciated without "extra" cause', () => {

		const x = new Exception('MAJOR', 404, 'Some message', null, {test: true});

		expect(x.toObject().files.length).toBe(1);

	});

	/**
	 * 
	 */
	test('Exception instanciated with "extra" cause', () => {

		const x = new Exception('MAJOR', 404, 'Some message', new Error('Inner Cause'), {test: true});

		expect(x.toObject().files.length).toBe(2);

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
