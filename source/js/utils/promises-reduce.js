export function promisesReduce(promisesList, callbackFn) {
    return promisesList.reduce((promise, index) => promise.then(() => callbackFn(index)), Promise.resolve());
}

export default promisesReduce;
