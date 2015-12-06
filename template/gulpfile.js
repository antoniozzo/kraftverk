var gulp       = require('gulp');
var less       = require('gulp-less');
var autoprefix = require('gulp-autoprefixer');

gulp.task('less', function() {
	return gulp.src('src/less/main.less')
		.pipe(less())
		.pipe(autoprefix())
		.pipe(gulp.dest('assets/css'));
});

gulp.task('watch', function() {
	gulp.watch(['src/**/*.less'], ['less']);
});

gulp.task('default', ['watch']);
