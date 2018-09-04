import del from 'del';
import gulp from 'gulp';
import path from 'path';
import sass from 'gulp-sass';
import twig from 'gulp-twig';
import babel from 'gulp-babel';
import rename from 'gulp-rename';
import concat from 'gulp-concat';
import include from 'gulp-include';
import cssNano from 'gulp-cssnano';
import uglifyJs from 'gulp-uglifyjs';
import browserSync from 'browser-sync';
import sourcemaps from 'gulp-sourcemaps';
import autoprefixer from 'gulp-autoprefixer';

import * as data from './data';

gulp.task('sass', () => gulp.src('src/scss/**/*.scss').pipe(sass())
  .pipe(autoprefixer([
    'last 10 versions',
  ], {
    cascade: true,
  }))
  .pipe(gulp.dest('src/css'))
  .pipe(browserSync.reload({ stream: true })));


gulp.task('js', () => gulp.src('src/js/table.js')
  .pipe(sourcemaps.init())
  .pipe(babel())
  .pipe(include({
    includePaths: [
      path.join(__dirname, './data'),
    ],
  }))
  .on('error', console.log)
  .pipe(gulp.dest('src/scripts')));


gulp.task('twig', () => gulp.src('src/**/*.twig')
  .pipe(twig({
    data,
  }))
  .pipe(gulp.dest('src')));


gulp.task('browser-sync', () => browserSync({
  server: [
    'src/templates',
    'src',
  ],
  browser: 'google chrome',
}));


gulp.task('min-js', () => gulp.src([
  'src/libs/jquery/dist/jquery.min.js',
  'src/libs/slick-carousel/dist/slick.min.js',
])
  .pipe(concat('libs.min.js'))
  .pipe(uglifyJs())
  .pipe(gulp.dest('src/js')));


gulp.task('min-css', ['sass'], () => gulp.src('src/css/libs.css')
  .pipe(cssNano())
  .pipe(rename({
    suffix: '.min',
  }))
  .pipe(gulp.dest('src/css')));


gulp.task('clean', () => del.sync('dist'));


gulp.task('build', ['clean', 'min-css', 'min-js'], () => {
  gulp.src([
    'src/css/libs.min.css',
    'src/css/main.css',
  ])
    .pipe(gulp.dest('dist/css'));

  gulp.src('src/fonts/**/*')
    .pipe(gulp.dest('dist/fonts'));

  gulp.src('src/js/**/*')
    .pipe(gulp.dest('dist/js'));

  gulp.src('src/*.html')
    .pipe(gulp.dest('dist'));
});


gulp.task('watch', ['twig', 'js', 'sass', 'browser-sync'], () => {
  gulp.watch('src/**/*.twig', ['twig']);
  gulp.watch('src/scss/**/*.scss', ['sass']);
  gulp.watch('src/js/**/*.js', ['js']);
  gulp.watch('src/**/*.html', browserSync.reload);
});
