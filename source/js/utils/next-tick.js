export default function nextTick() {
    return new Promise((resolve) => {
        requestAnimationFrame(resolve);
    });
}
