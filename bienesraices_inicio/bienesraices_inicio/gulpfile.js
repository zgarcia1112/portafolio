const { src, dest, watch, series, parallel } = require('gulp');
const sass = require('gulp-sass')(require('sass')); //compilar sass
const autoprefixer = require('autoprefixer');  //autoprefixer es una herramienta que se utiliza para agregar automáticamente los prefijos de proveedores necesarios a las propiedades CSS y es un plugin de postcss
const postcss = require('gulp-postcss') //post css es una herramienta que nos ayuda para optimixar codigo css y ayuda a que funcione en todos los navegadores
const sourcemaps = require('gulp-sourcemaps') //Los source maps, o mapas de origen, son archivos que contienen información sobre cómo se relaciona el código fuente original con el código transformado o minificado que se utiliza en producción.
const cssnano = require('cssnano'); //cssnano es un paquete de optimización y minificación de CSS que se utiliza en el desarrollo web.
const concat = require('gulp-concat'); //gulp-concat es un paquete de gulp que se utiliza para concatenar archivos. Concatenar significa combinar varios archivos en uno solo, en el orden especificado, generando así un archivo resultante que contiene todo el contenido de los archivos originales
const terser = require('gulp-terser-js'); //gulp-terser-js es un paquete de gulp que se utiliza para minificar y ofuscar archivos JavaScript utilizando Terser, una biblioteca de compresión de JavaScript.
const rename = require('gulp-rename');//gulp-rename es un paquete de gulp que se utiliza para renombrar archivos dentro de tu flujo de trabajo. Proporciona una manera sencilla de cambiar el nombre de archivos durante la ejecución de tareas de gulp.
const imagemin = require('gulp-imagemin'); // Minificar imagenes 
const notify = require('gulp-notify'); //gulp-notify es un paquete de gulp que se utiliza para mostrar notificaciones en el sistema operativo durante la ejecución de tareas. Proporciona una forma conveniente de enviar mensajes de notificación al desarrollador, ya sea para indicar el éxito de una tarea, mostrar errores o proporcionar información adicional sobre el flujo de trabajo de gulp.
const cache = require('gulp-cache');//gulp-cache es un paquete de gulp que se utiliza para agregar una capa de almacenamiento en caché a las tareas de gulp. Proporciona una forma eficiente de almacenar en caché los archivos procesados durante la ejecución de las tareas de construcción, lo que ayuda a mejorar el rendimiento al evitar procesamientos innecesarios de archivos que no han cambiado.
const clean = require('gulp-clean'); //gulp-clean es un paquete de gulp que se utiliza para eliminar archivos y carpetas de forma programática dentro de tu flujo de trabajo. Proporciona una manera sencilla de limpiar y eliminar archivos generados previamente, archivos temporales o cualquier otro archivo que desees eliminar como parte de tus tareas de construcción.
const webp = require('gulp-webp');

const paths = {
    scss: 'src/scss/**/*.scss',
    js: 'src/js/**/*.js',
    imagenes: 'src/img/**/*'
}

function css() {
    return src(paths.scss)
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(postcss([autoprefixer(), cssnano()]))
        // .pipe(postcss([autoprefixer()]))
        .pipe(sourcemaps.write('.'))
        .pipe(dest('build/css'));
}

function javascript() {
    return src(paths.js)
      .pipe(sourcemaps.init())
      .pipe(concat('bundle.js'))
      .pipe(terser())
      .pipe(sourcemaps.write('.'))
      .pipe(rename({ suffix: '.min' }))
      .pipe(dest('./build/js'))
}

function imagenes() {
    return src(paths.imagenes)
        .pipe(cache(imagemin({ optimizationLevel: 3 })))
        .pipe(dest('build/img'))
        .pipe(notify({ message: 'Imagen Completada' }));
}

function versionWebp() {
    return src(paths.imagenes)
        .pipe(webp())
        .pipe(dest('build/img'))
        .pipe(notify({ message: 'Imagen Completada' }));
}


function watchArchivos() {
    watch(paths.scss, css);
    watch(paths.js, javascript);
    watch(paths.imagenes, imagenes);
    watch(paths.imagenes, versionWebp);
}

exports.css = css;
exports.watchArchivos = watchArchivos;
exports.default = parallel(css, javascript, imagenes, versionWebp, watchArchivos); 