/**
 * --------------------------------------------------------------------------
 * Viewport visible height detection
 * https://css-tricks.com/the-trick-to-viewport-units-on-mobile/
 * --------------------------------------------------------------------------
 */

import { debounce } from '~/utils/tickers';

const RESIZE_DEBOUNCE = 200;

class ViewportHeight {
    constructor() {
        this.onResize = this.onResize.bind(this);

        this.endEvent = new CustomEvent('resize.end');
        this.endTrigger = debounce(() => {
            window.dispatchEvent(this.endEvent);
        }, RESIZE_DEBOUNCE);
    }

    init() {
        window.addEventListener('resize', this.onResize);
    }

    updateHeight() {
        const height = window.visualViewport ? window.visualViewport.height : window.innerHeight;
        const vh = parseFloat((height * 0.01).toFixed(6));
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }

    onResize() {
        this.updateHeight();
        this.endTrigger();
    }
}

const instance = new ViewportHeight();
instance.init();

export default instance;
