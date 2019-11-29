const $html = $(document.documentElement);

export default {
    xs: $html.css('--breakpoint-xs'),
    sm: $html.css('--breakpoint-sm'),
    md: $html.css('--breakpoint-md'),
    lg: $html.css('--breakpoint-lg'),
    xl: $html.css('--breakpoint-xl'),
};
