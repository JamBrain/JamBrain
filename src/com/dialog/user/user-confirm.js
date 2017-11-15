import {h, Component} 					from 'preact/preact';
import DialogCommon						from 'com/dialog/common/common';

export default class DialogUserConfirm extends Component {
	constructor( props ) {
		super(props);

		this.onClick = this.onClick.bind(this);
	}

	onClick( e ) {
		location.href = location.pathname+location.search;
	}

	render( props ) {
		return (
			<DialogCommon title="Cookie Problem" ok explicit onok={this.onClick}>
				<div>{"If you are seeing this message, then we were not able to set your login cookie."}</div>
				<div>Please whitelist <code>https://api.ludumdare.com</code> (and <code>https://api.jam.vg</code>) so we can log you in.</div>
			</DialogCommon>
		);
	}
}
