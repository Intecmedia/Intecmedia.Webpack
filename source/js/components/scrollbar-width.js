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
        this.onUpdate = this.onUpdate.bind(this);
    }

    /**
     * Init events.
     */
    init() {
        this.helper = new ScrollBarHelper();

        window.addEventListener('resize', this.onResize);
        window.addEventListener('pushstate', this.onUpdate);
        window.addEventListener('popstate', this.onUpdate);

        this.updateWidth();
    }

    /**
     * Remove events.
     */
    destroy() {
        window.removeEventListener('resize', this.onResize);
        window.removeEventListener('pushstate', this.onUpdate);
        window.removeEventListener('popstate', this.onUpdate);
    }

    /**
     * Resize-event handler.
     */
    onResize() {
        this.updateWidth();
    }

    /**
     * Update-event handler.
     */
    onUpdate() {
        this.updateWidth();
    }

    /**
     * Update width.
     */
    updateWidth() {
        this.width = this.helper.getWidth();
        if (this.widthLast !== this.width) {
            document.documentElement.style.setProperty('--scrollbar-width', `${parseFloat(this.width.toFixed(6))}px`);
            this.widthLast = this.width;
        }
    }
}

const $html = document.documentElement;
const components = $html.hasAttribute('data-component') ? $html.getAttribute('data-component').split(/\s*,\s*/) : [];
if (!components.includes('ScrollbarWidth')) {
    components.push('ScrollbarWidth');
}
$html.setAttribute('data-component', components.join(','));

export default ScrollbarWidth;
