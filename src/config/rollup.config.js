import includePaths from 'rollup-plugin-includepaths';
import nodent from 'rollup-plugin-nodent';
import buble from 'rollup-plugin-buble';
//import nodeResolve from 'rollup-plugin-node-resolve';

export default {
	plugins: [
		includePaths({
			paths: [
				'.output',
				'.output/external',
				'.output/custom',
			],
//			include: {
//				'preact':'output/external/preact/preact.o.js'
//			},
			extensions:['.es6.js'],
		}),
		nodent(),
//		nodeResolve({
//			jsnext: true
//		}),
	]
};
