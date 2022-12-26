import BootstrapTooltip from 'bootstrap/js/dist/tooltip';

const CUSTOM_TEMPLATE = [
    '<div class="tooltip tooltip-custom" role="tooltip">',
    '<div class="tooltip-arrow tooltip-custom__arrow"></div>',
    '<div class="tooltip-inner tooltip-custom__inner"></div>',
    '</div>',
].join('');

const initTooltips = (container) => {
    const items = [...container.querySelectorAll(':not(.is-tooltip-init)[data-bs-toggle="tooltip"]')];
    items.forEach((item) => {
        item.classList.add('is-tooltip-init');
        const instance = BootstrapTooltip.getOrCreateInstance(item);
        instance._config.template = CUSTOM_TEMPLATE;
    });
};

const destroyTooltips = (container) => {
    const items = [...container.querySelectorAll('.is-tooltip-init[data-bs-toggle="tooltip"]')];
    items.forEach((item) => {
        item.classList.remove('is-tooltip-init');
        const instance = BootstrapTooltip.getInstance(item);
        instance?.dispose();
    });
};

window.addEventListener('init.App', (event) => {
    const container = event.detail.target;
    initTooltips(container);
});

window.addEventListener('update.App', (event) => {
    const container = event.detail.target;
    initTooltips(container);
});

window.addEventListener('destroy.App', (event) => {
    const container = event.detail.target;
    destroyTooltips(container);
});
