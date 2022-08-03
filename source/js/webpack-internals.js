/* global NODE_ENV APP DEBUG */

/* eslint-disable-next-line camelcase, no-undef -- set webpack public path on the fly https://webpack.js.org/guides/public-path/#set-value-on-the-fly */
__webpack_public_path__ = document.documentElement.getAttribute('data-public-path') || APP.PUBLIC_PATH;

/* eslint-disable-next-line camelcase, no-undef -- set chunk filename https://webpack.js.org/api/module-variables/#__webpack_get_script_filename__-webpack-specific */
const org_get_script_filename = __webpack_get_script_filename__;
/* eslint-disable-next-line camelcase, no-undef -- set chunk filename https://webpack.js.org/api/module-variables/#__webpack_get_script_filename__-webpack-specific */
__webpack_get_script_filename__ = (chunkId) => {
    const filename = org_get_script_filename(chunkId);
    const [filebase, filequery] = filename.split('?', 2);

    const useBrotli = document.currentScript?.src?.match(/\.min\.js\.br/)
        && ((NODE_ENV === 'production' || DEBUG) && APP.BROTLI);
    if (useBrotli) {
        return `${filebase}.br?${filequery}`;
    }

    const useGzip = document.currentScript?.src?.match(/\.min\.js\.gz/)
        && ((NODE_ENV === 'production' || DEBUG) && APP.GZIP);
    if (useGzip) {
        return `${filebase}.gz?${filequery}`;
    }

    return filename;
};
