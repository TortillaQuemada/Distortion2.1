const { src, dest, series, parallel } = require('gulp');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const zip = require('gulp-zip');
const image = require('gulp-image');
const cleancss = require('gulp-clean-css');
const replace = require('gulp-replace');
const htmlmin = require('gulp-html-minifier');

//----------------- JS -------------------//
const jsFiles = ['assets/**/*.js', '!assets/**/*.min.js'];
function minifyJs() {
  return src(jsFiles)
    .pipe(uglify())
    .pipe(dest('appweb_res'));
}
//----------------- CSS -------------------//
const cssFiles = ['assets/**/*.css', '!assets/**/*.min.css'];
function minifyCss() {
  return src(cssFiles)
    .pipe(cleancss())
    .pipe(dest('appweb_res'));
}
//----------------- IMAGE -------------------//
const imgFiles = ['contenido/**/*.png', 'contenido/**/*.jpg', 'contenido/**/*.gif', 'contenido/**/*.jpeg'];
function compressImage() {
  return src(imgFiles)
    .pipe(image())
    .pipe(dest('appweb_res'));
}
//----------------- HTML -------------------//
const htmlFiles = ['assets/**/*.html', '*.html'];
function minifyHtml() {
  return src(htmlFiles)
    .pipe(htmlmin({
      collapseWhitespace: true,
      keepClosingSlash: true,
      minifyJS: true,
      minifyCSS: true
    }))
    .pipe(dest('appweb_res'));
}
//----------------- JS Versioning -------------------//
function getTimestamp() {
  let d = new Date();
  return `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}` +
         `${String(d.getHours()).padStart(2, '0')}${String(d.getMinutes()).padStart(2, '0')}${String(d.getSeconds()).padStart(2, '0')}${String(d.getMilliseconds()).padStart(3, '0')}`;
}

function versioningJs() {
  let id = getTimestamp();
  return src(htmlFiles)
    .pipe(replace(/\.js\"/g, `.js?v=${id}"`))
    .pipe(replace(/\.js\'/g, `.js?v=${id}'`))
    .pipe(dest('appweb_res'));
}
//----------------- ZIP -------------------//
function createWar() {
  return src('target/sitioweb-1.0/**/*')
    .pipe(zip('sitioweb.war'))
    .pipe(dest('target'));
}
//----------------- Tareas Principales -------------------//
exports.minifyJs = minifyJs;
exports.minifyCss = minifyCss;
exports.compressImage = compressImage;
exports.minifyHtml = minifyHtml;
exports.versioningJs = versioningJs;
exports.createWar = createWar;

// Tarea por defecto que ejecuta las demás en orden
exports.default = series(
  parallel(minifyJs, minifyCss),
  minifyHtml,
  versioningJs,
  compressImage
);
