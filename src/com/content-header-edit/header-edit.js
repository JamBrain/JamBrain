import { h, Component } 				from 'preact/preact';

export default class ContentHeaderEdit extends Component {
	constructor( props ) {
		super(props);
	}

//	shouldComponentUpdate( nextProps ) {
//		return false;
//	}

	render( {title, ontitle}, {} ) {
		return (
			<div class="content-header content-header-common content-header-edit">
				<input type="text" value={title} onchange={ontitle} />
			</div>
		);
	}
}
