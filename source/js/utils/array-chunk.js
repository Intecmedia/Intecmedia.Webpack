/**
 * Split an array into chunks
 * @param arr - input ararray
 * @param size - size of chhnk
 * @returns {Array}
 */
export default function arrayChunk(arr, size) {
    const result = [];
    for (let i = 0; i < arr.length; i += size) {
        const chunk = arr.slice(i, i + size);
        result.push(chunk);
    }
    return result;
}
