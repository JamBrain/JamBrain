import {h, Component}					from 'preact/preact';

export default class ViewFooter extends Component {
	constructor( props ) {
		super(props);
	}

	render( /*props, state*/ ) {
		return (
			<div id="footer">
				privacy policy | terms of use
			</div>
		);
	}
}
