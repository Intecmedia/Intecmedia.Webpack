const CLASS_NAME_OUTER = 'scrollbar-width';
const CLASS_NAME_INNER = 'scrollbar-width__inner';

const CONTAINER_WIDTH = 100;

class ScrollbarWidth {
    constructor() {
        this.onResize = this.onResize.bind(this);
        this.onUpdate = this.onUpdate.bind(this);
    }

    init() {
        this.domOuter = document.createElement('div');
        this.domOuter.className = CLASS_NAME_OUTER;
        this.domOuter.style.zIndex = '-9999';
        this.domOuter.style.position = 'absolute';
        this.domOuter.style.visibility = 'hidden';
        this.domOuter.style.width = `${CONTAINER_WIDTH}px`;
        this.domOuter.style.marginLeft = `-${CONTAINER_WIDTH}px`;
        this.domOuter.style.overflow = 'scroll';
        document.body.appendChild(this.domOuter);

        this.domInner = document.createElement('div');
        this.domInner.className = CLASS_NAME_INNER;
        this.domInner.style.width = '100%';
        this.domOuter.appendChild(this.domInner);

        window.addEventListener('resize', this.onResize);
        window.addEventListener('pushstate', this.onUpdate);
        window.addEventListener('popstate', this.onUpdate);

        this.updateWidth();
    }

    onResize() {
        this.updateWidth();
    }

    onUpdate() {
        this.updateWidth();
    }

    updateWidth() {
        this.width = CONTAINER_WIDTH - this.domInner.offsetWidth;
        if (this.widthLast !== this.width) {
            document.documentElement.style.setProperty('--scrollbar-width', `${this.width}px`);
            this.widthLast = this.width;
        }
    }
}

const instance = new ScrollbarWidth();
instance.init();

export default instance;
