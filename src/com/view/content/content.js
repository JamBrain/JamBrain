import {h, Component}					from 'preact/preact';

export default class ViewContent extends Component {
	render( props ) {
		return (
			<div id="content">
				{props.children}
			</div>
		);
	}
}
