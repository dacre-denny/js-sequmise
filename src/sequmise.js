/**
 * Helper function processes a task asynchronously. If the tasks is not
 * a function, the task is treated as a value and returned
 * @param {*} task - the task to be processed asynchronously
 */
async function processTask(task) {
  if (typeof task === "function") {
    return await task();
  } else {
    return task;
  }
}

/**
 * Helper function processes an array of asynchronous tasks, sequentially and
 * in order. If an item in the tasks is itself an array, that item will be
 * processed as an array of asynchronous tasks.
 * @param {Object[]} tasks - the tasks to be processed asynchronously
 */
async function processArray(tasks) {
  const results = [];

  while (tasks.length) {
    const task = tasks.shift();

    if (Array.isArray(task)) {
      results.push(await processArray(task));
    } else {
      results.push(await processTask(task));
    }
  }

  return results;
}

/**
 * Sequentially processes asynchronous tasks that are passed as arguments to the
 * library. One or more asynchronous tasks can be specified, either as an array,
 * or as one or more arguments passed to the library.
 * Supports processing of asynchronous tasks, synchronous tasks, and values. Nested
 * arrays are processed recursively.
 */
module.exports = async function() {
  if (arguments.length === 0) {
    return;
  }

  if (arguments.length === 1) {
    if (Array.isArray(arguments[0])) {
      return await processArray(arguments[0]);
    } else {
      return await processTask(arguments[0]);
    }
  }

  return await processArray(Array.from(arguments));
};
