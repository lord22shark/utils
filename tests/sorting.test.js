/**
 * Sorting Tests
 */ 
const Sorting = require('../src/sorting.js');


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
test('Sorting is imported', () => {

	expect(Sorting).toBeDefined();

});

/**
 * Scenario :: Grouping Tests
 */ 
describe('Check 3 kinds of Sorting: Intl, Static and Fallback', () => {

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

		delete Sorting[Sorting.numberFormat];

		//console.log('[EXCEPTION]', 'LOCAL', 'Nothing to do afterEach');

	});

	/**
	 * 
	 */
	test('Sorting with default', () => {

		const x = new Sorting();

		expect(x.format(1)).toBe('R$1,00');

	});

	/**
	 * 
	 */
	test('Sorting with static', () => {

		Intl = null;

		const x = new Sorting();

		expect(x.format(1)).toBe('R$1,00');

	}); 

	/**
	 * 
	 */
	test('Sorting with fallback', () => {

		const x = new Sorting('fr-FR', 'EUR');

		expect(x.format(1)).toBe('$1.00');

	}); 
	
});  
