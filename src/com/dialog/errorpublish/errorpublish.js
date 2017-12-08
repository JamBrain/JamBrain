import {h, Component} 					from 'preact/preact';
import DialogCommon						from 'com/dialog/common/common';

export default class DialogErrorPublish extends Component {
	constructor( props ) {
		super(props);
	}

	render( props ) {

		let message = decodeURI(props.extra);

		return (
			<DialogCommon title="Publish failed" ok>
				<p>Looks like publishing failed.</p>
				<p>Error: <i>{message}</i></p>
			</DialogCommon>
		);
	}
}
