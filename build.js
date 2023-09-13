#!/usr/bin/env bun
import * as esbuild from 'esbuild';

//	"esbuild src/public-ludumdare.com/main-ld.js --bundle --sourcemap --loader:.js=jsx --jsx=automatic --jsx-import-source=preact --jsx-dev --define:DEBUG=true --analyze --outfile=public-ludumdare.com/-/all.debug.js --target=es2021,chrome90,firefox90,safari14.5",
//  "esbuild src/public-ludumdare.com/main-ld.js --bundle --minify --sourcemap --loader:.js=jsx --jsx=automatic --jsx-import-source=preact --define:DEBUG=false --drop:debugger --analyze --legal-comments=external --outfile=public-ludumdare.com/-/all.min.js --target=es2021,chrome90,firefox90,safari14.5",

const ACTIONS = ['debug', 'release', 'live'];
let action = {};

if (process.argv.length > 2) {
	for (let idx = 2; idx < process.argv.length; idx++) {
		let newAction = process.argv[idx].toLowerCase().trim();
		if (ACTIONS.indexOf(newAction) != -1) {
			action[newAction] = true;
		}
		else {
			console.error('Unknown action: ' + newAction);
			process.exit(1);
		}
	}
}

console.log("Build started with actions:", action);

const nameExt = action.debug ? 'debug' : action.release ? 'min' : 'dev';
const esbuildOptions = {
	'entryPoints': [
		{'in': 'src/public-ludumdare.com/main-ld.js', 'out': `app.${nameExt}`}
	],
	'outdir': 'public-ludumdare.com/-/',
	'loader': { '.js': 'jsx' },
	'jsx': 'automatic',
	'jsxImportSource': 'preact',
	'jsxDev': action.debug ?? undefined,

	'bundle': true,
	'minify': action.release ?? undefined,
	'drop': action.release ? ['debugger'] : undefined,
	'legalComments': action.release ? 'external' : undefined,
	'sourcemap': true,
	'metafile':	true,	// required for debug information

	'define': {
		'DEBUG': `${action.debug ?? false}`,
	},

	'target': [
		'es2021',
		'chrome90',
		'firefox90',
		'safari14.5'
	]
};

if (action.live) {
	let context = await esbuild.context(esbuildOptions);
	console.log("Watching for changes... (press Ctrl+C to stop)");
	await context.watch();
}
else {
	console.time('esbuild.build');
	let result = await esbuild.build(esbuildOptions);
	console.timeEnd('esbuild.build');
	console.log(await esbuild.analyzeMetafile(result.metafile));
}
