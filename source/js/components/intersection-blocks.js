import AbstractComponent from '~/components/abstract';

class IntersectionBlocks extends AbstractComponent {
    constructor(options = {}) {
        super(options);

        this.items = [];
        this.observer = null;

        this.onIntersection = this.onIntersection.bind(this);
        this.onUpdate = this.onUpdate.bind(this);
    }

    init() {
        this.observer = new IntersectionObserver(this.onIntersection);
        this.items = [...this.element.querySelectorAll('.js-intersection-block:not(.js-intersection-block--init)')];
        setTimeout(() => this.run(), 0);
    }

    run() {
        this.items.forEach((target) => {
            target.classList.add('js-intersection-block--init');
            this.observer.observe(target);
        });
        this.on('update', this.onUpdate);
    }

    onUpdate({ detail }) {
        const items = [...detail.target.querySelectorAll('.js-intersection-block:not(.js-intersection-block--init)')];
        if (items.length > 0) {
            this.items = this.items.concat(items);
            items.forEach((target) => {
                target.classList.add('js-intersection-block--init');
                this.observer.observe(target);
            });
        }
        return items;
    }

    onIntersection(entries) {
        entries.forEach((entry) => {
            if (entry.target.dataset.intersectionToggle) {
                entry.target.classList.toggle('is-intersecting', entry.isIntersecting);
            } else if (entry.isIntersecting) {
                entry.target.classList.add('is-intersecting');
                this.observer.unobserve(entry.target);
            }
        });
    }

    destroy() {
        if (this.observer) this.observer.disconnect();
        this.observer = null;
        this.items = [];
    }
}

export default IntersectionBlocks;
