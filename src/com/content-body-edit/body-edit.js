import { h, Component } 				from 'preact/preact';

export default class ContentBodyEdit extends Component {
	constructor( props ) {
		super(props);
	}

	shouldComponentUpdate( newProps, newState ) {
		return false;
	}

	render( {children, onmodify}, {} ) {
		var PlaceholderText = "Use GitHub-style markup, and emoji codes :like_this: :smile:";

		return (
			<div class="content-body content-body-common content-body-edit">
				<div class="-label">Description</div>
				<div class="-textarea"><textarea name="paragraph_text" rows="12" value={children} oninput={onmodify} placeholder={PlaceholderText} /></div>
			</div>
		);
	}
}
