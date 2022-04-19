export function normalizeLocation(loc) {
    return `${loc.origin + loc.pathname}?${loc.search}`;
}

export function isExternalLocation(loc) {
    return normalizeLocation(document.location) !== normalizeLocation(loc);
}

export function isValidHash(hash) {
    return hash.indexOf('#') === 0 && hash.indexOf('#/') !== 0 && hash.length > 1;
}
