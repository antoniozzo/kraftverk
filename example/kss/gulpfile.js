var gulp       = require('gulp');
var less       = require('gulp-less');
var autoprefix = require('gulp-autoprefixer');

gulp.task('less', function() {
	return gulp.src('src/main.less')
		.pipe(less())
		.pipe(autoprefix())
		.pipe(gulp.dest('dist/css'));
});
