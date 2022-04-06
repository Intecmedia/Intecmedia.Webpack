import AbstractComponent from '~/components/abstract';

const CLASS_NAME_BLOCK = 'js-intersection-block';
const CLASS_NAME_INIT = 'is-intersection';
const CLASS_NAME_VISIBLE = 'is-intersecting';

const EVENT_NAME_INTERSECTION = 'intersection';

const SELECTOR_BLOCKS_NEW = `.${CLASS_NAME_BLOCK}:not(.${CLASS_NAME_INIT})`;
const SELECTOR_BLOCKS_OLD = `.${CLASS_NAME_BLOCK}`;

class IntersectionBlocks extends AbstractComponent {
    constructor(options = {}) {
        super(options);

        this.items = [];
        this.observer = null;

        this.onIntersection = this.onIntersection.bind(this);
        this.onUpdate = this.onUpdate.bind(this);
        this.onDestroy = this.onDestroy.bind(this);
    }

    init() {
        this.observer = new IntersectionObserver(this.onIntersection);
        this.items = [...this.element.querySelectorAll(SELECTOR_BLOCKS_NEW)];
        setTimeout(() => this.run(), 0);
    }

    run() {
        this.items.forEach((target) => {
            target.classList.add(CLASS_NAME_INIT);
            this.observer.observe(target);
        });
        this.on('update', this.onUpdate);
        this.on('destroy', this.onDestroy);
    }

    onUpdate({ detail }) {
        const items = [...detail.target.querySelectorAll(SELECTOR_BLOCKS_NEW)];
        if (items.length > 0) {
            this.items = this.items.concat(items);
            items.forEach((target) => {
                target.classList.add(CLASS_NAME_INIT);
                this.observer.observe(target);
            });
        }
    }

    onDestroy({ detail }) {
        if (this.items.length > 0) {
            const items = [...detail.target.querySelectorAll(SELECTOR_BLOCKS_OLD)];
            this.items = this.items.filter((target) => {
                if (items.includes(target)) {
                    this.observer.unobserve(target);
                    return false;
                }
                return true;
            });
        }
    }

    onIntersection(entries) {
        entries.forEach((entry) => {
            const detail = { entry };
            const event = new CustomEvent(EVENT_NAME_INTERSECTION, { detail });
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
        this.off('update', this.onUpdate);
        this.off('destroy', this.onDestroy);
        this.observer?.disconnect();
        this.observer = null;
        this.items = [];
    }
}

export default IntersectionBlocks;
