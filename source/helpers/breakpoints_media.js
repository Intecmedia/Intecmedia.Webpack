/* eslint "compat/compat": "off" */
const DEFAULT_SIZES = {
    xs: 576, sm: 768, md: 992, lg: 1200, xl: 1900,
};

const DEFAULT_BREAKPOINTS = ['xs', 'sm', 'md', 'lg', 'xl'];

module.exports = (breakpoints = DEFAULT_BREAKPOINTS, sizes = DEFAULT_SIZES) => {
    const sortedBreakpoints = Object.entries(sizes)
        .sort((a, b) => (a[1] - b[1]))
        .map((i) => i[0])
        .filter((i) => breakpoints.includes(i));
    const mergedSizes = {

        ...sortedBreakpoints.reduce((entries, [k, v]) => ({ ...entries, [k]: v })),
        ...sizes,
    };
    return sortedBreakpoints.map((breakpoint, index) => [breakpoint, [
        // not first
        ...(index >= 1 && sortedBreakpoints[index - 1]
            ? [`(min-width: ${mergedSizes[sortedBreakpoints[index - 1]] + 1}px)`]
            : []),
        // not last
        ...(index !== sortedBreakpoints.length - 1
            ? [`(max-width: ${mergedSizes[breakpoint]}px)`]
            : []),
    ].join(' and ')]);
};
