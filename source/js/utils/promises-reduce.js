export function promisesReduce(promises, reducer) {
    return promises.reduce((promise, index) => promise.then(() => reducer(index)), Promise.resolve());
}

export default promisesReduce;
