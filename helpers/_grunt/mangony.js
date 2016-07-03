var config = require('../config');

module.exports = {
	options: {
		cwd: config.options.paths.src + '/templating/',
		dest: config.options.paths.dev,
		types: {
			data: {
				dir: '',
				files: [
					'data/**/*.json',
					'data/**/*.hjson',
					'partials/**/*.json',
					'partials/**/*.hjson'
				]
			},
			partials: {
				dir: 'partials',
				files: [
					'**/*.hbs'
				]
			},
			pages: {
				dir: 'pages',
				files: [
					'**/*.hbs'
				]
			},
			layouts: {
				dir: 'layouts',
				files: [
					'**/*.hbs'
				]
			}
		},
		helpers: [
			'helpers/*.js'
		]
	}, 
	dev: {
		options: { // If you want to speed up your development process set compileStaticFiles to false and activate devServer.start
			compileStaticFiles: true,
			devServer: {
				start: false,
				port: 3002
			},
			watch: true
		}
	}, 
	dist: {
		options: {
			compileStaticFiles: true,
			watch: false
		}
	}
};