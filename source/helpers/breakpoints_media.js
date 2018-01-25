const DEFAULT_SIZES = {
    xs: 576, sm: 768, md: 992, lg: 1200, xl: 1900,
};

const DEFAULT_BREAKPOINTS = ['xs', 'sm', 'md', 'lg', 'xl'];

module.exports = (breakpoints, sizes) => {
    const sorted = DEFAULT_BREAKPOINTS.filter(i => breakpoints.includes(i));
    const merged = Object.assign({}, sizes, DEFAULT_SIZES);

    const result = new Map();
    sorted.forEach((breakpoint, index) => {
        result[breakpoint] = [
            // not first
            ...(index >= 1 && sorted[index - 1] ? [`(min-width: ${merged[sorted[index - 1]]}px)`] : []),
            // not last
            ...(index !== sorted.length - 1 ? [`(max-width: ${merged[breakpoint] - 1}px)`] : []),
        ].join(' and ');
    });
    return result;
};
