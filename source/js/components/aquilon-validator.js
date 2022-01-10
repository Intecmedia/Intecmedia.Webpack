import nextTick from '~/utils/next-tick';

async function updateValidator() {
    await nextTick(); // wait side effects changes

    if (!window.$.aquilonValidator.initNode) {
        throw new Error('[aquilon-validator] Method `initNode` does not exist. Please update.');
    }

    window.$.aquilonValidator.initNode(document);
}

if (window.$.aquilonValidator) {
    // SPA events
    window.addEventListener('pushstate', updateValidator);
    window.addEventListener('popstate', updateValidator);
}
