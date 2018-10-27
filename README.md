<h1 align="center">sequmise</h1>
<p align="center">resolve arrays of promises and asynchronous tasks sequentially</p>

<p align="center">
    <a href="https://travis-ci.org/dacredenny/js-sequmise">
        <img src="https://api.travis-ci.org/dacredenny/js-sequmise.svg?branch=master" alt="build">
    </a>
    <a href="https://coveralls.io/github/dacredenny/js-sequmise?branch=master">
        <img src="https://coveralls.io/repos/github/dacredenny/js-sequmise/badge.svg?branch=master" alt="Coverage Status">
    </a>
    <a href="https://www.npmjs.com/package/sequmise">
        <img src="https://img.shields.io/npm/dm/sequmise.svg" alt="Downloads">
    </a>
    <a href="https://codeclimate.com/github/dacredenny/js-sequmise/maintainability"><img src="https://api.codeclimate.com/v1/badges/fd6fb786e4d6dd28c973/maintainability" /></a>
</p>

## Quick Start

#### Installation

```
npm install sequmise
```

#### Basic Usage

```
import sequmise from '/sequmise';

// Specify asynchronous tasks via array
const [ session, asyncResult, syncResult ] = 
    await sequmise([ fetch('/session'), asyncTask, syncTask ])

// Specify asynchronous tasks by multiple arguments
const [ jsonAll, jsonOne ] = 
    await sequmise(fetch('/get/all'), fetch('/get/1'))
```

## Introduction

**_sequmise_** is a utility that simplifies sequential execution of multiple promises/asynchronous tasks. 

When all supplied tasks execute successfully, **_sequmise_** returns a single array containing the result of each task. The order of results in the returned array matches the order that tasks were executed. If any task throws an exception or is rejected, this behavior will be propagated by **_sequmise_**.

With no external dependencies and a simple, flexible API, **_sequmise_** is a useful tool to have on hand for your next project.

## Advanced Usage

Support for value, sync and async task combinations:

```
// sequmise will resolve values, sync and async tasks, returning the 
// resolved results in order
const results = await sequmise([
    'hello world',          // resolves to 'hello world'
    fetch('/session'),      // resolves to { session : '123' }
    fetch('/username'),     // resolves to { username : 'John Smith' }
])

assert.deepEqual(results, [
    'hello world',
    { session : '123' },
    { username : 'John Smith' }
])
```

Support for nested value, sync and async task combinations:

```
// sequmise will resolve nested arrays, maintaining the order and 
// nesting hierarchy
const results = await sequmise([
    [
        fetch('/session'),  // resolves to { session : '123' }
        fetch('/user')      // resolves to { username : 'John Smith' }
    ],
    [
        123,                // resolves to 123,
        createAsyncTask()   // resolves to { testing : 123 }
    ]
])

assert.deepEqual(results, [
    [
        { session : '123' },
        { username : 'John Smith' }
    ],
    [
        123,
        { testing : 123 }
    ]
])
```

Support for value, sync and async tasks to be specified via multiple arguments/spreading:

```
const results = await sequmise(123, 
    asyncReturn('goodbye'), 
    'test', 
    asyncReturn('moon'))

assert.deepEqual(results, [
    123,
    'goodbye'
    'test'
    'moon'
])
```

## Run tests

```
npm run test
```
