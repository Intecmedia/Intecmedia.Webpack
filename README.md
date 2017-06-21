# Intecmedia Webpack Boilerplate

Это внутренний стандарт/шаблон для верстки сайтов компании [Intecmedia](http://intecmedia.ru)

## Цель шаблона: минимальные натройки -- максимальная автоматизация процесса сборки.

Предложения и замечания приветствуются в разделе [Issues](https://github.com/Intecmedia/Intecmedia.Webpack/issues/new) или [Pull requests](https://github.com/intecmedia/Intecmedia.Webpack/pulls).

## Особености:
* Webpack 3
* jQuery 3
* SASS через libsass
* Bootstrap Sass v3
* Font Awesome Sass
* Babel es2015 preset и babel-polyfill
* PostCSS плагины: [postcss-cssnext](http://cssnext.io/), [css-mqpacker](https://github.com/hail2u/node-css-mqpacker), [autoprefixer](https://github.com/postcss/autoprefixer), [cssnano](http://cssnano.co/)
* Базовая WYSIWYG-типографика текста, форм, таблиц, списков, заголовков: [wysiwyg.scss](https://github.com/Intecmedia/Intecmedia.Webpack/blob/master/source/css/_wysiwyg.scss)
* Responsive images polyfill через [Picturefill](http://scottjehl.github.io/picturefill)
* Множество линтеров: eslint, htmllint, stylelint с возможностью autofix кода
* Модульный Modernizr модульный через [.modernizrrc](https://github.com/Intecmedia/Intecmedia.Webpack/blob/master/.modernizrrc)
* Imagemin для сжатия гарфики: svg, png, jpeg, gif
* Автоматический base64-url ресурсов
* Handlebars Для сборки HTML

## Обзор некоторых комманд:
* npm run dev
* npm run debug
* npm run prod
* npm run watch
* npm run watch-dev
* npm run watch-debug
* npm run watch-prod
* npm run js-lint
* npm run css-lint
* npm run css-format
* npm run html-lint
* npm run lint
* npm run nocache
* npm run server
* npm run server-dev
* npm run server-debug
* npm run server-prod
* npm run build

## Стилистика кода
* Мы использум БЭМ, исключая сторонние пакеты.
* Подробно писать про стиля кода нет смысла. Сборка покрыта линтерами.

### Schema.org для следующего:
* [Адреса и Организации](http://help.yandex.ru/webmaster/supported-schemas/address-organization.xml)
* [Видео](http://help.yandex.ru/webmaster/supported-schemas/video.xml)
* [Вопросы и Ответы](http://help.yandex.ru/webmaster/supported-schemas/questions.xml)
* [Товары и Цены](http://help.yandex.ru/webmaster/supported-schemas/goods-prices.xml)
* [Картинки](http://help.yandex.ru/webmaster/supported-schemas/image.xml)



