/**
 * Reduce promices with callback function.
 * @param {Array.Promise} promises - promises array
 * @param {Function} reducer - reduce callback
 * @returns {object} - promise result
 */
export function promisesReduce(promises, reducer) {
    return promises.reduce((promise, index) => promise.then(() => reducer(index)), Promise.resolve());
}

export default promisesReduce;
