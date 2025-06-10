const { src, dest, watch, parallel, series } = require('gulp');

const scss = require('gulp-sass')(require('sass')); //преобразование scss/sass в css
const concat = require('gulp-concat'); // объединение файлов
const uglify = require('gulp-uglify-es').default; //используется для минификации js
const browserSync = require('browser-sync').create(); // запускает локальный сервер
const autoprefixer = require('gulp-autoprefixer'); // приводит css к кроcсбраузерности
const del = require('del'); // удаление папок
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');

const merge = require('merge-stream'); // одновременно запускать три "ветки" обработки
const svgmin = require('gulp-svgmin'); // оптимизация .svg

const avif = require('gulp-avif'); // конвертер в avif
const webp = require('gulp-webp'); // конвертер в webp
const imagemin = require('gulp-imagemin'); // сжимание картинок
const newer = require('gulp-newer'); // кэш
const svgSprite = require('gulp-svg-sprite'); // объединение svg картинок в 1 файл
const include = require('gulp-include'); // подключение html к html
const typograf = require('gulp-typograf'); //расставляет неразрывные пробелы в нужных местах
const fs = require('fs');   // проверка на существование файла
const sourcemaps = require('gulp-sourcemaps');

function resources() {
    return src('app/upload/**/*')
        .pipe(dest('dist/upload'))
}

function pages() {
    return src('app/pages/*.html')
        .pipe(include({
            includePaths: 'app/components'
        }))
        .pipe(typograf({
            locale: ['ru', 'en-US'],
            safeTags: [
                ['<no-typography>', '</no-typography>']
            ]
        }))
        .pipe(dest('app'))
        .pipe(browserSync.stream())
}

    /*
        Если есть необходимость в модульности (Создание картинок по папкам с секциями)
    */
function images() {
    const srcPattern = [
        'app/images/src/**/*.*',    // все файлы во вложенных папках
        '!app/images/src/**/*.svg'  // кроме SVG
    ];
    const destPath = 'app/images';

    // AVIF
    const avifStream = src(srcPattern, { base: 'app/images/src' })
        .pipe(newer(destPath))
        .pipe(avif({ quality: 90 }))
        .pipe(dest(destPath));

    // WebP
    const webpStream = src(srcPattern, { base: 'app/images/src' })
        .pipe(newer(destPath))
        .pipe(webp())
        .pipe(dest(destPath));

    // Оригиналы (PNG/JPG/GIF) — оптимизация
    const imgStream = src(srcPattern, { base: 'app/images/src' })
        .pipe(newer(destPath))
        .pipe(imagemin({
            progressive: true,
            interlaced: true
            // при необходимости можно добавить плагины для конкретных форматов
        }))
        .pipe(dest(destPath));

    // Чистая оптимизация SVG
    const svgStream = src('app/images/src/**/*.svg', { base: 'app/images/src' })
        .pipe(newer(destPath))
        .pipe(svgmin())    // минимизация SVG
        .pipe(dest(destPath));

    // Объединение всех трех потоков и стримим в браузер
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

function sprite() {
    return src('app/images/src/*.svg')
        .pipe(svgSprite({
            mode: {
                stack: {
                    sprite: '../sprite.svg',
                    example: true
                }
            }
        }))
        .pipe(dest('app/images/'))
}

function scripts() {
    return src([
        'node_modules/jquery/dist/jquery.js',
        'node_modules/jquery-ui/dist/jquery-ui.js',
        'node_modules/swiper/swiper-bundle.js',
        'app/js/**/*.js',
        '!app/js/main.min.js',
    ])
        .pipe(concat('main.min.js'))
        .pipe(uglify({
            compress: true,
            mangle: false
        }))
        .pipe(dest('app/js'))
        .pipe(browserSync.reload({ stream: true }))
}

function styles() {
    return src('app/scss/style.scss')
        .pipe(plumber({
            errorHandler: notify.onError({
                title: 'SCSS Error',
                message: 'Error: <% error.message %>'
            })
        }))
        .pipe(sourcemaps.init())
        .pipe(scss({ outputStyle: 'compressed' }))
        .pipe(autoprefixer({ overrideBrowserslist: ['last 10 version'] }))
        .pipe(concat('style.min.css'))
        .pipe(sourcemaps.write('.'))
        .pipe(dest('app/css'))
        .pipe(browserSync.stream())
}

function watching() {
    const path = require('path');


    browserSync.init({
        server: {
            baseDir: 'app/',
            middleware: function (req, res, next) {
                const filePath = path.join(__dirname, 'app', req.url === '/' ? 'index.html' : req.url);

                if (!fs.existsSync(filePath)) {
                    req.url = '/404.html';
                }

                return next();
            }
        },
        ghostMode: false,

    });
    watch(['app/scss/**/*.scss'], styles);
    watch('app/images/src/**/*.*', images);                            // было watch(['app/images/src'], images)
    watch(['app/js/**/*.js', '!app/js/**/*.min.js'], scripts);        // следит за всеми js-ками кроме минимизированных
    watch(['app/components/**/*.html', 'app/pages/**/*.html'], pages);
    watch(['app/*.html']).on('change', browserSync.reload);
    watch(['app/upload/**/*'], resources);
}

function cleanDist() {
    return del.deleteAsync(['dist/**', '!dist']);
}

function building() {
    return src([
        // 'app/css/style.min.css',
        'app/css/**/*.css',
        '!app/images/**/*.html',
        'app/images/*.*',
        // '!app/images/*.svg',
        // 'app/images/sprite.svg',
        'app/js/main.min.js',
        'app/*.html',
        'app/upload/**/*',
        'app/web.config',
        // 'app/favicon.png',
    ], { base: 'app' })
        .pipe(dest('dist'))
}

exports.styles = styles;
exports.images = images;
exports.pages = pages;
exports.building = building;
exports.sprite = sprite;
exports.scripts = scripts;
exports.watching = watching;

exports.build = series(cleanDist, building);
exports.default = series(styles, images, scripts, pages, watching);