// https://css-tricks.com/the-trick-to-viewport-units-on-mobile/

const resizeHandler = () => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
};

window.addEventListener('resize', resizeHandler);
resizeHandler();
