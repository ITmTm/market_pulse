// Получение __dirname в gulpfile.mjs
import { fileURLToPath } from 'url';
import path from 'path';                                // утилиты для работы с путями

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Подключение методов из Gulp
import gulp from "gulp";

const { src, dest, watch, parallel, series } = gulp;


// ————————————————————————————————————————————
// ПЛАГИНЫ ДЛЯ СТИЛЕЙ
// ————————————————————————————————————————————

import sassCompiler from "gulp-dart-sass";

import autoprefixer from "gulp-autoprefixer";           // проставляет вендорные префиксы для CSS
import sourcemaps from "gulp-sourcemaps";               // генерирует sourcemaps для отладки стилей
import concat from "gulp-concat";                       // объединяет несколько файлов в один


// ————————————————————————————————————————————
// ПЛАГИНЫ ДЛЯ JS
// ————————————————————————————————————————————

import uglify from 'gulp-uglify-es';

const uglifyJs = uglify.default;                        // минификация JavaScript

import plumber from "gulp-plumber";                     // предотвращает падение потока при ошибках
import gulpNotify from "gulp-notify";                   // пуш-уведомления об ошибках в процессе сборки


// ————————————————————————————————————————————
// LIVE-RELOAD И ЛОКАЛЬНЫЙ СЕРВЕР
// ————————————————————————————————————————————

import browserSyncPkg from "browser-sync";

const browserSync = browserSyncPkg.create();      // запускает локальный сервер и обновляет страницу в браузере


// ————————————————————————————————————————————
// АРХИВЫ, ФАЙЛЫ И ПАПКИ
// ————————————————————————————————————————————

import fs from "fs";                                  // работа с файловой системой (проверка существования)
import { deleteAsync } from "del";                    // удаление файлов/папок


// ————————————————————————————————————————————
// ОПТИМИЗАЦИЯ И КОНВЕРТАЦИЯ ИЗОБРАЖЕНИЙ
// ————————————————————————————————————————————

import newer from "gulp-newer";                       // обрабатывать только новые/изменённые файлы
import imagemin from "gulp-imagemin";                 // сжатие PNG, JPG, GIF
import avif from "gulp-avif";                         // конвертация в AVIF
import webp from 'gulp-webp';                         // конвертация в WebP
import svgmin from "gulp-svgmin";                     // минификация  SVG
import merge from 'merge-stream';                     // объединение нескольких потоков в один
import svgSprite from "gulp-svg-sprite";              // сборка SVG-спрайта из отдельных иконок


// ————————————————————————————————————————————
// ИНКЛЮДЫ И ТИПОГРАФИКА В HTML
// ————————————————————————————————————————————

import include from "gulp-include";                  // вставка частей HTML (шаблонизация)
import typograf from "gulp-typograf";                // автоматическая типографика (расстановка кавычек, тире, nbsp)


// ————————————————————————————————————————————
// ОПИСАНИЕ ПУТЕЙ (DRY — не повторяем пути вручную)
// ————————————————————————————————————————————

const paths = {
  html: {
    pages: 'app/pages/*.html',										 // где лежат исходные HTML-страницы
    components: 'app/components',									 // папка с кусками HTML для include
    dest: 'app'														 // куда сбрасывать готовые HTML
  },
  styles: {
    main: 'app/scss/style.scss',									 // главный SCSS-файл
    src: 'app/scss/**/*.scss',										 // все SCSS-файлы для watch
    dest: 'app/css'													 // выходная папка CSS
  },
  scripts: {
    src: [ 'node_modules/jquery/dist/jquery.js', 'node_modules/jquery-ui/dist/jquery-ui.js', 'node_modules/swiper/swiper-bundle.js', 'app/js/**/*.js', '!app/js/main.min.js'											 // исключаем уже скомпилированный
    ], dest: 'app/js',													 // куда сбрасывать JS
    outputFile: 'main.min.js'										 // имя итогового файла
  },
  images: {
    src: [ 'app/images/src/**/*.*', '!app/images/src/**/*.svg' ],		// растровые
    svg: 'app/images/src/**/*.svg',									// svg для чистки
    dest: 'app/images',												// выходная папка изображений
  },
  sprite: {
    src: 'app/images/src/*.svg',									// одиночные иконки для спрайта
    dest: 'app/images',												// куда сбросить sprite.svg
  },
  resources: {
    src: 'app/upload/**/*',											// любые файлы, которые юзер загружает
    dest: 'dist/upload'
  },
  build: [															// какие файлы копировать в папку dist для финального билда
    'app/css/**/*.css', 'app/images/*.*', '!app/images/**/*.html', 'app/js/main.min.js', 'app/*.html', 'app/upload/**/*', 'app/web.config', 'app/favicon.png', ],
  dist: 'dist',														// папка финального билда
  watch: {															// за чем следить для live-reload
    styles: 'app/scss/**/*.scss',
    images: 'app/images/src/**/*.*',
    scripts: [ 'app/js/**/*.js', '!app/js/**/*.min.js' ],
    html: [ 'app/components/**/*.html', 'app/pages/*.html' ],
    pages: 'app/*.html',
    resources: 'app/upload/**/*'
  }
}


// —— Задачи ——

// 1. Копирование любых файлов из папки uploads (например, файлы для загрузки пользователем)
function resources() {
  return src(paths.resources.src)
      .pipe(dest(paths.resources.dest));
}


// 2. Обработка HTML-страниц: include-компоненты + типографика
function pages() {
  return src(paths.html.pages)
      .pipe(include({ includePaths: paths.html.components }))
      .pipe(typograf({ locale: [ 'ru', 'en-US' ], safeTags: [ [ '<no-typography>', '</no-typography>' ] ] }))
      .pipe(dest(paths.html.dest))
      .pipe(browserSync.reload({ stream: true }))		  // обновляем браузер
}


// 3. Оптимизация и конвертация изображений, Если есть необходимость в модульности (Создание картинок по папкам с секциями)
function images() {
  const destPath = paths.images.dest;

  // AVIF
  const avifStream = src(paths.images.src, { base: 'app/images/src' })
      .pipe(newer(destPath))                    // только новые файлы
      .pipe(avif({ quality: 90 }))        // качество 90/100
      .pipe(dest(destPath));

  // WebP
  const webpStream = src(paths.images.src, { base: 'app/images/src' })
      .pipe(newer(destPath))
      .pipe(webp())
      .pipe(dest(destPath));

  // Оригиналы (PNG/JPG/GIF) — оптимизация
  const imgStream = src(paths.images.src, { base: 'app/images/src' })
      .pipe(newer(destPath))
      .pipe(imagemin({
        progressive: true, interlaced: true
        // при необходимости можно добавить плагины для конкретных форматов
      }))
      .pipe(dest(destPath));

  // Чистая оптимизация SVG
  const svgStream = src(paths.images.svg, { base: 'app/images/src' })
      .pipe(newer(destPath))
      .pipe(svgmin())    // минимизация SVG
      .pipe(dest(destPath));

  // Объединяем потоки и стримим в браузер
  return merge(avifStream, webpStream, imgStream, svgStream)
      .pipe(browserSync.stream());

  /*
	  Если нет необходимости придерживаться модульности (Разбивать картинки по папкам - секциями)
  */

  // return src(['app/images/src/*.*', '!app/images/src/*.svg'])
  //     .pipe(newer('app/images/'))
  //     .pipe(avif({ quality: 90 }))
  //
  //     .pipe(src('app/images/src/*.*'))
  //     .pipe(newer('app/images/'))
  //     .pipe(webp())
  //
  //     .pipe(src('app/images/src/*.*'))
  //     .pipe(newer('app/images/'))
  //     .pipe(imagemin())
  //
  //     .pipe(dest('app/images/'))
  //     .pipe(browserSync.stream())
}


// 4. Генерация SVG-спрайта из одиночных SVG-файлов
function sprite() {
  return src(paths.sprite.src)
      .pipe(svgSprite({
        mode: {
          stack: {
            sprite: '../sprite.svg',     // итоговый файл
            example: false               // не делать демо-страницу
          }
        }
      }))
      .pipe(dest(paths.sprite.dest))
}


// 5. Сборка и минификация JS: сторонние библиотеки + свой код
function scripts() {
  return src(paths.scripts.src)
      .pipe(plumber({ errorHandler: gulpNotify.onError('JS Error: <%= error.message %>') }))    // не ломать поток
      .pipe(concat(paths.scripts.outputFile))                // объединить воедино
      .pipe(uglifyJs({								// минифицировать (без mangle)
        compress: true, mangle: false
      }))
      .pipe(dest(paths.scripts.dest))
      .pipe(browserSync.reload({ stream: true }))		// перезагрузить браузер
}


// 6. Компиляция SCSS → CSS
function styles() {
  return src(paths.styles.main)
      .pipe(plumber({									// отлавливаем ошибки SCSS
        errorHandler: gulpNotify.onError({
          title: 'SCSS Error', message: 'Error: <%= error.message %>'
        })
      }))
      .pipe(sourcemaps.init())
      .pipe(sassCompiler({ outputStyle: 'compressed' }).on('error', sassCompiler.logError))      // сжатый CSS
      .pipe(autoprefixer({
        overrideBrowserslist: [ 'last 10 version' ]
      }))
      .pipe(concat('style.min.css'))                    // итоговый файл стилей
      .pipe(sourcemaps.write('.'))                  // записать карты
      .pipe(dest(paths.styles.dest))
      // .pipe(browserSync.stream())
      .on('end', () => setTimeout(() => browserSync.reload(), 100)); // 100 мс пауза

}


// 7. Очистка папки dist перед билдом
async function cleanDist() {
  // полностью очищаем папку dist, но не удаляем саму папку
  await deleteAsync([ `${ paths.dist }/**`, `!${ paths.dist }` ]);
}


// 8. Слежение за изменениями — локальный сервер + watch
function watching() {
  browserSync.init({
    server: {
      baseDir: paths.html.dest, // если запрошенного файла нет — отдаем 404
      middleware: function (req, res, next) {
        const filePath = path.join(__dirname, paths.html.dest, req.url === '/' ? 'index.html' : req.url);

        if (!fs.existsSync(filePath)) {
          req.url = '/404.html';
        }
        return next();
      }
    }, ghostMode: false,
  });

  // отслеживаем SCSS, картинки, JS, HTML-компоненты, html-страницы, ресурсы
  watch(paths.watch.styles, styles);
  watch(paths.watch.images, images);                            	// было watch(['app/images/src'], images)
  watch(paths.watch.scripts, scripts);        						// следит за всеми js-ками кроме минимизированных
  watch(paths.watch.html, pages);
  watch(paths.watch.resources, resources);
}


// 9. КОПИРОВАНИЕ В dist ДЛЯ БИЛДА
function building() {
  return src(paths.build, { base: 'app' })
      .pipe(dest(paths.dist))
}


// Экспортируем публичные задачи
export { styles, images, pages, sprite, scripts, resources, cleanDist }

// Команда `gulp build` для production
export const build = series(cleanDist, parallel(styles, images, scripts, pages, sprite, resources), building);

// По умолчанию — сборка + слежка
export default series(parallel(styles, images, scripts, pages, sprite), watching);
