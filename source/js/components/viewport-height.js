/**
 * --------------------------------------------------------------------------
 * Viewport visible height detection
 * https://css-tricks.com/the-trick-to-viewport-units-on-mobile/
 * --------------------------------------------------------------------------
 */

import { debounce } from '~/utils/tickers';

const RESIZE_DEBOUNCE = 200;

/**
 * Calc visual viewport height.
 */
class ViewportHeight {
    /**
     *
     */
    constructor() {
        this.onResize = this.onResize.bind(this);

        this.endEvent = new CustomEvent('resize.end');
        this.endTrigger = debounce(() => {
            window.dispatchEvent(this.endEvent);
        }, RESIZE_DEBOUNCE);
    }

    /**
     * Init events.
     */
    init() {
        window.addEventListener('resize', this.onResize);
    }

    /**
     * Remove events.
     */
    destroy() {
        window.removeEventListener('resize', this.onResize);
    }

    /**
     * Update height.
     */
    updateHeight() {
        const height = window.visualViewport ? window.visualViewport.height : window.innerHeight;
        const vh = parseFloat((height * 0.01).toFixed(6));
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }

    /**
     * Resize-event handler.
     */
    onResize() {
        this.updateHeight();
        this.endTrigger();
    }
}

const instance = new ViewportHeight();
instance.init();

export default instance;
