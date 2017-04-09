import { h, Component } 				from 'preact/preact';

export default class ContentError extends Component {
	constructor( props ) {
		super(props);
	}

	render( props ) {
		var Code = props.code ? props.code : '404';
		return (
			<div class="content-base content-error">
				<div class='-title'>{Code}</div>
				<div>{props.children}</div>
			</div>
		);
	}
}
