const gulp = require('gulp'),
  terser = require('gulp-terser'),
  rename = require('gulp-rename'),
  browserSync = require('browser-sync'),
  eslint = require('gulp-eslint'),
  sass = require('gulp-sass'),
  autoprefixer = require('gulp-autoprefixer'),
  cssnano = require('gulp-cssnano'),
  prettyError = require('gulp-prettyerror');

gulp.task('lint', function() {
  return gulp
    .src('./js/*.js')
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('sass', function() {
  return gulp
    .src('./sass/styles.scss')
    .pipe(prettyError())
    .pipe(sass())
    .pipe(autoprefixer())
    .pipe(cssnano())
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('./build/css'));
});

gulp.task(
  'scripts',
  gulp.series('lint', function scripts() {
    return gulp
      .src('./js/*.js')
      .pipe(terser())
      .pipe(rename({ extname: '.min.js' }))
      .pipe(gulp.dest('./build/js'));
  })
);

gulp.task('browser-sync', function() {
  browserSync.init({
    server: {
      baseDir: './'
    }
  });

  gulp
    .watch(['*.html', 'build/css/*.css', 'build/js/*.js'])
    .on('change', browserSync.reload);
});

gulp.task('watch', function() {
  gulp.watch('js/*.js', gulp.series('scripts'));
  gulp.watch('sass/*.scss', gulp.series('sass'));
});
//gulp.watch(['js/*.js', 'sass/*.scss'], gulp.parallel('scripts', 'sass'))
gulp.task('default', gulp.parallel('browser-sync', 'watch'));
