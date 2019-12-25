jQuery(($) => {
    if (!$.fn.aquilonValidator) return;

    // SPA events
    $(window).on('pushState replaceState', () => {
        // wait side effects changes
        setTimeout(() => {
        // find new validators
            $('[data-provide="aquilon-validator"]').each((index, item) => {
                const self = $(item);
                const target = $(self.data('target'));
                if (target.length) target.aquilonValidator(self.data('validator'));
                self.remove();
            });
            // find new captchas
            $('[data-provide="aquilon-kcaptcha"]').each((index, item) => {
                const self = $(item);
                const target = $(self.data('target'));
                if (target.length) target.aquilonKcaptcha(self.data('validator'));
                self.remove();
            });
        }, 0);
    });
});
