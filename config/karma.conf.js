module.exports = function(config) {
	config.set({
		basePath: '../',

		plugins: [
			'karma-jasmine',
			'karma-chrome-launcher'
		],

		frameworks: ['jasmine'],

		files: [
		  'app/lib/angular/angular.js',
		  'app/lib/angular/angular-*.js',
		  'test/lib/angular/angular-mocks.js',
		  'app/js/**/*.js',
		  'test/unit/**/*.js'
		],

		autoWatch: true,

		browsers: ['Chrome'],

		junitReporter: {
		  outputFile: 'test_out/unit.xml',
		  suite: 'unit'
		}
	});
};