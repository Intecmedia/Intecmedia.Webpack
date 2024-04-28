import getTransformTranslate from '~/utils/transform-translate';

/**
 * Get visible ratio vertical.
 * @param {HTMLElement} element - html element
 * @param {number} scrollTop - top scroll position
 * @param {number} scrollHeight - scroll height
 * @returns {number} - between 0 and 1
 */
export function visibleRatioVertical(element, scrollTop = null, scrollHeight = null) {
    const top = scrollTop || document.documentElement.scrollTop;
    const height = scrollHeight || window.innerHeight;
    const translateY = getTransformTranslate(element).y;
    const distance = top + height - (element.offsetTop + translateY);
    const ratio = Number(distance / (height + element.offsetHeight)).toFixed(4);
    return Math.min(1, Math.max(0, ratio));
}

/**
 * Get visible ratio horizontal.
 * @param {HTMLElement} element - html element
 * @param {number} scrollLeft - left scroll position
 * @param {number} scrollWidth - scroll width
 * @returns {number} - between 0 and 1
 */
export function visibleRatioHorizontal(element, scrollLeft = null, scrollWidth = null) {
    const left = scrollLeft || document.documentElement.scrollLeft;
    const width = scrollWidth || window.innerWidth;
    const translateX = getTransformTranslate(element).x;
    const distance = left + width - (element.offsetLeft + translateX);
    const ratio = Number(distance / (width + element.offsetWidth)).toFixed(4);
    return Math.min(1, Math.max(0, ratio));
}

/**
 * Get visible ratio vertical.
 * @param {HTMLElement} element - html element
 * @param {number} scrollTop - top scroll position
 * @param {number} scrollHeight - scroll height
 * @returns {number} - between 0 and 1
 */
export function visibleRatio(element, scrollTop = null, scrollHeight = null) {
    return visibleRatioVertical(element, scrollTop, scrollHeight);
}

export default visibleRatio;
