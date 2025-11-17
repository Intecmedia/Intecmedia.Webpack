const scriptLoadMap = {};

/**
 * Load an script from a given URL
 * @param {string} src -  url The URL of the script resource
 * @returns {Promise<HTMLScriptElement>} The loaded script
 */
export default function loadScript(src) {
    return new Promise((resolve, reject) => {
        const existsScript = document.querySelector(`script[src='${src}']`);
        if (existsScript instanceof HTMLScriptElement) {
            if (src in scriptLoadMap) {
                resolve(existsScript);
            } else {
                existsScript.addEventListener('load', () => {
                    scriptLoadMap[src] = true;
                    resolve(existsScript);
                });
                existsScript.addEventListener('error', (errorEvent) => {
                    reject(errorEvent);
                });
            }

            return existsScript;
        }

        const scriptElement = document.createElement('script');
        scriptElement.addEventListener('load', () => {
            scriptLoadMap[src] = true;
            resolve(scriptElement);
        });
        scriptElement.addEventListener('error', (errorEvent) => {
            reject(errorEvent);
        });
        scriptElement.type = 'text/javascript';
        scriptElement.src = src;
        scriptElement.async = true;
        document.body.appendChild(scriptElement);

        return scriptElement;
    });
}
