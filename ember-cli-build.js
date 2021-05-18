'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function (defaults) {
	let app = new EmberApp(defaults, {
		'ember-bootstrap': {
			bootstrapVersion: 4,
			importBootstrapCSS: false
		},
		babel: {
			// enable "loose" mode
			loose: true,
			// don't transpile generator functions
			// exclude: ['./node_mudules/mapbox-gl'],
			// plugins: [
			// 	require.resolve('transform-object-rest-spread')
			// ]
		},
		autoImport: {
			exclude: ['./node_modules/mapbox-gl/dist/mapbox-gl.js'],
			skipBabel: [
				{
					// when an already-babel-transpiled package like "mapbox-gl" is
					// not skipped, it can produce errors in the production mode
					// due to double transpilation
					package: 'mapbox-gl',
					semverRange: '*',
				},
			],
		},
	});

	// Use `app.import` to add additional libraries to the generated
	// output files.
	//
	// If you need to use different assets in different
	// environments, specify an object as the first parameter. That
	// object's keys should be the environment name and the values
	// should be the asset to use in that environment.
	//
	// If the library that you are including contains AMD or ES6
	// modules that you would like to import into your application
	// please specify an object with the list of modules as keys
	// along with the exports of each module as its value.

	return app.toTree();
};
