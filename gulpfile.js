'use strict';

var gulp = require('gulp');
var jshint = require('gulp-jshint');
var mocha = require('gulp-mocha');
var stylish = require('jshint-stylish');
var nodemon = require('nodemon');

var workingFiles = ['lib/**.js', 'models/**.js', 'test/**.js', 'routes/**.js', 'server.js', 'gulpfile.js', 'populateDB.js', 'dropDB.js'];

gulp.task('nodemon', function() {
	nodemon({
		script: 'server.js',
		ext: 'js'
	});
});

gulp.task('lint', function() {
	return gulp.src(workingFiles)
		.pipe(jshint())
		.pipe(jshint.reporter(stylish));
});

gulp.task('test', function() {
	var options = {
		read: false,
		ignoreLeaks: false,
		timeout: 3000,
		ul: 'bdd',
		globals: ['should']
	};
	return gulp.src('test/**.js', options)
		.pipe(mocha({reporter: 'nyan'}));
});

gulp.task('default', ['lint', 'test']);