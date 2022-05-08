/* globals APP NODE_ENV DEBUG */

const EXT_PATTERN = /\.(png|jpg|jpeg)(\?.*)?$/;

export default function imageSrc(url) {
    const src = url;
    if (document.documentElement.classList.contains('avif')
                && APP.AVIF && (NODE_ENV === 'production' || DEBUG)) {
        src = url.replace(EXT_PATTERN, '.avif$2');
    } else if (document.documentElement.classList.contains('webp')
                && APP.WEBP && (NODE_ENV === 'production' || DEBUG)) {
        src = url.replace(EXT_PATTERN, '.webp$2');
    }
    return src;
}
