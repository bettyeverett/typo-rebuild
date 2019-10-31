let gulp = require('gulp');
let cleanCSS = require('gulp-clean-css');
let rename = require('gulp-rename');
let sass = require('gulp-sass');
let concat = require('gulp-concat')
let uglify = require('gulp-uglify-es').default;
let browserSync = require('browser-sync').create();

function reload(done) {
  browserSync.reload();
  done();
}

function serve(done) {
  browserSync.init({
    server: {
      baseDir: './'
    }
  });
  done();
}

// SASS WATCH
gulp.task('sass', function () {
    var stream = gulp.src('./scss/styles.scss')
        .pipe(sass())
        .pipe(rename('style.css'))
        .pipe(gulp.dest('./css/'));
    return stream;
});

// MINIFY CSS
gulp.task('minify-css', () => {
    return gulp.src('css/style.css')
      .pipe(cleanCSS({compatibility: 'ie8'}))
      .pipe(rename({suffix: '.min'}))
      .pipe(gulp.dest('./css/'));
});

// COMBINE SASS AND MINIFY CSS (ALSO WATCHES FOR CHANGES TO UPDATE BROWSER)
gulp.task('sass-minify', gulp.series('sass', 'minify-css'));

// COMBINE AND MINIFY JS
gulp.task('combine-js', () => {
    return gulp.src(['js/script.js'])
      .pipe(concat('combined.js'))
      .pipe(gulp.dest('./js/'));
});

gulp.task('minify-js', () => {
    return gulp.src('js/combined.js')
        .pipe(uglify())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('./js/'));
});

gulp.task('js-combine-minify', gulp.series('combine-js', 'minify-js'));

const watch = () => gulp.watch(['./scss/**/*.scss', 'js/script.js'], gulp.series('sass-minify', 'js-combine-minify', reload));

gulp.task('default', gulp.series(serve, watch)); // just run "gulp" or "gulp default"