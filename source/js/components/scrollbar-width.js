/**
 * --------------------------------------------------------------------------
 * Scrollbar width detection
 * --------------------------------------------------------------------------
 */
import AbstractComponent from '~/components/abstract';
import ScrollBarHelper from 'bootstrap/js/src/util/scrollbar';

/**
 * Calc scrollbar width.
 */
class ScrollbarWidth extends AbstractComponent {
    static singleton = true;

    /**
     * @param {object} options - options
     */
    constructor(options = {}) {
        super(options);

        this.onResize = this.onResize.bind(this);
    }

    /**
     * Init events.
     */
    init() {
        this.helper = new ScrollBarHelper();

        window.addEventListener('resize', this.onResize);

        this.observer = new ResizeObserver(this.onResize);
        this.observer.observe(document.documentElement);

        this.updateWidth();
    }

    /**
     * Remove events.
     */
    destroy() {
        this.observer?.disconnect();
        this.observer = null;

        window.removeEventListener('resize', this.onResize);
    }

    /**
     * Resize-event handler.
     */
    onResize() {
        this.updateWidth();
    }

    /**
     * Update width.
     */
    updateWidth() {
        var scrollbarWidth = this.helper.getWidth().toFixed(4);
        document.documentElement.style.setProperty('--scrollbar-width', `${scrollbarWidth}px`);
    }
}

const $html = document.documentElement;
const components = $html.hasAttribute('data-component') ? $html.getAttribute('data-component').split(/\s*,\s*/) : [];
if (!components.includes('ScrollbarWidth')) {
    components.push('ScrollbarWidth');
}
$html.setAttribute('data-component', components.join(','));

export default ScrollbarWidth;
