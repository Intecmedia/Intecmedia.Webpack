/**
 * --------------------------------------------------------------------------
 * Scrollbar width detection
 * --------------------------------------------------------------------------
 */
import AbstractComponent from '~/components/abstract';

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
        this.scrollbarOuter = document.createElement('div');
        this.scrollbarOuter.className = 'scrollbar-width';
        this.scrollbarOuter.style = 'z-index: -9999; position: absolute; visibility: hidden; width: 100px; margin-left: -100px; overflow: scroll;';
        document.documentElement.appendChild(this.scrollbarOuter);
        this.scrollbarInner = document.createElement('div');
        this.scrollbarInner.style = 'width: 100%;';
        this.scrollbarOuter.appendChild(this.scrollbarInner);

        window.addEventListener('resize', this.onResize);

        this.updateWidth();
    }

    /**
     * Remove events.
     */
    destroy() {
        window.removeEventListener('resize', this.onResize);

        this.scrollbarOuter.remove();
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
        this.width = 100 - this.scrollbarInner.offsetWidth;
        if (this.widthLast !== this.width) {
            document.documentElement.style.setProperty('--scrollbar-width', `${this.width}px`);
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
