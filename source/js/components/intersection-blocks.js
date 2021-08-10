import AbstractComponent from '~/components/abstract';

const CLASS_NAME_BLOCK = 'js-intersection-block';
const CLASS_NAME_INIT = 'is-intersection';
const CLASS_NAME_VISIBLE = 'is-intersecting';

const INTERSECTION_EVENT = 'intersection';

const SELECTOR_BLOCKS = `.${CLASS_NAME_BLOCK}:not(.${CLASS_NAME_INIT})`;

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
        this.items = [...this.element.querySelectorAll(SELECTOR_BLOCKS)];
        setTimeout(() => this.run(), 0);
    }

    run() {
        this.items.forEach((target) => {
            target.classList.add(CLASS_NAME_INIT);
            this.observer.observe(target);
        });
        this.on('update', this.onUpdate);
    }

    onUpdate({ detail }) {
        const items = [...detail.target.querySelectorAll(SELECTOR_BLOCKS)];
        if (items.length > 0) {
            this.items = this.items.concat(items);
            items.forEach((target) => {
                target.classList.add(CLASS_NAME_INIT);
                this.observer.observe(target);
            });
        }
        return items;
    }

    onIntersection(entries) {
        entries.forEach((entry) => {
            const detail = { entry };
            const event = new CustomEvent(INTERSECTION_EVENT, { detail });
            entry.target.dispatchEvent(event);

            if (entry.target.dataset.intersectionToggle) {
                entry.target.classList.toggle(CLASS_NAME_VISIBLE, entry.isIntersecting);
            } else if (entry.isIntersecting) {
                entry.target.classList.add(CLASS_NAME_VISIBLE);
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
