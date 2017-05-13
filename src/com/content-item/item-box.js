import { h, Component } 				from 'preact/preact';

import ContentLoading					from 'com/content-loading/loading';

import ContentBox						from 'com/content-box/box';

export default class ContentItemBox extends Component {
	constructor( props ) {
		super(props);
	}

	render( props, state ) {
		props = Object.assign({}, props);
		
		var node = props.node;
		var user = props.user;
		var path = props.path;
		var extra = props.extra;
		
		return <ContentBox {...props} />;
	}
}
