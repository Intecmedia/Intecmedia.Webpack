/* global VERBOSE */
/* eslint 'prefer-rest-params': 'off', 'compat/compat': 'off' */

const Reflect = require('core-js/stable/reflect/index.js');

/*
    Note that just calling history.pushState() or history.replaceState() won't trigger a popstate event.
    https://developer.mozilla.org/ru/docs/Web/Events/popstate
*/
function historyEventDecorator(type) {
    const origHandler = window.history[type];
    return function newHandler() {
        if (VERBOSE) {
            console.log(`[history-events.js] ${type}:`, arguments);
        }
        const result = Reflect.apply(origHandler, this, arguments);
        let event;
        if (typeof (Event) === 'function') {
            event = new Event(type.toLowerCase());
        } else {
            event = document.createEvent('Event');
            event.initEvent(type.toLowerCase(), true, true);
        }
        event.arguments = arguments;
        window.dispatchEvent(event);
        return result;
    };
}

window.history.pushState = historyEventDecorator('pushState');

window.history.replaceState = historyEventDecorator('replaceState');
