/**
 * Split an array into chunks.
 * @param {Array} arr - input ararray
 * @param {number} size - size of chhnk
 * @returns {Array[]} - array of arrays
 */
export default function arrayChunk(arr, size) {
    const result = [];
    for (let i = 0; i < arr.length; i += size) {
        const chunk = arr.slice(i, i + size);
        result.push(chunk);
    }
    return result;
}
