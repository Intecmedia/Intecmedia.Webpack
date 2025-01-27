export default function fetchTimeout(input, init = {}, delay = 5000) {
    var controller, timeoutId;
    if (!('signal' in init) && window.AbortController) {
        /* eslint-disable-next-line compat/compat -- checked in ternary if */
        controller = new AbortController();
        init.signal = controller.signal;
    }
    return Promise.race([
        fetch(input, init)
            .then((response) => {
                if (timeoutId) {
                    clearTimeout(timeoutId);
                    timeoutId = null;
                }
                return response;
            })
            .catch((error) => {
                if (timeoutId) {
                    clearTimeout(timeoutId);
                    timeoutId = null;
                }
                throw error;
            }),
        new Promise((resolve, reject) => {
            timeoutId = setTimeout(() => {
                const reason = `Timeout error [${delay}ms]`;
                if (controller) {
                    controller.abort(reason);
                }
                timeoutId = null;
                reject(new Error(reason));
            }, delay);
        }),
    ]);
}
