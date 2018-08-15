import {h, Component} 					from 'preact/preact';
import DialogCommon						from 'com/dialog/common/common';

export default class DialogErrorUpload extends Component {
	constructor( props ) {
		super(props);
	}

	render( props ) {

		let message = decodeURI(props.extra);

		return (
			<DialogCommon title="Upload failed" ok>
				<p>Looks like the upload failed.</p>
				<ul>
					<li>Make sure your image is under 4MB</li>
					<li>Make sure the image you're trying to upload is a bitmap (png, jpeg, gif). Vector images (svg) are not supported at the current time</li>
				</ul>
				<p>Error: <i>{message}</i></p>
			</DialogCommon>
		);
	}
}
