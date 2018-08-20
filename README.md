<h1 align="center">js-sequmise</h1>
<p align="center">Resolve arrays of promises sequentially</p>

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

## Usage

```
    import sequmise from '/sequmise';

    const results = await sequmise([
        fetch('/session'),
        fetch('/user'),
        waitForAsynTask(),
        'hello world'
    ])

    /*
    [
        { session : '123' },
        { user : { id : 13, name : 'John Smith' }},
        'finished waiting',
        'hello world'
    ]
    */
```
