import includePaths		from 'rollup-plugin-includepaths';
//import nodeResolve	from 'rollup-plugin-node-resolve';
//import nodent			from 'rollup-plugin-nodent';

export default {
	'output': {
		'format': 'es'
	},
	'plugins': [
		includePaths({
			'paths': [
				'.output',
				'.output/external',
				'.output/custom',
			],
//			'include': {
//				'preact':'output/external/preact/preact.o.js'
//			},
			'extensions': ['.es6.js'],
		}),

		// Sorry, we need to temporarily disable this, until nodent fully supports rest-spread
//		nodent({
//			'promises': true,
//			'noRuntime': true,
//			//'sourcemap': true,
//			//'es6target': true,
//		}),

//		nodeResolve({
//			'jsnext': true
//		}),
	]
};
