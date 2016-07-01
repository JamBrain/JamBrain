'use strict';

var gulp	= require('gulp');
var newer	= require('gulp-newer');
var concat	= require('gulp-concat');
var notify	= require('gulp-notify');

require('es6-promise').polyfill();

// Ignore any file prefixed with an underscore //
var less_files = ['src/**/*.less','!src/**/_*.less'];

// Ignore any min files, and the output file //
var css_output = 'all.css';
var css_min_output = 'all.min.css';
var css_files = ['output/**/*.css','output/**/*.min.css','!output/'+css_output];

var js_output = 'all.js';
var js_min_output = 'all.min.js';
var js_files = ['src/**/*.js','output/**/*.min.js','!output/'+js_output];

/* Process the individual LESS files */
gulp.task('less', function() {
	var postcss = require('gulp-postcss');
	var less	= require('gulp-less-sourcemap');
		
	return gulp.src( less_files )
		.pipe( newer({dest:'output',ext:".css"}) )
		.pipe( postcss([ 
			require('autoprefixer')
		]) )
		.pipe( less(/*{compress: true}*/) )
		.pipe( gulp.dest('output/') );
});

/* Next, combine the output CSS files */
gulp.task('css', ['less'], function() {
	return gulp.src( css_files )
		.pipe( newer( 'output/'+css_output) )
		.pipe( concat( css_output ) )
		.pipe( gulp.dest( 'output/' ) );	
});

/* Finally, minifiy the CSS files */
gulp.task('css-min', ['css'], function() {
	var cssnano	= require('gulp-cssnano');

	return gulp.src( "output/"+css_output )
		.pipe( newer( 'output/'+css_min_output ) )
		.pipe( cssnano() )
		.pipe( concat( css_min_output ) )
		.pipe( gulp.dest('output/') );	
});


/* Merge all JS files */
gulp.task('js', function() {
	return gulp.src( js_files )
		.pipe( newer( 'output/'+js_output ) )
		.pipe( concat( js_output ) )
		.pipe( gulp.dest('output/') );
});

/* Minifiy merged file */
gulp.task('js-min', ['js'], function() {
	var uglify = require('gulp-uglify');
	
	return gulp.src( 'output/'+js_output )
		.pipe( newer( 'output/'+js_min_output ) )
		.pipe( uglify() )
		.pipe( concat( js_min_output ) )
		.pipe( gulp.dest('output/') );
});

/* Nuke the output folder */
gulp.task('clean', function() {
	var del = require('del');
	
	return del( 'output/**/*' );
});

// TODO: Popup notifications when a watch catches an error/linting error
//		.pipe( notify("hello") )


// NOTE: Use gulp-watch instead: https://www.npmjs.com/package/gulp-watch
//gulp.task('less-watch', ['css','js'] function () {
//	gulp.watch(less_files, ['css'])
//	gulp.watch(js_files, ['js'])
//});

gulp.task('default', ['css-min','js-min'], function() {
});
