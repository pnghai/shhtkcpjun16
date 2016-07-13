/*
 * Generated on 2016-07-03
 * generator-veams v7.0.6
 * http://veams.org/
 *
 * Copyright (c) 2016 Sebastian Fitzner
 * Licensed under the MIT license.
 */

'use strict';

/*
 * PERFORMANCE
 * 
 * 1. For performance reasons you should only matching one level down, if possible. 
 * 2. Try to keep your watch task clean. Do NOT watch everything (like icons).
 * 3. Add "spawn: false" to your watch task when you need to speed up your build.
 *
 */

var config = require('./helpers/config');

module.exports = function(grunt) {
	
	// load only used tasks and add fallbacks for those which cannot be find
	require('jit-grunt')(grunt, {
		'replace': 'grunt-text-replace',
		'express': 'grunt-express-server'
	});
	// measures the time each task takes
	require('time-grunt')(grunt);

	// Load grunt configurations automatically
	var configs = require('load-grunt-configs')(grunt, config.options);

	// Define the configuration for all the tasks
	grunt.initConfig(configs);

	/*
	 *	SIMPLE TASKS
	 */

	// SASS Task
	grunt.registerTask('watchCSS', [
		'sassGlobber:dev',
		'sass:dev'
	]);
	
	// Sprites Task
	grunt.registerTask('icons', [
		'dr-svg-sprites',
		'replace:spriteUrl'
	]); 

	// FE Templates Task
	grunt.registerTask('jsTemplates', [
		'handlebars',
		'replace:jsTemplates'
	]); 
	
	// Picture Task (This task creates an additional JSON file with the path to your picture)
	grunt.registerTask('pictures', [
		'responsive_images',
		'imageSizeExport'
	]); 
	
	// Screenshot Tasks (Take screenshots from your environments)
	grunt.registerTask('photoLocal', [
		'photobox:local' // be sure grunt server is running
	]);
	grunt.registerTask('photoDev', [
		'photobox:dev'
	]);
	grunt.registerTask('photoProd', [
		'photobox:prod'
	]);	 
	
	// CSSComb Task (Beautify your SASS files)
	grunt.registerTask('beauty-scss', [
		'csscomb'
	]);

	/*
	 *	ADVANCED TASKS	
	 */
	grunt.registerTask('server', [
		'jsTemplates',
		'includes:js',
		'browserify:vendor',
		'browserify:dev',
		'mangony:dev',
		'concurrent:syncing',
		'watchCSS',
		'express:dev',
		'browserSync',
		'watch'
	]);
	
	grunt.registerTask('build', [
		'clean:dev',
		'jsTemplates',
		'includes:js',
		'browserify:vendor',
		'browserify:dist',
		'uglify',
		'concurrent:syncing', 
		'beauty-scss',
		'sassGlobber:dist',
		'sass:dev',
		'sass:universal',
		'combine_mq',
		//'postcssSeparator',
		'postcss:dist',
		'cssmin',
		'bless',
        'mangony:dist',
		'concurrent:hintAndDocs'
	]);

	grunt.registerTask('default', [
		'server'
	]);
	
	// alias serve by grunt convention
	grunt.registerTask('serve', [
		'server'
	]);
	
	grunt.registerTask('dist', [
		'clean',
		'version:patch',
		'build',
		'copy:dist'
	]); 
	

};
