var gulp = require('gulp');
var gutil = require('gulp-util');

var clean = require('gulp-clean');
var concat = require('gulp-concat');
var iconfont = require('gulp-iconfont');
var iconfontCSS = require('gulp-iconfont-css');
var plumber = require('gulp-plumber')
var sass = require('gulp-sass')
var uglify = require('gulp-uglify');

//
// Variables
//
var srcDir = './source/assets/src';
var distDir = './source/assets/dist';
var isDebug = !gutil.env.prod;

//
// Default
//
gulp.task('default', function() {
  gulp.start('build', 'watch');
});

//
// Clean
//
gulp.task('clean', function(cb) {
  gulp
    .src(distDir, {read: false})
    .pipe(clean())
    .on('end', cb);
});

//
// Build
//
gulp.task('build', ['clean'], function() {
  gulp.start('styles', 'scripts', 'fonts');
});

//
// Watch
//
gulp.task('watch', function() {
  gulp.watch(srcDir + '/styles/**/*.scss', ['styles']);
  gulp.watch(srcDir + '/scripts/**/*.js', ['scripts']);
});

//
// Stylesheets
//
gulp.task('styles', function () {
  gulp.src(srcDir + '/styles/main.scss')
    .pipe(plumber())
    .pipe(sass({
      outputStyle: isDebug ? 'nested' : 'compressed'
    }))
    .pipe(gulp.dest(distDir + '/css'))
});

//
// Javascript
//
gulp.task('scripts', function () {
  var files = [
    srcDir + '/scripts/vendor/jquery.js',
    srcDir + '/scripts/vendor/*.js',
    srcDir + '/scripts/**/*.js',
  ];

  gulp.src(files)
    .pipe(concat('main.js', {newLine: ';'}))
    .pipe(uglify())
    .pipe(gulp.dest(distDir + '/js'));
})


//
// Fonts
//
gulp.task('fonts', function () {
  gulp.src(srcDir + '/fonts/*')
    .pipe(gulp.dest(distDir + '/fonts'))
});

//
// Icons
//
gulp.task('icons', function(){
  gulp.src([srcDir + '/icons/*.svg'])
    .pipe(iconfontCSS({
      fontName : 'icons',
      // path: 'scss',
      path: srcDir + '/styles/templates/icons.scss',
      targetPath: '../styles/components/icons.scss',
      fontPath: '../fonts/' // relative path
    }))
    .pipe(iconfont({
      fontName: 'icons',
      // fixedWidth: true,
      normalize: true
    }))
    .pipe(gulp.dest(srcDir + '/fonts'));
});
