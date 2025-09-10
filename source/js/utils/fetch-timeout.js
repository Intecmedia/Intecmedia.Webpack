/**
 * The fetch() with timeout.
 * @param {string} input - a string or any other object with a stringifier
 * @param {object} init - a RequestInit object containing any custom settings that you want to apply to the request.
 * @param {number} delay - delays number of microseconds
 * @returns {Promise} - a Promise that resolves to a Response object
 */
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
