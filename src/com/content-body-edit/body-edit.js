import { h, Component } 				from 'preact/preact';

export default class ContentBodyEdit extends Component {
	constructor( props ) {
		super(props);
	}

	shouldComponentUpdate( newProps, newState ) {
		return false;
	}

	render( {children, onmodify}, {} ) {
		return (
			<div class="content-body content-body-common content-body-edit">
				<div><textarea name="paragraph_text" rows="12" value={children} oninput={onmodify} /></div>
			</div>
		);
	}
}
