const DEFAULT_SIZES = {
    xs: 576, sm: 768, md: 992, lg: 1200, xl: 1900,
};

const DEFAULT_BREAKPOINTS = ['xs', 'sm', 'md', 'lg', 'xl'];

module.exports = (breakpoints, sizes) => {
    const sortedBreakpoints = DEFAULT_BREAKPOINTS.filter(i => breakpoints.includes(i));
    const mergedSizes = Object.assign({}, sizes, DEFAULT_SIZES);
    return sortedBreakpoints.map((breakpoint, index) => [breakpoint, [
        // not first
        ...(index >= 1 && sortedBreakpoints[index - 1]
            ? [`(min-width: ${mergedSizes[sortedBreakpoints[index - 1]]}px)`]
            : []),
        // not last
        ...(index !== sortedBreakpoints.length - 1
            ? [`(max-width: ${mergedSizes[breakpoint] - 1}px)`]
            : []),
    ].join(' and ')]);
};
