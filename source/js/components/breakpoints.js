/* global NODE_ENV DEBUG */
const $html = $(document.documentElement);

const $breakpoints = {
    xs: $html.css('--breakpoint-xs'),
    sm: $html.css('--breakpoint-sm'),
    md: $html.css('--breakpoint-md'),
    lg: $html.css('--breakpoint-lg'),
    xl: $html.css('--breakpoint-xl'),
};

if (NODE_ENV === 'development' || DEBUG) {
    console.log(`[breakpoints] ${JSON.stringify($breakpoints)}`);
}

export default $breakpoints;
