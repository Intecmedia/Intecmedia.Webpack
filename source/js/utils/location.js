/**
 * Normalize location url.
 * @param {Location} loc - input location
 * @returns {string} - normalize location
 */
export function normalizeLocation(loc) {
    return `${loc.origin + loc.pathname}?${loc.search}`;
}

/**
 * Check is external location.
 * @param {Location} loc - input location
 * @returns {boolean} - check result
 */
export function isExternalLocation(loc) {
    return normalizeLocation(document.location) !== normalizeLocation(loc);
}

/**
 * Check is valid hash location.
 * @param {string} hash - input hash location
 * @returns {boolean} - check result
 */
export function isValidHash(hash) {
    return hash.indexOf('#') === 0 && hash.indexOf('#/') !== 0 && hash.length > 1;
}
