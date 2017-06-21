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
