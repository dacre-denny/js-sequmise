async function processTask(task) {

    if (task instanceof Function) {
        return await task()
    } else {
        return task
    }
}

async function processArray(tasks) {

    const results = []

    while (tasks.length) {
        const task = tasks.shift()

        if (Array.isArray(task)) {
            results.push(await processArray(task))
        } else {
            results.push(await processTask(task))
        }
    }

    return results
}

module.exports = async function () {

    if (arguments.length === 0) {
        return
    }

    if (arguments.length === 1) {

        if (Array.isArray(arguments[0])) {

            return await processArray(arguments[0])
        } else {

            return await processTask(arguments[0])
        }
    }

    return await processArray(Array.from(arguments))
}