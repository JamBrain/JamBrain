import {h, Component} 				from 'preact';

export default class ContentFooterEdit extends Component {
	constructor( props ) {
		super(props);
	}

	shouldComponentUpdate( nextProps ) {
		return false;
	}

	render( {}, {} ) {
		return (
			<div class="content-footer content-footer-common content-footer-edit" />
		);
	}
}
