/* global NODE_ENV DEBUG */
import $breakpoints from '~/components/breakpoints';

const $wnd = $(window);

const createMatchMedia = (query, name) => {
    const mql = window.matchMedia(query);
    mql.addListener((event) => {
        const { matches } = event;
        $wnd.triggerHandler('matches.breakpoints', { name, query, matches });
        if (NODE_ENV === 'development' || DEBUG) {
            console.log(`[breakpoints] name=${name} query=${JSON.stringify(query)} matches=${JSON.stringify(matches)}`);
        }
    });
    return mql;
};

const $matchBreakpoints = {
    xs: createMatchMedia(`(max-width: ${$breakpoints.sm})`, 'xs'),
    xsOnly: createMatchMedia(`(max-width: ${$breakpoints.sm})`, 'xs-only'),

    sm: createMatchMedia(`(max-width: ${$breakpoints.md})`, 'sm'),
    smOnly: createMatchMedia(`(min-width: ${$breakpoints.sm}) and (max-width: ${$breakpoints.md})`, 'sm-only'),

    md: createMatchMedia(`(max-width: ${$breakpoints.lg})`, 'md'),
    mdOnly: createMatchMedia(`(min-width: ${$breakpoints.md}) and (max-width: ${$breakpoints.lg})`, 'md-only'),

    lg: createMatchMedia(`(max-width: ${$breakpoints.xl})`, 'lg'),
    lgOnly: createMatchMedia(`(min-width: ${$breakpoints.lg}) and (max-width: ${$breakpoints.xl})`, 'lg-only'),

    xl: createMatchMedia(`(min-width: ${$breakpoints.xl})`, 'xl'),
    xlOnly: createMatchMedia(`(min-width: ${$breakpoints.xl})`, 'xl-only'),
};

export default $matchBreakpoints;
