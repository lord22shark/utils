/**
 * Currency Tests
 */ 
const Currency = require('../src/currency.js');


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
test('Currency is imported', () => {

	expect(Currency).toBeDefined();

});

/**
 * Scenario :: Grouping Tests
 */ 
describe('Check 3 kinds of Currency: Intl, Static and Fallback', () => {

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

		delete Currency[Currency.numberFormat];

		//console.log('[EXCEPTION]', 'LOCAL', 'Nothing to do afterEach');

	});

	/**
	 * 
	 */
	test('Currency with default', () => {

		const x = new Currency();

		expect(x.format(1)).toBe('R$1,00');

	});

	/**
	 * 
	 */
	test('Currency with static', () => {

		Intl = null;

		const x = new Currency();

		expect(x.format(1)).toBe('R$1,00');

	}); 

	/**
	 * 
	 */
	test('Currency with fallback', () => {

		const x = new Currency('fr-FR', 'EUR');

		expect(x.format(1)).toBe('$1.00');

	}); 
	
});  
