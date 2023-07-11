# Intecmedia Webpack Boilerplate

Это внутренний стандарт/шаблон для верстки сайтов компании [Intecmedia](http://intecmedia.ru)

## Цель шаблона: минимальные натройки – максимальная автоматизация процесса сборки и защита от ошибок.

Предложения и замечания приветствуются в разделе [Issues](https://github.com/Intecmedia/Intecmedia.Webpack/issues/new)
или [Pull requests](https://github.com/intecmedia/Intecmedia.Webpack/pulls).

## Особености

-   Webpack 5.
-   Bootstrap 5.
-   Babel и [babel-preset-env](https://babeljs.io/docs/en/babel-preset-env).
-   TypeScript через [babel-preset-typescript](https://babeljs.io/docs/en/babel-preset-typescript)
-   Линтер с автофиксом [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript) ([перевод](https://github.com/leonidlebedev/javascript-airbnb)).
-   Шаблонизатор [Nunjucks](https://mozilla.github.io/nunjucks/) для сборки HTML.
-   SCSS, autoprefixer, PostCSS: [autoprefixer](https://github.com/postcss/autoprefixer),
    [cssnano](http://cssnano.co/).
-   Базовая WYSIWYG-типографика текста, форм, таблиц, списков, заголовков:
    [wysiwyg.scss](https://github.com/Intecmedia/Intecmedia.Webpack/blob/master/source/css/base/_wysiwyg.scss).
-   Ресайз изображений через [Sharp](https://sharp.pixelplumbing.com/).
-   Множество линтеров: eslint, html-validate, stylelint с возможностью autofix кода.
-   Imagemin для сжатия гарфики: svg, png, jpeg, gif.
-   Генерация множества app-иконок и manifest.json.
-   Активное использование формат изображений WebP.

## Системные требования

-   `Node.js` >= 18 c включеным [`Chocolatey`](https://user-images.githubusercontent.com/3109072/68096791-82350c00-fe89-11e9-8cfa-b4619ce96162.jpg)
-   `NPM` >= 9 (обновляется командой `npm install -g npm`)
-   `python` >= 2.7 и `pip` (автоматически ставятся вместе с `Chocolatey`)
-   Если у вас `Windows` – установите любой `bash`: `Git Bash` или `MinGW` или `Cygwin`
-   ВНИМАНИЕ! `Yarn` и `PnPM`  – запрещен, все скрипты расчитаны только на `NPM`.

## Начало работы

-   Отредактируйте файл `app.config.js`, разделы `TITLE`, `SHORT_NAME` и `DESCRIPTION`.
-   Отредактируйте файл `package.json`, разделы `name`.
-   Запустите линтер конфигурации приложения: `npm run app-lint`.

## Обзор комманд

-   **npm run development** – сборка в development-режиме и debug=off, самый быстрый способ.
-   **npm run debug** – сборка в development-режиме и debug=on, медленный способ.
-   **npm run prod** – сборка в production-режиме (с линтерами) и debug=off, самый медленный способ.
-   **npm run prod-debug** – сборка в production-режиме (с линтерами) и debug=on, самый медленный способ.
-   **npm run production** – сборка в production-режиме (без линтеров) и debug=off, самый медленный способ.
-   **npm run watch** – watch в production-режимеи debug=off, самый медленный способ.
-   **npm run watch-dev** – watch в development-режиме и debug=off, самый быстрый способ.
-   **npm run watch-debug** – watch в development-режиме и debug=on, медленный способ.
-   **npm run js-lint** – линтер js через [eslint](https://eslint.org/).
-   **npm run js-lint-config** – печатает конфиг(для browser) [eslint](https://eslint.org/).
-   **npm run js-lint-config-node** – печатает конфиг(для node) [eslint](https://eslint.org/).
-   **npm run css-lint** – линтер scss через [stylelint](https://stylelint.io/).
-   **npm run css-lint-config** – печатает конфиг [stylelint](https://stylelint.io/).
-   **npm run html-validate** – линтер html(prod) через [html-validate](https://html-validate.org/).
-   **npm run html-validate-dev** – линтер html (dev) через [html-validate](https://html-validate.org/).
-   **npm run html-validator** – линтер html через [validator.w3.org](https://validator.w3.org/).
-   **npm run html-beautify** – форматер html через [https://beautifier.io](https://beautifier.io/).
-   **npm run html-typograf** – форматер html через [https://typograf.github.io/](https://typograf.github.io/).
-   **npm run app-lint** – линтер конфигурации приложения.
-   **npm run image-lint** – линтер изображений
-   **npm run lint** – запуск всех линтеров (app, eslint, stylelint, html-validate, validator.w3.org).
-   **npm run server** – сервер в production-режиме и debug=off, самый медленный способ.
-   **npm run server-https** – https-сервер в production-режиме и debug=off, самый медленный способ.
-   **npm run server-dev** – сервер в development-режиме и debug=off, самый быстрый способ.
-   **npm run server-debug** – сервер в development-режиме и debug=on, медленный способ.
-   **npm run server-debug-https** – https-сервер в development-режиме и debug=on, медленный способ.
-   **npm run build** – релизный билд, запускается в production-режиме и debug=off, включая все линтеры, очень медленный способ.
-   **npm run browserslist-dev** – список поддерживаемых браузеров для NODE_ENV=development.
-   **npm run browserslist-prod** – список поддерживаемых браузеров для NODE_ENV=production.
-   **npm run browserslist** – список поддерживаемых браузеров.
-   **npm run fonts-subsets** – запуск fonts subseting.
-   **npm run svgo** – минимизая svg-файлов.
-   **npm run filename-lint** – линтер имён файлов.
-   **npm run production -- --env=verbose** – verbose режим
-   **npm run lint-staged** – запуск lint-staged
-   **npm run prepare** – установка git-хуков

### Часто используемые команды

-   **npm run js-lint** – линтер js через [eslint](https://eslint.org/).
-   **npm run css-lint** – линтер scss через [stylelint](https://stylelint.io/).
-   **npm run watch-dev** – watch в development-режиме и debug=off, самый быстрый способ.
-   **npm run server** – сервер в development-режиме и debug=off, самый быстрый способ.
-   **npm run server-https** – https-сервер в development-режиме и debug=off, самый быстрый способ.
-   **npm run build** – релизный билд, запускается в production-режиме и debug=off, включая все линтеры, очень медленный способ.

## Стилистика кода

-   JS основна на [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript) ([перевод](https://github.com/leonidlebedev/javascript-airbnb)).
-   CSS использум БЭМ, как метод именования селекторов (исключение – сторонние css-пакеты) ([список рекомендаций по БЭМ](https://nicothin.pro/idiomatic-pre-CSS/)).
-   SCSS основна на [stylelint-config-sass-guidelines](https://sass-guidelin.es/ru/).
-   HTML проверяется через [html-validate](https://html-validate.org/) и [validator.w3.org](https://validator.w3.org/).
-   Подробно писать про оформление кода нет смысла – сборка покрыта линтерами.

### Структура важных блоков (Schema.org)

-   [Адреса и Организации](http://help.yandex.ru/webmaster/supported-schemas/address-organization.xml)
-   [Вопросы и Ответы](http://help.yandex.ru/webmaster/supported-schemas/questions.xml)
-   [Товары и Цены](http://help.yandex.ru/webmaster/supported-schemas/goods-prices.xml)
-   [Картинки](http://help.yandex.ru/webmaster/supported-schemas/image.xml)

## Полифилы

-   [fetch](https://github.com/github/fetch#readme)
-   [focus-visible](https://github.com/WICG/focus-visible)
-   [focus-within](https://github.com/jonathantneal/focus-within)
-   [intersection-observer](https://github.com/w3c/IntersectionObserver#readme)
-   [resize-observer-polyfill](https://github.com/que-etc/resize-observer-polyfill)

## Типографика

### Responstive type

1. [старыей способ через @media](https://github.com/Intecmedia/Intecmedia.Webpack/wiki/%D0%A0%D0%B5%D1%81%D0%BF%D0%BE%D0%BD%D0%B7%D0%B8%D0%B2-%D1%82%D0%B8%D0%BF%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%BA%D0%B0#%D0%A1%D0%BF%D0%BE%D1%81%D0%BE%D0%B1-%D1%87%D0%B5%D1%80%D0%B5%D0%B7-media-%D0%BE%D1%80%D0%B8%D0%B3%D0%B8%D0%BD%D0%B0%D0%BB-%D0%BD%D0%B0-css-trickscom)
2. [предпочтительный способ через clamp](https://github.com/Intecmedia/Intecmedia.Webpack/wiki/%D0%A0%D0%B5%D1%81%D0%BF%D0%BE%D0%BD%D0%B7%D0%B8%D0%B2-%D1%82%D0%B8%D0%BF%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%BA%D0%B0#%D0%A1%D0%BF%D0%BE%D1%81%D0%BE%D0%B1-%D1%87%D0%B5%D1%80%D0%B5%D0%B7-clamp-%D0%BE%D1%80%D0%B8%D0%B3%D0%B8%D0%BD%D0%B0%D0%BB-%D0%BD%D0%B0-css-trickscom)

### WYSIWYG

Блоки **user generated content** (теги типографики **без классов и стилей**),
должны быть обвернуты в css-класс [wysiwyg](https://github.com/Intecmedia/Intecmedia.Webpack/blob/master/source/css/pages/_wysiwyg.scss), пример:

-   текст новости/статьи/описание товара, исключая оформление этих блоков.
-   блоки созданые CMS и [WYSIWYG-редактороми](https://ru.wikipedia.org/wiki/CKeditor).

### Оптимизация шрифтов

-   Мы используем только 3 формата: `ttf`, `woff`, `woff2`. Устаревшими считаются: `eot` и `svg`.
-   Мы используем [fonttools](https://github.com/fonttools/fonttools).
-   Для fonttools требуется python в системе: `pip install fonttools` и возможно `pip install brotli`.
-   Исходники шрифтов только формате `ttf`, должны лежать в директории `source/fonts/src-ttf`.
-   `npm run fonts-subsets` – запуск fonts subseting.
-   Автоматически добавляется `font-display: swap;` плагин [`postcss-font-display`](https://github.com/dkrnl/postcss-font-display).

## Изображения

### Imagemin

-   Конфиг imagemin находится `imagemin.config.js`.
-   Конфиг SVGO находится `svgo.config.js`.

### Webp

-   Автоматический WebP для всех изображений(png, jpg, jpeg) внутри стилей, пример:

```css
/* before */
.test {
    background-image: url("test.png");
}
/* after */
.test {
    background-image: url("test.png");
}
html.webp .test {
    background-image: url("test.webp");
}
```

### Avif

-   Автоматический Avif для всех изображений(png, jpg, jpeg) внутри стилей, пример:

```css
/* before */
.test {
    background-image: url("test.png");
}
/* after */
.test {
    background-image: url("test.png");
}
html.avif .test {
    background-image: url("test.avif");
}
```

### Favicons и App Icons

-   Мы используем [favicons-webpack-plugin](https://github.com/jantimon/favicons-webpack-plugin).
-   Файл `.favicons-source-64x64.png` исходник favicons.
-   Файл `.favicons-source-1024x1024.png` исходник app icons.
-   `THEME_COLOR` редактируется в `app.config.js`.
-   `BACKGROUND_COLOR` редактируется в `app.config.js`.
-   Метатеги добавлются автоматически в <head>.
-   manifest.json и browserconfig.xml создаются автоматически на основе `app.config.js`.
-   Иконки герерируются автоматически: смотрите директорию `build/img/favicon`.

# Bootstrap

-   Переопредление переременных в `css/base/_variables.scss`.
-   Переопредление миксинов в `css/base/_bootstrap-mixins.scss`.
-   Типографика в `css/base/_bootstrap-type.scss`.

# HTML

-   файл с `/example1.html` будут доступны по ссылке `/example1/index.html`.
-   файл с `/example2/index.html` будут доступны по ссылке `/example2/index.html`.
-   файл с `/_ajax-example.html` будут доступны по ссылке `/_ajax-example.html`.
-   `head` теги не будут добавлены для файлов с `_` в начале имени.
