import { h, Component } 				from 'preact/preact';

import ContentLoading					from 'com/content-loading/loading';

import ButtonFollow						from 'com/content-common/common-nav-button-follow';

export default class ContentCommonNav extends Component {
	constructor( props ) {
		super(props);
	}


	render( props, {error} ) {
		var node = props.node;
		var user = props.user;
		var path = props.path;
		var extra = props.extra;
		
		if ( node && node.slug ) {
			return (
				<div class="content-common-body content-common-nav">
					<ButtonFollow />
				</div>
			);
		}
		else {
			return <ContentLoading />;
		}
	}
}
