import BootstrapPopover from 'bootstrap/js/dist/popover';

const CUSTOM_TEMPLATE = [
    '<div class="popover popover-custom" role="tooltip">',
    '<div class="popover-arrow popover-custom__arrow"></div>',
    '<h3 class="popover-header popover-custom__header"></h3>',
    '<div class="popover-body popover-custom__body"></div>',
    '</div>',
].join('');

const initPopovers = (container) => {
    const items = [...container.querySelectorAll(':not(.is-popover-init)[data-bs-toggle="popover"]')];
    items.forEach((item) => {
        item.classList.add('is-popover-init');
        const instance = BootstrapPopover.getOrCreateInstance(item);
        instance._config.template = CUSTOM_TEMPLATE;
    });
};

const destroyPopovers = (container) => {
    const items = [...container.querySelectorAll('.is-popover-init[data-bs-toggle="popover"]')];
    items.forEach((item) => {
        item.classList.remove('is-popover-init');
        const instance = BootstrapPopover.getInstance(item);
        instance?.dispose();
    });
};

window.addEventListener('init.App', (event) => {
    const container = event.detail.target;
    initPopovers(container);
});

window.addEventListener('update.App', (event) => {
    const container = event.detail.target;
    initPopovers(container);
});

window.addEventListener('destroy.App', (event) => {
    const container = event.detail.target;
    destroyPopovers(container);
});
