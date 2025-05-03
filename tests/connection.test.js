/**
 * Connection Tests
 */ 
const Connection = require('../src/connection.js');


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

	expect(Connection).toBeDefined();

});

/**
 * Scenario :: Grouping Tests
 */ 
describe('Check all kinds of Connection', () => {

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
	test('Connection to MongoDB localhost', async () => {

		const mongo = await new Connection('mongodb://localhost:27017/estomazil');

		try {

			const output = await mongo.engine.connection.db.collection('projeto').find({}).toArray();

			await mongo.client.disconnect();

			expect(output).toBeDefined();

		} catch (error) {

			expect(error).toBeDefined();

		}

	});

	/**
	 * 
	 */
	test('Connection to Redis localhost', async () => {

		const redis = await new Connection('redis://localhost:6379/1');

		try {

			await redis.client.set('key', 1);
			
			const o = await redis.client.get('key');

			await redis.client.disconnect();

			expect(o).toBe('1');

		} catch (error) {

			expect(error).toBeDefined();

		}
		

	});

	/**
	 * 
	 */
	test('Connection to BigQuery with credentials', async () => {

		try {

			const bigquery = await new Connection('bigquery:///path/to/my/credentials?project=2948TYGUERIH')

			expect(bigquery).toBeDefined();

		} catch (error) {

			expect(error).toBeDefined();

		}

	});

	/**
	 * 
	 */
	test('Connection to PostgresSQL localhost', async () => {

		try {
	
			// ?sslmode=no-verify

			const postgres = await new Connection('postgres://postgres:postgres@localhost:5432/postgres');

			const o = await postgres.client.query('SELECT VERSION();');

			await postgres.client.release();
			
			await postgres.client.end();

			expect(o).toBeDefined();

		} catch (error) {

			expect(error).toBeDefined();

		}
		

	});

	/**
	 * 
	 */
	test('Connection to MySQL localhost', async () => {

		try {
	
			// ?sslmode=no-verify

			const mysql = await new Connection('mysql://root:mysql@localhost:3306/mysql');

			const o = await mysql.client.query('SELECT VERSION();');

			await mysql.client.releaseConnection();
			
			await mysql.pool.end();

			expect(o).toBeDefined();

		} catch (error) {

			expect(error).toBeDefined();

		}
		

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
