const gulp = require('gulp');
const sass = require('gulp-sass');
const browserSync = require('browser-sync').create();
const autoprefixer = require('gulp-autoprefixer');
const nunjucksRender = require('gulp-nunjucks-render');
const concat = require('gulp-concat');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify');
const cleanCSS = require('gulp-clean-css');

gulp.task('styles', function () {
	return gulp
		.src('./app/scss/main.scss')
		.pipe(sass())
		.pipe(autoprefixer())
		.pipe(rename('main.min.css'))
		.pipe(cleanCSS())
		.pipe(gulp.dest('./dist/css'))
		.pipe(browserSync.stream());
});

gulp.task('imgmove', function () {
	return gulp.src('app/img/**/*.*').pipe(gulp.dest('./dist/img'));
});

gulp.task('scripts', function () {
	return gulp
		.src('app/js/**/*.js')
		.pipe(concat('main.js'))
		.pipe(rename('main.min.js'))
		.pipe(uglify())
		.pipe(gulp.dest('dist/js'));
});

gulp.task('nunjucks', function () {
	return (gulp
		.src('app/pages/*.html')
		// Renders template with nunjucks
		.pipe(
			nunjucksRender({
				path: ['app/templates']
			})
		)
		// output files in app folder
		.pipe(gulp.dest('./dist')));
});
//gulp server and compiling
gulp.task('serve', ['styles', 'nunjucks', 'imgmove', 'scripts'], function () {
	browserSync.init({
		server: {
			baseDir: './dist'
		}
	});

	gulp.watch('./app/scss/*.scss', ['styles']);
	gulp.watch('./app/js/*.js', ['scripts']).on('change', browserSync.reload);
	gulp.watch('./app/img/*.*', ['imgmove']).on('change', browserSync.reload);
	// gulp.watch('./app/templates/**/*.html', );
	gulp.watch('./app/**/*.html', ['nunjucks']).on('change', browserSync.reload);
});

gulp.task('default', ['serve']);
