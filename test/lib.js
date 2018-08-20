var sequmise = require('../src/sequmise');
var assert = require('assert');

const delayedResult = (result, milliseconds) => async () => new Promise(resolve => setTimeout(() => resolve(result), milliseconds))

describe('sequmise', function () {

    describe('expected result type', function () {

        it('should return promise when no arguments passed', async function () {
            assert(sequmise() instanceof Promise)
        })

        it('should return promise when non-array argument', async function () {
            assert(sequmise('hello') instanceof Promise)
        })

        it('should return promise with spread arguments', async function () {
            assert(sequmise('hello', 'world', '!') instanceof Promise)
        })

        it('should return promise when empty array argument', async function () {
            assert(sequmise([]) instanceof Promise)
        })

        it('should return promise when non-empty array argument', async function () {
            assert(sequmise([1, 'hello', () => {}, new Promise(r => r())]) instanceof Promise)
        })
    })

    describe('expected result values', function () {

        it('should return undefined from await when no argument passed', async function () {

            assert.strictEqual(await sequmise(), undefined)
        })

        it('should return value from await when non-array argument passed', async function () {

            assert.strictEqual(await sequmise('hello'), 'hello')
        })

        it('should return array with spread arguments', async function () {

            assert.deepEqual(await sequmise('hello', 'world', '!'), ['hello', 'world', '!'])
        })

        it('should return an empty array with empty array argument passed', async function () {

            assert.deepEqual(await sequmise([]), [])
        })

        it('should return an array with result sequence matching input sequence', async function () {

            assert.deepEqual(await sequmise([1, 2, 3, 4]), [1, 2, 3, 4])
            assert.deepEqual(await sequmise(['hello', 123, 'world']), ['hello', 123, 'world'])
            assert.deepEqual(await sequmise(['hello', () => {}, 456]), ['hello', undefined, 456])
        })

        it('should return an array with values matching sequence of resolved input promises ', async function () {

            assert.deepEqual(await sequmise([
                delayedResult('this', 10),
                delayedResult('is', 15),
                delayedResult('a', 20),
                delayedResult('delayed', 25),
                delayedResult('sequence', 30),
            ]), ['this', 'is', 'a', 'delayed', 'sequence'])
        })

        it('should return an array with values matching sequence of resolved input promises ', async function () {

            assert.deepEqual(await sequmise([
                delayedResult('hello', 10),
                delayedResult(123, 15),
                delayedResult({}, 20),
                delayedResult(undefined, 25),
            ]), ['hello', 123, {}, undefined])
        })

        it('should return array with values matching sequence of resovled promises spread in arguments', async function () {

            assert.deepEqual(await sequmise(
                delayedResult('hello', 10),
                delayedResult('world', 10),
                delayedResult('!', 10)
            ), ['hello', 'world', '!'])
        })
    })
});