/* global VERBOSE */
import breakpoints from '~/components/breakpoints';

const createMatchMedia = (query, name) => {
    const mql = window.matchMedia(query);
    mql.addListener((event) => {
        let newEvent;
        if (typeof (Event) === 'function') {
            newEvent = new Event('matches-breakpoints');
        } else {
            newEvent = document.createEvent('Event');
            newEvent.initEvent('matches-breakpoints', true, true);
        }
        newEvent.detail = {
            name, query, matches: event.matches, originalEvent: event,
        };
        window.dispatchEvent(newEvent);
        if (VERBOSE) {
            console.log(`[breakpoints] name=${name} query=${JSON.stringify(query)} matches=${JSON.stringify(event.matches)}`);
        }
    });
    return mql;
};

const matchBreakpoints = {
    xs: createMatchMedia(`(max-width: ${breakpoints.sm})`, 'xs'),
    xsOnly: createMatchMedia(`(max-width: ${breakpoints.sm})`, 'xs-only'),

    sm: createMatchMedia(`(max-width: ${breakpoints.md})`, 'sm'),
    smOnly: createMatchMedia(`(min-width: ${breakpoints.sm}) and (max-width: ${breakpoints.md})`, 'sm-only'),

    md: createMatchMedia(`(max-width: ${breakpoints.lg})`, 'md'),
    mdOnly: createMatchMedia(`(min-width: ${breakpoints.md}) and (max-width: ${breakpoints.lg})`, 'md-only'),

    lg: createMatchMedia(`(max-width: ${breakpoints.xl})`, 'lg'),
    lgOnly: createMatchMedia(`(min-width: ${breakpoints.lg}) and (max-width: ${breakpoints.xl})`, 'lg-only'),

    xl: createMatchMedia(`(min-width: ${breakpoints.xl})`, 'xl'),
    xlOnly: createMatchMedia(`(min-width: ${breakpoints.xl}) and (max-width: ${breakpoints.xxl})`, 'xl-only'),

    xxl: createMatchMedia(`(min-width: ${breakpoints.xxl})`, 'xxl'),
    xxlOnly: createMatchMedia(`(min-width: ${breakpoints.xxl})`, 'xxl-only'),
};

export default matchBreakpoints;
