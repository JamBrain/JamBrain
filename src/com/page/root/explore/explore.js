import {h, Component}					from 'preact/preact';

export default class PageRootExplore extends Component {
	render( props ) {
		let {node, user, path, extra} = props;

		return (
			<div>
				<div>Exploration landing page goes here</div>
				<br />
				<div>Click the tabs above to explore</div>
			</div>
		);
	}
}
