import getTransformTranslate from '~/utils/transform-translate';

export function visibleRatioVertical(element, scrollTop = null, scrollHeight = null) {
    const translate = getTransformTranslate(element);
    const top = scrollTop || document.documentElement.scrollTop;
    const height = scrollHeight || window.innerHeight;
    const distance = (top + height) - (element.offsetTop + translate.y);
    const ratio = Number(distance / (height + element.offsetHeight)).toFixed(4);
    return Math.min(1, Math.max(0, ratio));
}

export function visibleRatioHorizontal(element, scrollLeft = null, scrollWidth = null) {
    const translate = getTransformTranslate(element);
    const left = scrollLeft || document.documentElement.scrollLeft;
    const width = scrollWidth || window.innerWidth;
    const distance = (left + width) - (element.offsetLeft + translate.x);
    const ratio = Number(distance / (width + element.offsetWidth)).toFixed(4);
    return Math.min(1, Math.max(0, ratio));
}

export default function visibleRatio(element, scrollTop = null, scrollHeight = null) {
    return visibleRatioVertical(element, scrollTop, scrollHeight);
}
