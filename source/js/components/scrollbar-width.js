import ScrollBarHelper from 'bootstrap/js/dist/util/scrollbar';

class ScrollbarWidth {
    constructor() {
        this.onResize = this.onResize.bind(this);
        this.onUpdate = this.onUpdate.bind(this);
    }

    init() {
        this.helper = new ScrollBarHelper();

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
        this.width = this.helper.getWidth();
        if (this.widthLast !== this.width) {
            document.documentElement.style.setProperty('--scrollbar-width', `${parseFloat(this.width.toFixed(6))}px`);
            this.widthLast = this.width;
        }
    }
}

const instance = new ScrollbarWidth();
instance.init();

export default instance;
