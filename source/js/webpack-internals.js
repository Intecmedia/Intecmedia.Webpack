/**
 * --------------------------------------------------------------------------
 * Internals webpack-entry
 * --------------------------------------------------------------------------
 */

/* global NODE_ENV APP DEBUG */

/* eslint-disable-next-line no-undef -- set webpack public path on the fly https://webpack.js.org/guides/public-path/#set-value-on-the-fly */
__webpack_public_path__ = document.documentElement.getAttribute('data-public-path') || APP.PUBLIC_PATH;

const useCompression = DEBUG || NODE_ENV === 'production';
const BROTLI_PATTERN = /\.min\.js\.br/;
const GZIP_PATTERN = /\.min\.js\.gz/;

/* eslint-disable-next-line no-undef -- set chunk filename https://webpack.js.org/api/module-variables/#__webpack_get_script_filename__-webpack-specific */
const org_get_script_filename = __webpack_get_script_filename__;
/* eslint-disable-next-line no-undef -- set chunk filename https://webpack.js.org/api/module-variables/#__webpack_get_script_filename__-webpack-specific */
__webpack_get_script_filename__ = (chunkId) => {
    const filename = org_get_script_filename(chunkId);
    const [filebase, filequery] = filename.split('?', 2);

    const useBrotli = useCompression && APP.BROTLI && document.currentScript?.src?.match(BROTLI_PATTERN);
    if (useBrotli) {
        return `${filebase}.br?${filequery}`;
    }

    const useGzip = useCompression && APP.GZIP && document.currentScript?.src?.match(GZIP_PATTERN);
    if (useGzip) {
        return `${filebase}.gz?${filequery}`;
    }

    return filename;
};
