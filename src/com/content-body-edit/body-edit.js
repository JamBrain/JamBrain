import { h, Component } 				from 'preact/preact';

export default class ContentBodyEdit extends Component {
	constructor( props ) {
		super(props);
	}

	shouldComponentUpdate( newProps, newState ) {
		return false;
	}

	render( {children, onmodify}, {} ) {
		var PlaceholderText = "Use GitHub-style markup (**bold** _italics_ ~~del~~ `code`), and emoji codes :like_this: :smile:\n\n# This is a header\n\n* Item 1\n* Item 2\n\n```\nprintf(\"Hello World\");\n```\n\n## Embed things like this:\n\nhttps://www.youtube.com/watch?v=dQw4w9WgXcQ\n\n(though only YouTube is supported right now)";

		return (
			<div class="content-body content-body-common content-body-edit">
				<div class="-label">Description</div>
				<div class="-textarea"><textarea name="paragraph_text" rows="18" value={children} oninput={onmodify} placeholder={PlaceholderText} /></div>
			</div>
		);
	}
}
