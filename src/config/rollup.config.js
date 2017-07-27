import includePaths		from 'rollup-plugin-includepaths';
//import nodeResolve	from 'rollup-plugin-node-resolve';
import nodent			from 'rollup-plugin-nodent';

export default {
	'format': 'es',
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
		nodent({
			'promises': true,
			'noRuntime': true,
			//'sourcemap': true,
			//'es6target': true,
		}),
//		nodeResolve({
//			'jsnext': true
//		}),
	]
};
