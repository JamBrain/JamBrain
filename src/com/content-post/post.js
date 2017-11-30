import {h, Component} 					from 'preact/preact';
//import ShallowCompare	 				from 'shallow-compare/index';

//import NavSpinner						from 'com/nav-spinner/spinner';
//import NavLink 							from 'com/nav-link/link';
//import SVGIcon 							from 'com/svg-icon/icon';

//import ContentBody						from 'com/content-body/body';
//import ContentBodyMarkup				from 'com/content-body/body-markup';

//import ContentFooterButtonLove			from 'com/content-footer/footer-button-love';
//import ContentFooterButtonComments		from 'com/content-footer/footer-button-comments';

import ContentSimple					from 'com/content-simple/simple';

//import $Node							from '../../shrub/js/node/node';

export default class ContentPost extends Component {
	constructor( props ) {
		super(props);
	}

	render( props ) {
		props = Object.assign({}, props);

		var node = props.node;
		var user = props.user;
		var path = props.path;
		var extra = props.extra;

		// Additional properties
		//props.authored = 1;

		if ( node ) {
			if ( node.subtype === 'news' ) {
				props.header = "NEWS";
				props.headerClass = "-col-c";
			}
			else if ( node.subtype === 'info' ) {
				props.header = "INFO";
				props.headerClass = "-col-nddd";
			}
			else if ( node.subtype === 'guide' ) {
				props.header = "GUIDE";
				props.headerClass = "-col-nddd";
			}
		}

		props.limit = 1024*24;

		return <ContentSimple {...props} />;
	}
}
