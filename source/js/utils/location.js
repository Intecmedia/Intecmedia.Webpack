/**
 *
 * @param loc
 */
export function normalizeLocation(loc) {
    return `${loc.origin + loc.pathname}?${loc.search}`;
}

/**
 *
 * @param loc
 */
export function isExternalLocation(loc) {
    return normalizeLocation(document.location) !== normalizeLocation(loc);
}

/**
 *
 * @param hash
 */
export function isValidHash(hash) {
    return hash.indexOf('#') === 0 && hash.indexOf('#/') !== 0 && hash.length > 1;
}
