/**
 * Time Tests
 */ 
const Time = require('../src/sorting.js');


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
test('Time is imported', () => {

	expect(Time).toBeDefined();

});

/**
 * Scenario :: Grouping Tests
 */ 
describe('Check 3 kinds of Time: Intl, Static and Fallback', () => {

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

		delete Time[Time.numberFormat];

		//console.log('[EXCEPTION]', 'LOCAL', 'Nothing to do afterEach');

	});

	/**
	 * 
	 */
	test('Time with default', () => {

		const x = new Time();

		expect(x.format(1)).toBe('R$1,00');

	});

	/**
	 * 
	 */
	test('Time with static', () => {

		Intl = null;

		const x = new Time();

		expect(x.format(1)).toBe('R$1,00');

	}); 

	/**
	 * 
	 */
	test('Time with fallback', () => {

		const x = new Time('fr-FR', 'EUR');

		expect(x.format(1)).toBe('$1.00');

	}); 
	
});  
