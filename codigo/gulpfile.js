const sass = require("gulp-sass")(require("sass")); //extraemos gulp-sass y sass para poder utilizarlo aqui
const plumber = require("gulp-plumber");
const autoprefixer = require("autoprefixer");
const cssnano = require("cssnano");
const postcss = require("gulp-postcss");
const sourcemaps = require("gulp-sourcemaps");
const { src, dest, watch, parallel } = require("gulp");

const path = {
  scss: "src/scss/**/*.scss",
};

function css(done) {
  src(path.scss)
    .pipe(sourcemaps.init())
    .pipe(plumber())
    .pipe(sass())
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(sourcemaps.write("."))
    .pipe(dest("build/css"));
  done();
}

function dev(done) {
  watch(path.scss, css);
}

exports.css = css;
exports.dev = parallel(dev, css);
