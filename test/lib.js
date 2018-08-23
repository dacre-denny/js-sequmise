var sequmise = require('../src/sequmise');
var chai = require('chai');
var chaiAsPromised = require("chai-as-promised");

chai.use(chaiAsPromised);

var assert = chai.assert;

const delayedResult = (result, milliseconds) => async () => new Promise(resolve => setTimeout(() => resolve(result), milliseconds))

const rejectResult = () => () => new Promise((resolve, reject) => reject())

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

    describe('expected error behaviour', function () {

        it('should reject if single async task that rejects passed as argument', async function () {

            await assert.isRejected(sequmise(rejectResult()))
        })

        it('should reject if one async task rejects amongst many passed arguments', async function () {

            await assert.isRejected(sequmise('hello', () => {}, 456, rejectResult()))
        })

        it('should reject if one async task rejects amongst many async tasks passed as arguments', async function () {

            await assert.isRejected(sequmise(delayedResult(123, 10), delayedResult('hello world', 10), rejectResult()))
        })

        it('should reject if single async task that rejects passed as array', async function () {

            await assert.isRejected(sequmise([rejectResult()]))
        })

        it('should reject if one async task rejects amongst many passed as array', async function () {

            await assert.isRejected(sequmise(['hello', () => {}, 456, rejectResult()]))
        })

        it('should reject if one async task rejects amongst many async tasks passed as array', async function () {

            await assert.isRejected(sequmise([delayedResult(123, 10), delayedResult('hello world', 10), rejectResult()]))
        })

        it('should reject if one async task rejects in nested argument array', async function () {

            await assert.isRejected(sequmise([
                delayedResult('hello', 10),
                delayedResult('world', 10),
                delayedResult('!', 10)
            ], [
                delayedResult(1, 10),
                delayedResult(2, 10),
                rejectResult(),
            ]))
        })

        it('should reject if one async task rejects in nested arguments', async function () {

            await assert.isRejected(sequmise(
                [
                    'hello',
                    delayedResult('world', 10),
                    '!'
                ], [
                    1,
                    rejectResult(2, 10),
                ]
            ))
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

        it('should return result matching sequence values in arguments', async function () {

            assert.deepEqual(await sequmise(
                ['hello', 'world', '!'], [1, 2, 3, [undefined, {}]]
            ), [
                ['hello', 'world', '!'],
                [1, 2, 3, [undefined, {}]],
            ])
        })

        it('should return result matching sequence nested promises in arguments', async function () {

            assert.deepEqual(await sequmise(
                [
                    delayedResult('hello', 10),
                    delayedResult('world', 10),
                    delayedResult('!', 10)
                ], [
                    delayedResult(1, 10),
                    delayedResult(2, 10),
                    delayedResult(3, 10),
                ]
            ), [
                ['hello', 'world', '!'],
                [1, 2, 3],
            ])
        })

        it('should return result matching sequence of mixed promises and non-promises in arguments', async function () {

            assert.deepEqual(await sequmise(
                [
                    'hello',
                    delayedResult('world', 10),
                    '!'
                ], [
                    1,
                    delayedResult(2, 10),
                    3
                ]
            ), [
                ['hello', 'world', '!'],
                [1, 2, 3],
            ])
        })
    })

    describe('stress testing behaviour', function () {
        it('should return matching sequence of resolved promises for 10000 tasks', async function () {

            const inputs = []
            const results = []

            for (var i = 0; i < 1000; i++) {
                inputs.push(delayedResult(i, 1))
                results.push(i)
            }

            assert.deepEqual(await sequmise(inputs), results)
        })

        it('should return matching sequence of resolved promises for 100 nested tasks', async function () {

            let inputs = ['hello', 'world']
            let results = ['hello', 'world']

            for (var i = 0; i < 100; i++) {

                inputs = [delayedResult(i * 5, 10), inputs, delayedResult(i, 5)]
                results = [i * 5, results, i]
            }

            assert.deepEqual(await sequmise(inputs), results)
        })
    })
});