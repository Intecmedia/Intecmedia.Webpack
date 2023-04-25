import getTransformTranslate from '~/utils/transform-translate';

export function visibleRatioVertical(element, scrollTop = null, scrollHeight = null) {
    const top = scrollTop || document.documentElement.scrollTop;
    const height = scrollHeight || window.innerHeight;
    const translateY = getTransformTranslate(element).y;
    const distance = top + height - (element.offsetTop + translateY);
    const ratio = Number(distance / (height + element.offsetHeight)).toFixed(4);
    return Math.min(1, Math.max(0, ratio));
}

export function visibleRatioHorizontal(element, scrollLeft = null, scrollWidth = null) {
    const left = scrollLeft || document.documentElement.scrollLeft;
    const width = scrollWidth || window.innerWidth;
    const translateX = getTransformTranslate(element).x;
    const distance = left + width - (element.offsetLeft + translateX);
    const ratio = Number(distance / (width + element.offsetWidth)).toFixed(4);
    return Math.min(1, Math.max(0, ratio));
}

export function visibleRatio(element, scrollTop = null, scrollHeight = null) {
    return visibleRatioVertical(element, scrollTop, scrollHeight);
}

export default visibleRatio;
