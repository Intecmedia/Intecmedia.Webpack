import $breakpoints from '~/components/breakpoints';

export default {
    xs: window.matchMedia(`(max-width: ${$breakpoints.sm})`),
    sm: window.matchMedia(`(min-width: ${$breakpoints.sm}) and (max-width: ${$breakpoints.md})`),
    md: window.matchMedia(`(min-width: ${$breakpoints.md}) and (max-width: ${$breakpoints.lg})`),
    lg: window.matchMedia(`(min-width: ${$breakpoints.lg}) and (max-width: ${$breakpoints.xl})`),
    xl: window.matchMedia(`(min-width: ${$breakpoints.xl})`),
};
