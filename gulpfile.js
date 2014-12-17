var gulp = require('gulp');
var gutil = require('gulp-util');

var clean = require('gulp-clean');
var iconfont = require('gulp-iconfont');
var iconfontCSS = require('gulp-iconfont-css');
var plumber = require('gulp-plumber')
var sass = require('gulp-sass')



var stylus = require('gulp-stylus');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var coffee = require('gulp-coffee');
var async = require('async');
var cssmin = require('gulp-cssmin');
var nib = require('nib');

//
// Variables
//
var srcDir = './assets/src';
var distDir = './assets/dist';
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
  gulp.start('styles', 'fonts');
});

//
// Watch
//
gulp.task('watch', function() {
  gulp.watch(srcDir + '/styles/**/*.scss', ['styles']);
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
