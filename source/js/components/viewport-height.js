// https://css-tricks.com/the-trick-to-viewport-units-on-mobile/

const resizeHandler = () => {
    const viewportHeight = window.visualViewport ? window.visualViewport.height : window.innerHeight;
    const vh = viewportHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
};

window.addEventListener('resize', resizeHandler);
resizeHandler();
