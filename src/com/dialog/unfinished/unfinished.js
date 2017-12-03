import {h, Component} 					from 'preact/preact';
import DialogCommon						from 'com/dialog/common/common';

export default class DialogUnfinished extends Component {
	constructor( props ) {
		super(props);
	}

	render( props ) {
		return (
			<DialogCommon title="Unavailable" ok>
				<div>Sorry. This feature is unavailable at this time.</div>
			</DialogCommon>
		);
	}
}
