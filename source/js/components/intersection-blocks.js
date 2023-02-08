/* global VERBOSE */
import AbstractComponent from '~/components/abstract';

const CLASS_NAME_BLOCK = 'js-intersection-block';
const CLASS_NAME_INIT = 'is-intersection';
const CLASS_NAME_VISIBLE = 'is-intersecting';
const CLASS_NAME_UPWARD = 'is-intersection-upward';
const CLASS_NAME_DOWNWARD = 'is-intersection-downward';
const CLASS_NAME_END = 'is-intersection-end';

const EVENT_NAME_INTERSECTION = 'intersection';

const SELECTOR_BLOCKS_NEW = `.${CLASS_NAME_BLOCK}:not(.${CLASS_NAME_INIT})`;
const SELECTOR_BLOCKS_OLD = `.${CLASS_NAME_BLOCK}`;

class IntersectionBlocks extends AbstractComponent {
    static singleton = true;

    constructor(options = {}) {
        super(options);

        this.items = [];
        this.observer = null;

        this.onIntersection = this.onIntersection.bind(this);
        this.onUpdate = this.onUpdate.bind(this);
        this.onDestroy = this.onDestroy.bind(this);
        this.onTransitionEnd = this.onTransitionEnd.bind(this);
    }

    init() {
        this.observer = new IntersectionObserver(this.onIntersection, {
            rootMargin: '0px 0px 0px 0px',
            threshold: [0.0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0],
        });
        this.items = [...this.element.querySelectorAll(SELECTOR_BLOCKS_NEW)];
        setTimeout(() => this.run(), 0);
    }

    run() {
        this.items.forEach((target) => {
            target.classList.add(CLASS_NAME_INIT);
            target.addEventListener('transitionend', this.onTransitionEnd);
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

    onIntersection(entries, observer) {
        entries.forEach((entry) => {
            const intersectionRatio =
                'intersectionRatio' in entry.target.dataset &&
                (parseInt(entry.target.dataset.intersectionRatio, 10) || 0);

            const isUpward = entry.boundingClientRect?.y < entry.rootBounds?.y;
            const isDownward = !isUpward;
            entry.target.setAttribute('data-intersection-is-upward', isUpward + 0);
            entry.target.setAttribute('data-intersection-is-downward', isDownward + 0);

            const isVisible = intersectionRatio ? entry.intersectionRatio >= intersectionRatio : entry.isIntersecting;
            const isVisibleAttr = isVisible ? '1' : '0';
            if (entry.target.getAttribute('data-intersection-is-visible') === isVisibleAttr) {
                return;
            }
            entry.target.setAttribute('data-intersection-is-visible', isVisibleAttr);
            entry.extra = { isVisible, isUpward, isDownward };

            const detail = { entry };
            const event = new CustomEvent(EVENT_NAME_INTERSECTION, { detail });
            entry.target.dispatchEvent(event);
            if (VERBOSE) {
                console.log(`[intersection-blocks] ${EVENT_NAME_INTERSECTION}`, entry.extra, entry);
            }
            entry.target.classList.toggle(CLASS_NAME_UPWARD, isUpward);
            entry.target.classList.toggle(CLASS_NAME_DOWNWARD, isDownward);

            const intersectionToggle =
                'intersectionToggle' in entry.target.dataset && !!parseInt(entry.target.dataset.intersectionToggle, 10);

            if (intersectionToggle) {
                entry.target.classList.toggle(CLASS_NAME_VISIBLE, isVisible);
            } else if (isVisible) {
                entry.target.classList.add(CLASS_NAME_VISIBLE);
                observer.unobserve(entry.target);
            }
        });
    }

    onTransitionEnd(event) {
        event.currentTarget.classList.add(CLASS_NAME_END);
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
