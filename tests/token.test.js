/**
 * Token Tests
 */ 
const Token = require('../src/sorting.js');


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
describe('Check 3 kinds of Token: Intl, Static and Fallback', () => {

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

		delete Token[Token.numberFormat];

		//console.log('[EXCEPTION]', 'LOCAL', 'Nothing to do afterEach');

	});

	/**
	 * 
	 */
	test('Token with default', () => {

		const x = new Token();

		expect(x.format(1)).toBe('R$1,00');

	});

	/**
	 * 
	 */
	test('Token with static', () => {

		Intl = null;

		const x = new Token();

		expect(x.format(1)).toBe('R$1,00');

	}); 

	/**
	 * 
	 */
	test('Token with fallback', () => {

		const x = new Token('fr-FR', 'EUR');

		expect(x.format(1)).toBe('$1.00');

	}); 
	
});  
