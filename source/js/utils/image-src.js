/* globals APP NODE_ENV DEBUG */

const EXT_PATTERN = /\.(png|jpg|jpeg)(\?.*)?$/;
const USE_AVIF = APP.AVIF && (NODE_ENV === 'production' || DEBUG);
const USE_WEBP = APP.WEBP && (NODE_ENV === 'production' || DEBUG);

export default function imageSrc(url) {
    let src = url;

    if (USE_AVIF && document.documentElement.classList.contains('avif')) {
        src = url.replace(EXT_PATTERN, '.avif$2');
    } else if (USE_WEBP && document.documentElement.classList.contains('webp')) {
        src = url.replace(EXT_PATTERN, '.webp$2');
    }
    return src;
}
