const scriptLoadMap = {};

export default function loadScript(src) {
    return new Promise((resolve, reject) => {
        const onLoad = () => {
            scriptLoadMap[src] = true;
            resolve();
        };
        const onError = () => {
            reject();
        };

        const existsScript = document.querySelector(`script[src='${src}']`);
        if (existsScript instanceof HTMLScriptElement) {
            if (src in scriptLoadMap) {
                onLoad();
            } else {
                existsScript.addEventListener('load', onLoad);
                existsScript.addEventListener('error', onError);
            }

            return existsScript;
        }

        const scriptElement = document.createElement('script');
        scriptElement.onload = onLoad;
        scriptElement.onerror = onError;
        scriptElement.type = 'text/javascript';
        scriptElement.src = src;
        scriptElement.async = true;
        document.body.appendChild(scriptElement);

        return scriptElement;
    });
}
