const requireAll = (modules) => modules.keys().map(modules);

requireAll(require.context('../img/?resize=&format=webp', true, /\.(png|jpg|jpeg)$/));
requireAll(require.context('../upload/?resize=&format=webp', true, /\.(png|jpg|jpeg)$/));

requireAll(require.context('../img/?resize=&format=avif', true, /\.(png|jpg|jpeg)$/));
requireAll(require.context('../upload/?resize=&format=avif', true, /\.(png|jpg|jpeg)$/));
