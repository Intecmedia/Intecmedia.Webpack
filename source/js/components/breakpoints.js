/* global VERBOSE */
const htmlStyle = getComputedStyle(document.documentElement);

const breakpoints = {
    xs: htmlStyle.getPropertyValue('--breakpoint-xs'),
    sm: htmlStyle.getPropertyValue('--breakpoint-sm'),
    md: htmlStyle.getPropertyValue('--breakpoint-md'),
    lg: htmlStyle.getPropertyValue('--breakpoint-lg'),
    xl: htmlStyle.getPropertyValue('--breakpoint-xl'),
    xxl: htmlStyle.getPropertyValue('--breakpoint-xxl'),
};

if (VERBOSE) {
    console.log(`[breakpoints] ${JSON.stringify(breakpoints)}`);
}

export default breakpoints;
