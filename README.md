<h1 align="center">sequmise</h1>
<p align="center">Resolve collections of promises sequentially</p>

<p align="center">
    <a href="https://travis-ci.org/dacredenny/js-sequmise">
        <img src="https://api.travis-ci.org/dacredenny/js-sequmise.svg?branch=master" alt="build">
    </a>
    <a href="https://coveralls.io/github/dacredenny/js-sequmise?branch=master">
        <img src="https://coveralls.io/repos/github/dacredenny/js-sequmise/badge.svg?branch=master" alt="Coverage Status">
    </a>
    <a href="https://github.com/dacredenny/js-sequmise">
        <img src="http://githubbadges.com/star.svg?user=dacredenny&amp;repo=js-sequmise&amp;style=flat" alt="star this repo">
    </a>
    <a href="https://github.com/dacredenny/js-sequmise/fork">
        <img src="http://githubbadges.com/fork.svg?user=dacredenny&amp;repo=js-sequmise&amp;style=flat" alt="fork this repo">
    </a>
</p>

## Quick Start

#### Installation

```
npm install sequmise
```

#### Usage

```
    import sequmise from '/sequmise';

    const results = await sequmise([
        fetch('/session'),   // resolves to { session : '123' }
        fetch('/user'),      // resolves to { user : { id : 13, name : 'John Smith' }},
        createAsyncTask(),   // resolves to { finished : true, duration : 500 }
        createSyncTask()     // resolves to { message : 'hello world' }
    ])

    /*
    If all tasks resolved successfully, results will be:
    [
        { session : '123' },
        { user : { id : 13, name : 'John Smith' }},
        { finished : true, duration : 500 },
        { message : 'hello world' }
    ]
    */
```

## Introduction

sequmise is a light weight utility library that simplifies sequential execution of multiple asynchronous tasks.

For situations where multiple asynchronous tasks need to be processed, with resolved results returned in the order of processing, try sequmise. With no external dependencies and a simple, flexible API, sequmise is a useful tool to have on hand for your next project.

## Advanced Usage

Support for asnyc tasks and value combinations:

```
    const results = await sequmise([
        123,                 // resolves to 123
        fetch('/session'),   // resolves to { session : '123' }
        'hello world',       // resolves to 'hello world'
        fetch('/user'),      // resolves to { user : { id : 13, name : 'John Smith' }},
    ])

    /*
    If async tasks resolved successfully, results will be:
    [
        123,
        { session : '123' },
        'hello world'
        { user : { id : 13, name : 'John Smith' }}
    ]
    */
```

Support for nested async tasks and value combinations:

```
    const results = await sequmise([
        [
            fetch('/session'),  // resolves to { session : '123' }
            fetch('/user')      // resolves to { user : { id : 13, name : 'John Smith' }},
        ],
        [
            123,                // resolves to 123,
            createAsyncTask()   // resolves to { testing : 123 }
        ]
    ])

    /*
    If async tasks resolved successfully, results will be:
    [
        [
            { session : '123' },
            { user : { id : 13, name : 'John Smith' }}
        ],
        [
            123,
            { testing : 123 }
        ]
    ]
    */
```

Support for tasks across multiple arguments/spreading:

```
    const results = await sequmise(123, asyncReturn('goodbye'), 'test', asyncReturn('moon'))

    /*
    If async tasks resolved successfully, results will be:
    [
        123,
        'goodbye'
        'test'
        'moon'
    ]
    */
```
