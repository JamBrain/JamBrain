'use strict';

var gulp	= require('gulp');
var rename	= require('gulp-rename');
var concat	= require('gulp-concat');

// Ignore any file prefixed with an underscore //
var less_files = ['src/**/*.less','!src/**/_*.less'];
// Ignore any minimized CSS files //
var css_files = ['output/**/*.css','!output/**/*.min.css'];

/* Process the individual LESS files */
gulp.task('less', function() {
	var postcss 	= require('gulp-postcss');
	var less		= require('gulp-less-sourcemap');
	
	return gulp.src( less_files )
		.pipe( rename({extension: '.css'}) )
		.pipe( postcss([ 
			require('autoprefixer')
		]) )
		.pipe( less() )
		.pipe( gulp.dest('output/') );
});

/* Next, combine the resulting CSS files */
gulp.task('css', ['less'], function() {
	return gulp.src( css_files )
		.pipe( concat('all.css') )
		.pipe( gulp.dest('output/') );	
});

/* Finally, minifiy the CSS files */
gulp.task('css-min', ['css'], function() {
	var cssnano		= require('gulp-cssnano');

	return gulp.src( "output/all.css" )
		.pipe( cssnano() )
		.pipe( concat('all.min.css') )
		.pipe( gulp.dest('output/') );	
});

//gulp.task('less-watch', function () {
//	gulp.watch(less_files, ['less'])
//});

gulp.task('default', ['css-min'], function() {
});
