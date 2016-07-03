module.exports = {
	livereload: {
		files: [
			'<%= paths.dev %>/**/*.html',
			'<%= paths.src %>/templating/**/*',
			'<%= paths.dev %>/css/**/*.css',
			'<%= paths.dev %>/js/**/*.js'
		],
		options: {
			livereload: true
		}
	},
	express: {
		files: [
			'./server/**/*.js'
		],
		tasks: ['express:dev'],
		options: {
			spawn: false
		}
	},
	ajax: {
		files: '<%= paths.src %>/ajax/**/*.{json,html}',
		tasks: 'sync:ajax'
	},
	assets: {
		files: [
			'<%= paths.src %>/assets/**/*'
			],
		tasks: 'sync:assets'
	},
	scss: {
		files: '<%= paths.src %>/scss/**/*',
		tasks: [
			'sass:dev'
		],
	    options: {
			spawn: false
		}
	},
	universal: {
		files: '<%= paths.src %>/scss/universal.scss',
		tasks: 'sass:universal'
	}
};