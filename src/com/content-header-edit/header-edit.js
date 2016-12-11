import { h, Component } 				from 'preact/preact';

export default class ContentHeaderEdit extends Component {
	constructor( props ) {
		super(props);
	}

	shouldComponentUpdate( nextProps ) {
		return false;
	}

	render( {title, onmodify}, {} ) {
		return (
			<div class="content-header content-header-common content-header-edit">
				<input type="text" value={title} oninput={onmodify} placeholder="Titles can use **bold** markup" />
			</div>
		);
	}
}
