export default function fetchTimeout(input, init, delay = 7000) {
    return Promise.race([
        fetch(input, init),
        new Promise((resolve, reject) => {
            setTimeout(() => {
                reject(new Error(`Timeout error [${delay}]`));
            }, delay);
        }),
    ]);
}
