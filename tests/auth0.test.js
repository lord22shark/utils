/**
 * Auth0 Tests
 */ 
const Auth0 = require('../src/auth0.js');


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

	expect(Auth0).toBeDefined();

});

/**
 * Scenario :: Grouping Tests
 */ 
describe('Check Auth0', () => {

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
	test('Constructor is working', async () => {

		const x = new Auth0({
			'audience': 'Settings.AUTH0_AUDIENCE',
			'client_id': 'Settings.AUTH0_CLIENT_ID',
			'client_secret': 'Settings.AUTH0_CLIENT_SECRET',
			'connection': 'Settings.AUTH0_CONNECTION',
			'domain': 'Settings.AUTH0_DOMAIN',
			'logout_url': 'Settings.AUTH0_LOGOUT_URL',
			'response_type': 'Settings.AUTH0_RESPONSE_TYPE',
			'redirect_uri': 'Settings.AUTH0_REDIRECT_URI',
			'state': 'Settings.AUTH0_STATE',
			'version': 'Settings.AUTH0_VERSION'
		});

		expect(x).toBeDefined();

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
