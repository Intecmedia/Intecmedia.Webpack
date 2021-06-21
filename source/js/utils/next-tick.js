export default function nextTick() {
    return new Promise(((resolve) => {
        window.requestAnimationFrame(resolve);
    }));
}
