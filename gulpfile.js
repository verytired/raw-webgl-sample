var gulp = require('gulp');
var gutil = require('gulp-util');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var browserSync = require('browser-sync');

//load all module
var $ = require('gulp-load-plugins')({
  pattern: ['gulp-*', 'gulp.*', 'browserify**'],
  replaceString: /\bgulp[\-.]/
});

gulp.task('browserify', function () {
  browserify({
    entries: ['./src/index.js'],
    debug: true
  })
    .transform('babelify')
    .bundle()
    .on("error", function (err) {
      console.log("Error : " + err.message);
    })
    .pipe(source('bundle.js'))
    .pipe(gulp.dest('./app/js'))
});

gulp.task('watch', function () {
  gulp.watch('./src/*.js', ['browserify']);
  gulp.watch('./app/js/*.js', ['bs-reload']);
});

gulp.task('serve', function () {
  browserSync({
    notify: false,
    server: {baseDir: 'app/'}
  })
});

gulp.task('bs-reload', function () {
  browserSync.reload();
});

gulp.task('default', ['browserify', 'watch', 'serve']);
