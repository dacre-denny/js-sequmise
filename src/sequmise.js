/**
 * Helper function processes a task asynchronously. If the tasks is not
 * a function, the task is treated as a value and returned
 * @param {*} task - the task to be processed asynchronously
 */
async function processTask(task) {
  if (typeof task === "function") {
    /* Invoke task if it is a function */
    return await task();
  } else {
    /* Return task as value if not a function */
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

  for (const task of tasks) {
    if (Array.isArray(task)) {
      /* If task is an array, process task as an array */
      results.push(await processArray(task));
    } else {
      /* If task is non array, process as generic task */
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
      /* If single argument supplied is array, process argument as an array */
      return await processArray(arguments[0]);
    } else {
      /* If single argument is non array, process argument as generic task */
      return await processTask(arguments[0]);
    }
  }

  /* If more than one argument, convert to and process as an array */
  return await processArray(Array.from(arguments));
};
