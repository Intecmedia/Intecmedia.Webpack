export default function loadScript(src) {
    return new Promise((resolve, reject) => {
        const existsScript = document.querySelector(`script[src='${src}']`);
        if (existsScript instanceof HTMLScriptElement) {
            existsScript.addEventListener('load', () => resolve());
            existsScript.addEventListener('error', () => reject());

            return existsScript;
        }

        const scriptElement = document.createElement('script');
        scriptElement.onload = resolve;
        scriptElement.onerror = reject;
        scriptElement.type = 'text/javascript';
        scriptElement.src = src;
        scriptElement.async = true;
        document.body.appendChild(scriptElement);

        return scriptElement;
    });
}
