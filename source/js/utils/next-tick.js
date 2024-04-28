/**
 * Wait next tick
 * @returns {Promise} - next tick promise
 */
export default function nextTick() {
    return new Promise((resolve) => {
        requestAnimationFrame(resolve);
    });
}
