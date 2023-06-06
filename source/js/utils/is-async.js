export default function isAsync(obj) {
    if ((obj && obj.constructor.name === 'AsyncFunction') || ('then' in obj && typeof obj.then === 'function')) {
        return true;
    }
    return false;
}
