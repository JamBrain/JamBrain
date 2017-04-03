import { h, Component } 				from 'preact/preact';
import SVGIcon 							from 'com/svg-icon/icon';

export default class ContentCommonFooterButtonEdit extends Component {
	constructor( props ) {
		super(props);

		this.onEdit = this.onEdit.bind(this);
	}
	
	onEdit( e ) {
	}

	render( {} ) {
		return (
			<div class="content-common-footer-button -edit" onclick={this.onEdit}>
				<SVGIcon>edit</SVGIcon>
			</div>
		);
	}
}
