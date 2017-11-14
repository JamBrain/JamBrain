import {h, Component} 					from 'preact/preact';
import DialogCommon						from 'com/dialog/common/common';

export default class DialogSubmit extends Component {
	constructor( props ) {
		super(props);

		this.onClick = this.onClick.bind(this);
	}

	onClick( e ) {
		window.location.href = window.location.pathname;
	}

	render( props, {} ) {
		return (
			<DialogCommon title="Publish Game" ok explicit onok={this.onClick}>
				<div>Game Successsfully Published :D</div>
			</DialogCommon>
		);
	}
}
