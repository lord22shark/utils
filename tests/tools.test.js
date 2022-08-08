/**
 * Tools Tests
 */ 
const Tools = require('../src/tools.js');


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
test('Tools is imported', () => {

	console.log(Tools);

	expect(Tools).toBeDefined();

});

/**
 * Global :: Tool.deep
 */ 
test('Tools.deep works properly', () => {

	const output = Tools.deep({a:{b:{c:{d:':-)'}}}}, 'a.b.c.d');

	expect(output).toBe(':-)');

});

/**
 * Global :: Tool.isObjectId
 */ 
test('Tools.isObjectId works properly - Success case', () => {

	expect(Tools.isObjectId('6164b77a078626a20af6216f')).toBe(true);

});

/**
 * Global :: Tool.isObjectId
 */ 
test('Tools.isObjectId works properly - Error case', () => {

	expect(Tools.isObjectId('6164b77z078626a20af6216f')).toBe(false);

});
