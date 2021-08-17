const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const cleanCSS   = require('gulp-clean-css');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const gutil = require('gulp-util');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const plumber = require('gulp-plumber');
const browserSync = require('browser-sync');
const shell = require('gulp-shell');

// startup the web server and browserSync
// set watchers
function server() {
  browserSync.init({
    server: {
      baseDir: "src/",
      index: "./index.html"
    },
    options: {
      reloadDelay: 250
    },
    notify: false
  });
  gulp.watch('./src/js/*.js', scripts);
  gulp.watch('./src/styles/scss/**/*.scss', styles);
  gulp.watch('./src/*.html', html);
};

// compiling Javascript
function scripts() {
  return gulp.src('./src/js/*.js')
  .pipe(plumber())
  .on('error', gutil.log)
  .pipe(gulp.dest('src/js'))
  .pipe(browserSync.reload({stream: true}))
};

// compiling Javascript for deployment
function jsDeploy() {
  return gulp.src('./src/js/*.js')
  .pipe(plumber())
  .pipe(uglify())
  .pipe(gulp.dest('dist/js'))
};

// compiling SCSS files
function styles() {
  return gulp.src('src/styles/scss/**/*.scss')
  .pipe(plumber())
  .pipe(sourcemaps.init())
  .pipe(sass())
  .pipe(autoprefixer({
    Browserslist: ['last 2 versions', 'not dead'],
    cascade: true
  }))
  .on('error', gutil.log)
  .pipe(concat('styles.css'))
  .pipe(sourcemaps.write())
  .pipe(gulp.dest('src/styles'))
  .pipe(browserSync.reload({stream: true}))
};

// compiling SCSS files for deployment
function stylesDeploy() {
  return gulp.src('src/styles/scss/**/*.scss')
    .pipe(plumber())
    .pipe(sass())
    .pipe(autoprefixer({
      Browserslist: ['last 2 versions', 'not dead'],
      cascade: true
    }))
    .pipe(concat('styles.css'))
    .pipe(cleanCSS())
    .pipe(gulp.dest('dist/styles'))
};

// watch and refresh HTML files
function html() {
  return gulp.src('src/index.html')
  .pipe(plumber())
  .pipe(browserSync.reload({stream: true}))
  .on('error', gutil.log)
  .pipe(gulp.dest('src/'));
};

// migrating html/images/src files for deployment
async function htmlDeploy() {
// files in src folder
  gulp.src('src/*', {nodir: true})
  .pipe(plumber())
  .pipe(gulp.dest('dist'));
// hidden files
  gulp.src('src/.*')
  .pipe(plumber())
  .pipe(gulp.dest('dist'));
// html files
  gulp.src('src/index.html')
  .pipe(plumber())
  .pipe(gulp.dest('dist'));
// images
  gulp.src('src/images/**/*.+(png|jpg|gif|svg)')
  .pipe(plumber())
  .pipe(gulp.dest('dist/images'));
};

// cleans dist directory in case things got deleted
async function clean() {
  return shell.task('rm -rf dist');
};

// create folders using shell
async function scaffold() {
  return shell.task([
    'mkdir dist',
    'mkdir dist/js',
    'mkdir dist/styles',
    'mkdir dist/images',
  ]);
};

// development tasks
exports.styles = styles;
exports.scripts = scripts;
exports.html = html;
exports.server = server;
const compile = gulp.parallel(scripts, styles, html);
exports.default = gulp.series(compile, server);

// deployment tasks
exports.jsDeploy = jsDeploy;
exports.stylesDeploy = stylesDeploy;
exports.htmlDeploy = htmlDeploy;
exports.clean = clean;
exports.scaffold = scaffold;
const preDeploy = gulp.series(clean, scaffold);
const deploy = gulp.parallel(jsDeploy, stylesDeploy, htmlDeploy);
exports.deploy = gulp.series(preDeploy, deploy);