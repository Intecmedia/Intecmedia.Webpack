# Intecmedia Webpack Boilerplate

Это внутренний стандарт/шаблон для верстки сайтов компании [Intecmedia](http://intecmedia.ru)

## Цель шаблона: минимальные натройки -- максимальная автоматизация процесса сборки и защита от ошибок.

Предложения и замечания приветствуются в разделе [Issues](https://github.com/Intecmedia/Intecmedia.Webpack/issues/new) или [Pull requests](https://github.com/intecmedia/Intecmedia.Webpack/pulls).

## Особености:
* Webpack 3
* jQuery 3
* SASS через libsass
* Bootstrap Sass v3
* Font Awesome Sass
* Babel es2015 preset и babel-polyfill
* PostCSS плагины: [postcss-input-style](https://github.com/seaneking/postcss-input-style), [postcss-quantity-queries](https://github.com/pascalduez/postcss-quantity-queries), [postcss-responsive-type](https://github.com/seaneking/postcss-responsive-type), [pixrem](https://github.com/robwierzbowski/node-pixrem), [pleeease-filters](https://github.com/iamvdo/pleeease-filters), [postcss-image-set-polyfill](https://github.com/SuperOl3g/postcss-image-set-polyfill), [postcss-color-rgba-fallback](https://github.com/postcss/postcss-color-rgba-fallback), [css-mqpacker](https://github.com/hail2u/node-css-mqpacker), [autoprefixer](https://github.com/postcss/autoprefixer), [cssnano](http://cssnano.co/)
* Базовая WYSIWYG-типографика текста, форм, таблиц, списков, заголовков: [wysiwyg.scss](https://github.com/Intecmedia/Intecmedia.Webpack/blob/master/source/css/_wysiwyg.scss)
* Responsive images polyfill через [Picturefill](http://scottjehl.github.io/picturefill)
* Множество линтеров: eslint, htmllint, stylelint с возможностью autofix кода
* Модульный Modernizr через [.modernizrrc](https://github.com/Intecmedia/Intecmedia.Webpack/blob/master/.modernizrrc)
* Imagemin для сжатия гарфики: svg, png, jpeg, gif
* Автоматический base64-url ресурсов
* Handlebars для сборки HTML

## Обзор комманд:
* **npm run dev** -- сборка в development-режиме и debug=off, самый быстрый способ
* **npm run debug** -- сборка в development-режиме и debug=on, медленный способ
* **npm run prod** -- сборка в production-режиме и debug=off, самый медленный способ
* **npm run watch** -- watch в production-режимеи debug=off, самый медленный способ
* **npm run watch-dev** -- watch в development-режиме и debug=off, самый быстрый способ
* **npm run watch-debug** -- watch в development-режиме и debug=on, медленный способ
* **npm run watch-prod** -- watch в production-режиме и debug=off, самый медленный способ
* **npm run js-lint** -- линтер js, часть проблем autofix
* **npm run css-lint** -- линтер css, часть проблем autofix
* **npm run css-format** -- форматер css, используется в паре с **npm run css-lint**
* **npm run html-lint** -- линтер html
* **npm run lint** -- запуск всех линтеров
* **npm run nocache** -- очистка кеша ./node_modules/.cache/, иногда нужно для imagemin.
* **npm run server** -- сервер в production-режиме и debug=off, самый медленный способ
* **npm run server-dev** -- сервер в development-режиме и debug=off, самый быстрый способ
* **npm run server-debug** -- сервер в development-режиме и debug=on, медленный способ
* **npm run server-prod** -- сервер в production-режиме и debug=off, самый медленный способ
* **npm run build** -- релизный билд, запускается в production-режиме и debug=off, включая все линтеры, очень медленный способ

## Стилистика кода
* Мы использум БЭМ, исключая сторонние пакеты.
* Подробно писать про оформление кода нет смысла -- сборка покрыта линтерами.

### Schema.org для следующего:
* [Адреса и Организации](http://help.yandex.ru/webmaster/supported-schemas/address-organization.xml)
* [Видео](http://help.yandex.ru/webmaster/supported-schemas/video.xml)
* [Вопросы и Ответы](http://help.yandex.ru/webmaster/supported-schemas/questions.xml)
* [Товары и Цены](http://help.yandex.ru/webmaster/supported-schemas/goods-prices.xml)
* [Картинки](http://help.yandex.ru/webmaster/supported-schemas/image.xml)



