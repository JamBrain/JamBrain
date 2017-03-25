import { h, Component } 				from 'preact/preact';

export default class ContentGroup extends Component {
	constructor( props ) {
		super(props);
	}

	render( {children} ) {
		return (
			<div class="content-base content-404">
				<div class='-title'>404</div>
				<div>{children}</div>
			</div>
		);
	}
}
