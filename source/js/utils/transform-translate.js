export default function getTransformTranslate(element) {
    const translate = { x: 0, y: 0 };
    const style = window.getComputedStyle(element);
    if (!style.transform || style.transform === 'none') return translate;
    const [, matrixType, matrixValue] = style.transform.match(/^(matrix|matrix3d)\((.+)\)$/);
    const matrixArray = matrixValue.split(', ');
    if (matrixType === 'matrix3d') {
        translate.x = parseFloat(matrixArray[12]) || 0;
        translate.y = parseFloat(matrixArray[13]) || 0;
    } else {
        translate.x = parseFloat(matrixArray[4]) || 0;
        translate.y = parseFloat(matrixArray[5]) || 0;
    }
    return translate;
}
