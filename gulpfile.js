'use strict';

require('es6-promise').polyfill();

// Gulp Includes //
var gulp	= require('gulp');
//var gulp_if	= require('gulp-if');
var debug	= require('gulp-debug');
var newer	= require('gulp-newer');
var rename	= require('gulp-rename');
var concat	= require('gulp-concat');
var notify	= require('gulp-notify');
var gzip	= require('gulp-gzip');
var size	= require('gulp-size');
// Other Includes //
var glob	= require("glob")


const AUTOPREFIX_CONFIG = {
//	browsers: ["last 2 versions"]
};

const BABEL_CONFIG = {
	presets:['es2015'],
	plugins:[
		["transform-react-jsx", { "pragma":"h" }]
	]
};


var ignore_folders = glob.sync('src/_**/').map(function(el){return '!'+el+'**/*.*'});

var babelignore_files = glob.sync('src/**/.babelignore').map(function(el){
	return el.replace('.babelignore','');
});

// Ignore any minified files, or files/folders prefixed with an underscore //
var less_files		= ['src/**/*.less','!src/**/_*.*']
						.concat(ignore_folders);
var css_files		= ['src/**/*.css','!src/**/*.min.css','!src/**/_*.*']
						.concat(ignore_folders);

var js_in_files 	= ['src/**/*.js','!src/**/*.min.js','!src/**/_*.*']
						.concat(babelignore_files.map(function(el){return '!'+el+'*.*';}))
						.concat(ignore_folders);
var raw_js_in_files	= babelignore_files.map(function(el){return el+'**/*.js';})
						.concat(babelignore_files.map(function(el){return '!'+el+'**/*.min.js';}))
						.concat(babelignore_files.map(function(el){return '!'+el+'**/_*.*';}))
						.concat(ignore_folders);

var build_folder		= 'output';
var release_folder		= 'public-static/output';

// Ignore any min files, and the output file //
var css_output 			= 'all.css';
var css_min_output		= 'all.min.css';
var css_min_gz_output	= 'all.min.css.gz';
var css_out_files		= [
	build_folder+'/**/*.css',
	'!'+build_folder+'/**/_*.css',
	'!'+build_folder+'/**/*.min.css',
	'!'+build_folder+'/'+css_output
];

var js_output			= 'all.js';
var js_min_output		= 'all.min.js';
var js_min_gz_output	= 'all.min.js.gz';
var js_out_files		= [
	build_folder+'/**/*.js',
	'!'+build_folder+'/**/_*.js',
	'!'+build_folder+'/**/*.min.js',
	'!'+build_folder+'/'+js_output
];

/* LESS files to CSS */
gulp.task('less', function() {
	var less		= require('gulp-less');
	// NOTE: Sourcemaps is surpressing errors, so it's disabled for now
//	var sourcemaps	= require('gulp-sourcemaps');
//	var less		= require('gulp-less-sourcemap');
	// NOTE: We're running autoprefixer as a LESS plugin, due to problems with postcss sourcemaps
	var autoprefix	= require('less-plugin-autoprefix');

	return gulp.src( less_files )
		.pipe( newer({dest:build_folder,ext:".css"}) )
		.pipe( debug({title:'less:'}) )
//		.pipe( sourcemaps.init() )
			.pipe( less({
				plugins:[
					new autoprefix(AUTOPREFIX_CONFIG)
				]
			}) )
//		.pipe( sourcemaps.write() )
		.pipe( gulp.dest(build_folder+'/') );
});
/* Unprocessed CSS files */
gulp.task('css', function() {
	return gulp.src( css_files )
		.pipe( newer({dest:build_folder}) )
		.pipe( debug({title:'css:'}) )
		.pipe( gulp.dest(build_folder+'/') );
});
/* Concatenate all CSS files */
gulp.task('css-cat', ['less','css'], function() {
//gulp.task('css-cat', gulp.series(['less','css'], function() {
	return gulp.src( css_out_files )
		.pipe( newer({dest:build_folder+'/'+css_output}) )
		.pipe( concat( css_output ) )
		.pipe( size({title:'css-cat:',showFiles:true}) )
		.pipe( gulp.dest( build_folder+'/' ) );
});
/* Minifiy the concatenated CSS file */
gulp.task('css-min', ['css-cat'], function() {
//gulp.task('css-min', gulp.series(['css-cat'], function() {
	// Benchmarks: http://goalsmashers.github.io/css-minification-benchmark/
	var cleancss	= require('gulp-cleancss');		// Faster, similar results
//	var cssnano		= require('gulp-cssnano');

	return gulp.src( build_folder+'/'+css_output )
		.pipe( newer({dest:release_folder+'/'+css_min_output}) )
		.pipe( cleancss() )
//		.pipe( cssnano() )
		.pipe( concat( css_min_output ) )
		.pipe( size({title:'css-min:',showFiles:true}) )
		.pipe( gulp.dest( release_folder+'/' ) );	
});
/* GZIP minified (for reference) */
gulp.task('css-min-gz', ['css-min'], function() {
//gulp.task('css-min-gz', gulp.series(['css-min'], function() {
	return gulp.src( release_folder+'/'+css_min_output )
		.pipe( newer({dest:build_folder+'/'+css_min_gz_output}) )
		.pipe( gzip() )
		.pipe( size({title:'css-min-gz:',showFiles:true}) )
		.pipe( gulp.dest( build_folder+'/' ) );
});


/* Use Babel to compile ES2015 files to JS */
gulp.task('babel', function() {
	var babel = require("gulp-babel");
	
	return gulp.src( js_in_files, {base:'src'} )
		.pipe( newer({dest:build_folder,ext:".o.js"}) )
		.pipe( debug({title:'js (babel):'}) )
		.pipe( babel(BABEL_CONFIG) )
		.pipe( rename({extname: ".o.js"}) )
		.pipe( gulp.dest( build_folder+'/' ) );
});
/* Unprocessed JS files */
gulp.task('js', function() {
	return gulp.src( raw_js_in_files, {base:'src'} )
		.pipe( newer({dest:build_folder}) )
		.pipe( debug({title:'js (raw):'}) )
		.pipe( gulp.dest( build_folder+'/' ) );
});
/* Concatenate all JS files */
gulp.task('js-cat', ['babel','js'], function() {
//gulp.task('js-cat', gulp.series(['babel','js'], function() {
	return gulp.src( js_out_files )
		.pipe( newer({dest:build_folder+'/'+js_output}) )
		.pipe( concat( js_output ) )
		.pipe( size({title:'js-cat:',showFiles:true}) )
		.pipe( gulp.dest( build_folder+'/' ) );
});
/* Minifiy the concatenated JS file */
gulp.task('js-min', ['js-cat'], function() {
//gulp.task('js-min', gulp.series(['js-cat'], function() {
	var uglify = require('gulp-uglify');
	
	return gulp.src( build_folder+'/'+js_output )
		.pipe( newer({dest:release_folder+'/'+js_min_output}) )
		.pipe( uglify() )
		.pipe( concat( js_min_output ) )
		.pipe( size({title:'js-min:',showFiles:true}) )
		.pipe( gulp.dest( release_folder+'/' ) );
});
/* GZIP minified (for reference) */
gulp.task('js-min-gz', ['js-min'], function() {
//gulp.task('js-min-gz', gulp.series(['js-min'], function() {
	return gulp.src( release_folder+'/'+js_min_output )
		.pipe( newer({dest:build_folder+'/'+js_min_gz_output}) )
		.pipe( gzip() )
		.pipe( size({title:'js-min-gz:',showFiles:true}) )
		.pipe( gulp.dest( build_folder+'/' ) );	
});



/* Nuke the output folders */
gulp.task('clean', function() {
	var del = require('del');
	
	return del( [build_folder+'/**/*',release_folder+'/**/*'] );
});


// Testing generation of a file used by PHP
//gulp.task('php-com', function() {
//	var fs = require('fs');
//	
//	fs.writeFileSync('src/com/list.gen.php', "<?php\n// WARNING! DO NOT MODIFY! This file is automatically generated!\n\n");
//});


// TODO: Popup notifications when a watch catches an error/linting error
//		.pipe( notify("hello") )


// NOTE: Use gulp-watch instead: https://www.npmjs.com/package/gulp-watch
//gulp.task('less-watch', ['css','js'] function () {
//	gulp.watch(less_files, ['css'])
//	gulp.watch(js_out_files, ['js'])
//});


// By default, GZIP the files, to report roughly how large things are when GZIPPED
gulp.task('default', ['css-min-gz','js-min-gz'], function(done) {
//gulp.task('default', gulp.series(['css-min-gz','js-min-gz'], function(done) {
	var symlink	= require('gulp-symlink');	// Depricated in Gulp 4

	const IS_DEBUG = glob.sync('.gulpdebug').length > 0;
	if ( IS_DEBUG ) {
		// Only create symlinks if they don't exist //
		if ( glob.sync(release_folder+'/'+js_output).length === 0 ) {
			gulp.src( build_folder+'/'+css_output )
				.pipe( symlink( release_folder+'/'+css_output ) );
//				.pipe( gulp.symlink( release_folder+'/'+css_output ) );
		}
		if ( glob.sync(release_folder+'/'+js_output).length === 0 ) {
			gulp.src( build_folder+'/'+js_output )
				.pipe( symlink( release_folder+'/'+js_output ) );
//				.pipe( gulp.symlink( release_folder+'/'+js_output ) );	
		}
	}
//	return done();
});
