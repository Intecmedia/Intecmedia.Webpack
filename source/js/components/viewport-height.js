// https://css-tricks.com/the-trick-to-viewport-units-on-mobile/

const resizeHandler = () => {
   const vh = window.innerHeight * 0.01;
   document.documentElement.style.setProperty('--vh', `${vh}px`);

   const vw = window.innerWidth * 0.01;
   document.documentElement.style.setProperty('--vw', `${vw}px`);
};

window.addEventListener('resize', resizeHandler);
resizeHandler();