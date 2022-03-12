import {h, Component}					from 'preact/preact';

export default class ViewContent extends Component {
	render( props ) {
		return (
			<main id="content">
				{props.children}
			</main>
		);
	}
}
