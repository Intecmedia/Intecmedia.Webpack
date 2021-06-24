/* global NODE_ENV DEBUG VERBOSE */

// import '~/components/aquilon-validator';
import '~/components/bootstrap';
import '~/components/viewport-height';
import '~/components/network-information';
import '~/components/scrollbar-width';

class App {
   constructor() {
       this.store = {};
   }

   init() {
       document.documentElemnt.classList.add('ready-js');
   }
}

const app = new App();
if (VERBOSE) {
    window.$app = app;
    console.log('[app]', app);
}

jQuery(($) => {
    console.log(`NODE_ENV=${NODE_ENV}; DEBUG=${DEBUG}; jQuery=${$.fn.jquery};`);
    app.init();
});

export default app;