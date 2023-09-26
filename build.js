#!/usr/bin/env bun
// For fastest builds, install bun and invoke with `./build.js`. Otherwise, build with `node build.js`.
//
// We also recommend you create ~/.bunfig.toml with the following configuration:
//
// [install.lockfile]
// path = ".bunfig.lockb"
// savePath = ".bunfig.lockb"

import * as esbuild from 'esbuild';
import { lessLoader } from 'esbuild-plugin-less';


const VALID_ACTIONS = ['debug', 'release', 'live', 'quiet'];
let action = {};

if (process.argv.length > 2) {
	for (let idx = 2; idx < process.argv.length; idx++) {
		let newAction = process.argv[idx].toLowerCase().trim();
		if (VALID_ACTIONS.indexOf(newAction) !== -1) {
			action[newAction] = true;
		}
		else {
			console.error('Unknown action: ' + newAction);
			process.exit(1);
		}
	}
}
if (!action.release) {
	action.debug = true;
}


const buildMode = action.debug ? 'debug' : action.release ? 'min' : 'dev';
console.log(`[${new Date().toLocaleTimeString()}] build.js initialized in '${buildMode}' mode.`);// with actions:`, action);


const esbuildOptions = {
	'entryPoints': [
		{'in': 'src/public-ludumdare.com/main-ld.js', 'out': `app.${buildMode}`}
	],
	'outdir': 'public-ludumdare.com/-/',
	'loader': {
		'.js': 'jsx'
	},
	'jsx': 'automatic',
	'jsxImportSource': 'preact',
	'jsxDev': action?.release ? undefined : true,

	'bundle': true,
	'minify': action?.release ? true : undefined,
	'drop': action.release ? ['debugger'] : undefined,
	'legalComments': 'none', //action.release ? 'external' : undefined,
	'sourcemap': true,
	'metafile':	true,	// required for debug information

	'define': {
		'DEBUG': `${action.debug ?? false}`,
		'LIVE': `${action.live ?? false}`
	},

	'target': [
		'es2021',
		'chrome90',
		'firefox90',
		'safari14.5'
	],

	'plugins': [
		{
			'name': "InternalBuildLogging",
			'setup': (build) => {
				build.onStart(() => {
					console.log(`[${new Date().toLocaleTimeString()}] Build started.`);
					console.time('Build time');
				});

				build.onEnd((r) => {
					console.timeEnd('Build time');
					if (r.errors.length > 0) {
						console.log(`[${new Date().toLocaleTimeString()}] Build failed with ${r.errors.length} error(s).`);
					}
					else {
						console.log(`[${new Date().toLocaleTimeString()}] Build finished successfully.`);
					}
				});
			}
		},
		lessLoader({
			'paths': [
				'src',
				'src/public-ludumdare.com'
			],
			'globalVars': {
				'STATIC_DOMAIN': '"static.jammer.work"'
			}
		}),
/*
		stylePlugin({
			'renderOptions': {
				'lessOptions': {
					'paths': [
						'src',
						'src/public-ludumdare.com'
					],
					'globalVars': {
						'STATIC_DOMAIN': '"static.jammer.work"'
					}
				}
			}
		}),
*/
	]
};

if (action.live) {
	let context = await esbuild.context(esbuildOptions);

	// Begin watching and serving
	await context.watch();
	let { port } = await context.serve({
		'onRequest': async (args) => {
			console.log(`[${new Date().toLocaleTimeString()}] New request from ${args.remoteAddress}`);
		}
	});
	console.log(`[${new Date().toLocaleTimeString()}] Live coding server started. Press Ctrl+C to stop. URL: http://ldjam.work/?debug=${port}`);
	if (global.Bun) {
		console.error("Warning: Connections to the live coding server may not work with Bun.\nTry `node ./build.js live` instead.");
	}

	// Handle Ctrl+C
	process.on('SIGINT', async () => {
		console.log('');	// newline
		console.log(`[${new Date().toLocaleTimeString()}] Stopping...`);
		await context.dispose();
		console.log(`[${new Date().toLocaleTimeString()}] Done.`);
		process.exit();
	});
}
else {
	await esbuild.build(esbuildOptions)
		.then(async (result) => {
			if (!action.quiet) {
				console.log(await esbuild.analyzeMetafile(result.metafile));
			}
		})
		.catch(async (error) => {
			//console.log(error);
		});
}
