var libs = [ 
	'jquery',
	'exoskeleton',
	'handlebars',
	'respimage',
	'jquery-touchswipe'
];

module.exports = {
	options: {
		transform: [
			[
				"babelify", {
					"presets": ["es2015"]
				}
			]
		]
	},
	vendor: {
		src: ['.'],
		dest: '<%= paths.dev %>/js/vendor/libs.js',
		options: {
			debug: false,
			alias: libs,
			external: [
				'underscore'
			]
		}
	},
	dev: {
		options: {
			external: libs,
			browserifyOptions: {
				debug: true
			},
			watch: true
		},
		files: {
			'<%= paths.dev %>/js/main.js': '<%= paths.src %>/js/main.js'
		}
	},
	dist: {
		files: {
			'<%= paths.dev %>/js/main.js': '<%= paths.src %>/js/main.js'
		}
	}
};