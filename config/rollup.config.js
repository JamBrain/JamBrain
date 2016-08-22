import includePaths from 'rollup-plugin-includepaths';
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
//		nodeResolve({
//			jsnext: true
//		}),
	]
};
