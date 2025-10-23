/**
 * Load an image from a given URL
 * @param {string} src -  url The URL of the image resource
 * @returns {Promise<Image>} The loaded image
 */
export default function loadImage(src) {
    return new Promise((resolve, reject) => {
        const imageElement = new Image();

        imageElement.addEventListener('load', () => {
            resolve(imageElement);
        });
        imageElement.addEventListener('error', (errorEvent) => {
            reject(errorEvent);
        });
        imageElement.src = src;

        return imageElement;
    });
}
