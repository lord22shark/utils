/**
 * Token Tests
 */ 
const Token = require('../src/token.js');

const PUB = `-----BEGIN CERTIFICATE-----

-----END CERTIFICATE-----
`;

const KEY = `-----BEGIN PRIVATE KEY-----

-----END PRIVATE KEY-----
`;


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
test('Token is imported', () => {

	expect(Token).toBeDefined();

});

/**
 * Scenario :: Grouping Tests
 */ 
describe('Check 3 operations with Token: Sign, Verify and Decode', () => {

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
	test('Token Sign', async () => {

		const x = new Token(KEY, PUB, 'RS512');

		const t = await x.sign({a:1, b: '2', c: false, iss: 'eu', expires: new Date().toISOString()});

		console.log(t);

		expect(t).toBeDefined();

	});

	/**
	 * 
	 */
	test('Token Verify', async () => {

		const x = new Token(KEY, PUB, 'RS512');

		const t = await x.verify('eyJhbGciOiJSUzUxMiIsInR5cCI6IkpXVCJ9.eyJhIjoxLCJiIjoiMiIsImMiOmZhbHNlLCJpc3MiOiJldSIsImV4cGlyZXMiOiIyMDIyLTExLTE2VDAyOjA3OjUwLjIyNloiLCJpYXQiOjE2Njg1NjQ0NzB9.DcCuHWNzBq38JHERDUD3Hydl9YPrwF_q9nRDTBFCyH0MxgHOjEK1L2eRM93EqBuQQyI2o5Zmm4VQEV82CoqLjLXPZVqOTjMYiTwW5oXovwgMqogMW4WC24ZZmog0bfNtUi54jXJU0aG3GoluiKp7xQ9k3RqNelpcskoFOrFNMJU-uEyMZLWXonxDocuAg8au-OpFP0BMCaNWBd8SwvbfoQlg0zRMqSi0wvJ8SFtO_zaWDgBpd7mTxCL7uWVc1sBq8W-Q7lrbS0yF2FNVU00c_dlg1Y3T0R5jFnST3S69zPxQoreSF1jCHE4lPcK3tUkubYR3a1qqobsFzlsCKQU7Uw');

		console.log('verify', t);

		expect(t).toBeDefined();

	}); 

	/**
	 * 
	 */
	test('Token Decode', async () => {

		const x = new Token(KEY, PUB, 'RS512');

		const t = await x.decode('eyJhbGciOiJSUzUxMiIsInR5cCI6IkpXVCJ9.eyJhIjoxLCJiIjoiMiIsImMiOmZhbHNlLCJpc3MiOiJldSIsImV4cGlyZXMiOiIyMDIyLTExLTE2VDAyOjA3OjUwLjIyNloiLCJpYXQiOjE2Njg1NjQ0NzB9.DcCuHWNzBq38JHERDUD3Hydl9YPrwF_q9nRDTBFCyH0MxgHOjEK1L2eRM93EqBuQQyI2o5Zmm4VQEV82CoqLjLXPZVqOTjMYiTwW5oXovwgMqogMW4WC24ZZmog0bfNtUi54jXJU0aG3GoluiKp7xQ9k3RqNelpcskoFOrFNMJU-uEyMZLWXonxDocuAg8au-OpFP0BMCaNWBd8SwvbfoQlg0zRMqSi0wvJ8SFtO_zaWDgBpd7mTxCL7uWVc1sBq8W-Q7lrbS0yF2FNVU00c_dlg1Y3T0R5jFnST3S69zPxQoreSF1jCHE4lPcK3tUkubYR3a1qqobsFzlsCKQU7Uw');

		console.log('decode', t);

		expect(t).toBeDefined();

	}); 
	
});  
