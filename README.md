# Intecmedia Webpack Boilerplate

Это внутренний стандарт/шаблон для верстки сайтов компании [Intecmedia](http://intecmedia.ru)

## Цель шаблона: минимальные натройки – максимальная автоматизация процесса сборки и защита от ошибок.

Предложения и замечания приветствуются в разделе [Issues](https://github.com/Intecmedia/Intecmedia.Webpack/issues/new)
или [Pull requests](https://github.com/intecmedia/Intecmedia.Webpack/pulls).

## Особености
* Webpack 4.
* Bootstrap 4.
* Progressive Web Apps: offline кеширование статики через [Service Worker-ы](https://github.com/GoogleChrome/workbox).
* Babel и [babel-preset-airbnb](https://www.npmjs.com/package/babel-preset-airbnb).
* Линтер с автофиксом [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript) ([перевод](https://github.com/leonidlebedev/javascript-airbnb)).
* Шаблонизатор [Nunjucks](https://mozilla.github.io/nunjucks/) для сборки HTML.
* SCSS, autoprefixer, PostCSS: [postcss-input-style](https://github.com/seaneking/postcss-input-style),
[postcss-quantity-queries](https://github.com/pascalduez/postcss-quantity-queries), 
[postcss-responsive-type](https://github.com/seaneking/postcss-responsive-type), 
[pixrem](https://github.com/robwierzbowski/node-pixrem), 
[pleeease-filters](https://github.com/iamvdo/pleeease-filters), 
[postcss-image-set-polyfill](https://github.com/SuperOl3g/postcss-image-set-polyfill), 
[postcss-color-rgba-fallback](https://github.com/postcss/postcss-color-rgba-fallback), 
[css-mqpacker](https://github.com/hail2u/node-css-mqpacker), 
[autoprefixer](https://github.com/postcss/autoprefixer), 
[cssnano](http://cssnano.co/).
* Базовая WYSIWYG-типографика текста, форм, таблиц, списков, заголовков: 
[wysiwyg.scss](https://github.com/Intecmedia/Intecmedia.Webpack/blob/master/source/css/pages/_wysiwyg.scss).
* Ресайз изображений через [ImageMagick](https://www.imagemagick.org/) / [GraphicsMagick](http://www.graphicsmagick.org/).
* Responsive images polyfill через [Picturefill](http://scottjehl.github.io/picturefill).
* Множество линтеров: eslint, htmllint, stylelint с возможностью autofix кода.
* Imagemin для сжатия гарфики: svg, png, jpeg, gif.
* Генерация множества app-иконок и manifest.json.
* Активное использование формат изображений WebP.

## Системные требования
* Node.js версии 8 или выше
* [ImageMagick](https://www.imagemagick.org/) или [GraphicsMagick](http://www.graphicsmagick.org/).
* python2.7 и выше, для `fonttools`.

## Начало работы
* Отредактируйте файл `app.config.js`, разделы `TITLE`, `SHORT_NAME` и `DESCRIPTION`.
* Отредактируйте файл `package.json`, разделы `name`.
* Запустите линтер конфигурации приложения: `npm run app-lint`.

## Обзор комманд
* **npm run dev** – сборка в development-режиме и debug=off, самый быстрый способ.
* **npm run debug** – сборка в development-режиме и debug=on, медленный способ.
* **npm run prod** – сборка в production-режиме и debug=off, самый медленный способ.
* **npm run watch** – watch в production-режимеи debug=off, самый медленный способ.
* **npm run watch-dev** – watch в development-режиме и debug=off, самый быстрый способ.
* **npm run watch-debug** – watch в development-режиме и debug=on, медленный способ.
* **npm run js-lint** – линтер js через [eslint](https://eslint.org/).
* **npm run js-lint-config** – печатает конфиг [eslint](https://eslint.org/).
* **npm run css-lint** – линтер scss через [stylelint](https://stylelint.io/).
* **npm run css-lint-config** – печатает конфиг [stylelint](https://stylelint.io/).
* **npm run html-lint** – линтер html через [htmllint](http://htmllint.github.io/).
* **npm run html-validator** – линтер html через [validator.w3.org](https://validator.w3.org/).
* **npm run app-lint** – линтер конфигурации приложения.
* **npm run lint** – запуск всех линтеров (app, eslint, stylelint, htmllint, validator.w3.org).
* **npm run server** – сервер в production-режиме и debug=off, самый медленный способ.
* **npm run server-dev** – сервер в development-режиме и debug=off, самый быстрый способ.
* **npm run server-debug** – сервер в development-режиме и debug=on, медленный способ.
* **npm run build** – релизный билд, запускается в production-режиме и debug=off, включая все линтеры, очень медленный способ.
* **npm run browserslist-dev** – список поддерживаемых браузеров для NODE_ENV=development.
* **npm run browserslist-prod** – список поддерживаемых браузеров для NODE_ENV=production.
* **npm run browserslist** – список поддерживаемых браузеров.
* **npm run fonts-subsets** – запуск fonts subseting.

### Часто используемые команды
* **npm run watch-dev** – watch в development-режиме и debug=off, самый быстрый способ.
* **npm run server-dev** – сервер в development-режиме и debug=off, самый быстрый способ.
* **npm run build** – релизный билд, запускается в production-режиме и debug=off, включая все линтеры, очень медленный способ.

## Стилистика кода
* JS основна на [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript) ([перевод](https://github.com/leonidlebedev/javascript-airbnb)).
* CSS использум БЭМ, как метод именования селекторов (исключение – сторонние css-пакеты) ([список рекомендаций по БЭМ](https://nicothin.pro/idiomatic-pre-CSS/)).
* SCSS основна на [stylelint-config-sass-guidelines](https://sass-guidelin.es/ru/).
* HTML проверяется через [htmllint](http://htmllint.github.io/) и [validator.w3.org](https://validator.w3.org/).
* Подробно писать про оформление кода нет смысла – сборка покрыта линтерами.

### Структура важных блоков (Schema.org)
* [Адреса и Организации](http://help.yandex.ru/webmaster/supported-schemas/address-organization.xml)
* [Вопросы и Ответы](http://help.yandex.ru/webmaster/supported-schemas/questions.xml)
* [Товары и Цены](http://help.yandex.ru/webmaster/supported-schemas/goods-prices.xml)
* [Картинки](http://help.yandex.ru/webmaster/supported-schemas/image.xml)

## Полифилы
* [fetch](https://github.com/github/fetch#readme)
* [focus-visible](https://github.com/WICG/focus-visible)
* [focus-within](https://github.com/jonathantneal/focus-within)
* [intersection-observer](https://github.com/w3c/IntersectionObserver#readme)
* [object-assign](https://github.com/sindresorhus/object-assign#readme)
* [object-fit-images](https://github.com/bfred-it/object-fit-images#readme)
* [picturefill](https://scottjehl.github.io/picturefill/)
* [promise](https://github.com/then/promise#readme)

## Типографика
### Responstive type
Для резиновой типографики мы используем [postcss-responsive-type](https://github.com/seaneking/postcss-responsive-type), пример кода:
```css 
html {
    font-size: responsive;
    min-font-size: 12px;
    max-font-size: 21px;
    lower-font-range: 420px;
    upper-font-range: 1280px;
}
```
### WYSIWYG
Блоки **user generated content** (теги типографики **без классов и стилей**),
должны быть обвернуты в css-класс [wysiwyg](https://github.com/Intecmedia/Intecmedia.Webpack/blob/master/source/css/pages/_wysiwyg.scss), пример:
* текст новости/статьи/описание товара, исключая оформление этих блоков.
* блоки созданые CMS и [WYSIWYG-редактороми](https://ru.wikipedia.org/wiki/CKeditor).

### Оптимизация шрифтов
* Мы используем только 3 формата: `ttf`, `woff`, `woff2`. Устаревшими считаются: `eot` и `svg`.
* Мы используем [fonttools](https://github.com/fonttools/fonttools).
* Для fonttools требуется python в системе: `pip install fonttools`.
* Исходники шрифтов только формате `ttf`, должны лежать в директории `source/fonts/src-ttf`.
* `npm run fonts-subsets` – запуск fonts subseting.
* Автоматически добавляется `font-display: swap;` плагин [`postcss-font-display`](https://github.com/dkrnl/postcss-font-display).

## Изображения

### Imagemin
* Конфиг imagemin находится `imagemin.config.js`.
* Конфиг SVGO находится `svgo.config.js`.

### Webp
* Автоматический WebP для всех изображений(png, jpg, jpeg) внутри CSS – [webpcss](https://github.com/lexich/webpcss), пример:
```css
// before
.test { background-image:url('test.png'); }
// after
.test { background-image:url('test.png'); }
html.webp .test { background-image:url('test.webp'); }
```

### Favicons и App Icons
* Мы используем [webapp-webpack-plugin](https://github.com/brunocodutra/webapp-webpack-plugin).
* Файл `.favicons-source-64x64.png` исходник favicons.
* Файл `.favicons-source-1024x1024.png` исходник app icons.
* `THEME_COLOR` редактируется в `app.config.js`.
* `BACKGROUND_COLOR` редактируется в `app.config.js`.
* Метатеги добавлются автоматически в <head>.
* manifest.json и browserconfig.xml создаются автоматически на основе `app.config.js`.
* Иконки герерируются автоматически: смотрите директорию `build/img/favicon`.

# Bootstrap
* Переопредление переременных в `css/base/_variables.scss`
* Переопредление миксинов в `css/base/_bootstrap-mixins.scss`
