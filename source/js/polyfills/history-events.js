/* global NODE_ENV DEBUG */
/* eslint 'prefer-rest-params': 'off', 'compat/compat': 'off' */

/*
    Note that just calling history.pushState() or history.replaceState() won't trigger a popstate event.
    https://developer.mozilla.org/ru/docs/Web/Events/popstate
*/
function historyEventDecorator(type) {
    const origHandler = window.history[type];
    return function newHandler() {
        if (NODE_ENV === 'development' || DEBUG) {
            console.log(`[history-events.js] ${type}:`, JSON.stringify(arguments));
        }
        const result = origHandler.apply(this, arguments);
        const event = new Event(type);
        event.arguments = arguments;
        window.dispatchEvent(event);
        return result;
    };
}

window.history.pushState = historyEventDecorator('pushState');

window.history.replaceState = historyEventDecorator('replaceState');
