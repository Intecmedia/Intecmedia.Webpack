jQuery(($) => {
    if (!$.fn.aquilonValidator) return;

    // SPA events
    $(window).on('pushstate popstate', () => {
        // wait side effects changes
        setTimeout(() => {
        // find new validators
            $('[data-provide="aquilon-validator"]').each((index, item) => {
                const self = $(item);
                const target = $(self.data('target'));
                if (target.length > 0) target.aquilonValidator(self.data('validator'));
                self.remove();
            });
            // find new captchas
            $('[data-provide="aquilon-kcaptcha"]').each((index, item) => {
                const self = $(item);
                const target = $(self.data('target'));
                if (target.length > 0) target.aquilonKcaptcha(self.data('validator'));
                self.remove();
            });
        }, 0);
    });
});
