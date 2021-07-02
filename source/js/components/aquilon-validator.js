import nextTick from '~/utils/next-tick';

async function updateValidator() {
    await nextTick(); // wait side effects changes

    if (!$.aquilonValidator.initNode) {
        throw new Error('[aquilon-validator] Method `initNode` does not exist. Please update.');
    }

    $.aquilonValidator.initNode(document);
}

if ($.aquilonValidator) {
    // SPA events
    window.addEventListener('pushstate', updateValidator, false);
    window.addEventListener('popstate', updateValidator, false);
}
