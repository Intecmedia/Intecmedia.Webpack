/**
 * --------------------------------------------------------------------------
 * Viewport visible height detection
 * https://css-tricks.com/the-trick-to-viewport-units-on-mobile/
 * --------------------------------------------------------------------------
 */
import AbstractComponent from '~/components/abstract';
import { debounce } from '~/utils/tickers';

const RESIZE_DEBOUNCE = 200;

/**
 * Calc visual viewport height.
 */
class ViewportHeight extends AbstractComponent {
    static singleton = true;

    /**
     * @param {object} options - options
     */
    constructor(options = {}) {
        super(options);

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

const $html = document.documentElement;
const components = $html.hasAttribute('data-component') ? $html.getAttribute('data-component').split(/\s*,\s*/) : [];
if (!components.includes('ViewportHeight')) {
    components.push('ViewportHeight');
}
$html.setAttribute('data-component', components.join(','));

export default ViewportHeight;
