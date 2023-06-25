// https://css-tricks.com/the-trick-to-viewport-units-on-mobile/

class ViewportHeight {
    constructor() {
        this.onResize = this.onResize.bind(this);
    }

    init() {
        window.addEventListener('resize', this.onResize);
    }

    updateHeight() {
        const viewportHeight = window.visualViewport ? window.visualViewport.height : window.innerHeight;
        document.documentElement.style.setProperty('--vh', `${parseFloat((viewportHeight * 0.01).toFixed(6))}px`);
    }

    onResize() {
        this.updateHeight();
    }
}

const instance = new ViewportHeight();
instance.init();

export default instance;
