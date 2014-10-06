var gulp = require('gulp');
var connect = require('gulp-connect');
var jade = require('gulp-jade');
var usemin = require('gulp-usemin');
var rev = require('gulp-rev');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var minifyHtml = require('gulp-minify-html');
var minifyCss = require('gulp-minify-css');

var jadePipe = function() {
  return gulp.src('./app/views/**/*.jade')
    .pipe(jade({}));
}
gulp.task('default', ['serve', 'watch'], function() {
});

gulp.task('sass', function() {
  return gulp.src('./app/styles/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('./.tmp/styles/'))
});

gulp.task('build', ['sass'], function() {
  jadePipe()
    .pipe(usemin({
      css: [minifyCss(), 'concat'],
      html: [minifyHtml({empty: true})],
      js: [uglify()]
    }))
    .pipe(gulp.dest('./dist'));
});

gulp.task('serve', function() {
  connect.server({
    root: ['.tmp', 'app', '.'],
    port: 3000
  });
});

gulp.task('jade-dev', function() {
  jadePipe()
    .pipe(gulp.dest('./.tmp'));
});

gulp.task('watch', ['sass', 'jade-dev'], function() {
  gulp.watch(['./app/styles/**/*.scss'], ['sass']);
  gulp.watch(['./app/views/**/*.jade'], ['jade-dev']);
});
