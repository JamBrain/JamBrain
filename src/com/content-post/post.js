import {h, Component} 					from 'preact/preact';
import ContentSimple					from 'com/content-simple/simple';

//import $Node							from '../../shrub/js/node/node';

export default class ContentPost extends Component {
	constructor( props ) {
		super(props);
	}

	render( props ) {
		let {node, user, path, extra} = props;
		props = Object.assign({}, props);

		// Additional properties
		//props.authored = 1;

		if ( node ) {
			if ( node.subtype === 'news' ) {
				//props.header = "NEWS";
				props.by = "NEWS";
				props.headerIcon = "news";
				props.headerClass = "-col-c";
			}
			else if ( node.subtype === 'info' ) {
				//props.header = "INFO";
				props.by = "INFO";
				props.headerIcon = "info";
				props.headerClass = "-col-nddd";
			}
			else if ( node.subtype === 'guide' ) {
				//props.header = "GUIDE";
				props.by = "GUIDE";
				props.headerIcon = "article";
				props.headerClass = "-col-nddd";
			}
			else if ( node.subtype === 'promo' ) {
				//props.header = "INFO";
				//props.by = "INFO";
				props.headerIcon = "gift";
				props.headerClass = "-col-ab";
				if ( props.single ) {
					props.children = <div class="content-common-body -promo">You made it!</div>;
				}
				else {
					props.children = <div class="content-common-body -promo">Click here yo</div>;
				}
			}
		}

		props.limit = 1024*24;

		return <ContentSimple {...props} />;
	}
}
