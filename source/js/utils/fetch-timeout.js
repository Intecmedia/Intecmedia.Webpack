export default function fetchTimeout(input, init = {}, delay = 5000) {
    /* eslint-disable-next-line compat/compat -- checked in ternary if */
    const controller = !('signal' in init) && window.AbortController ? new AbortController() : null;
    if (controller) {
        init.signal = controller.signal;
    }

    return Promise.race([
        fetch(input, init),
        new Promise((resolve, reject) => {
            setTimeout(() => {
                if (controller) {
                    controller.abort();
                }
                reject(new Error(`Timeout error [${delay}]`));
            }, delay);
        }),
    ]);
}
