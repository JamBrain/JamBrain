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
//
//		if ( node /* && state.authors */ ) {
//			var Class = ["content-item-box"];
//
//			var Title = node.name;
//			
//			var CoverFail = '///content/internal/tvfail.png';
//			var Cover = (node.meta && node.meta.cover) ? node.meta.cover : CoverFail;
//
//			//Cover += '.192x192.jpg';
//
//			props.class = cN(Class, props.class);
//
//			//href={node.path}
//			return (
//				<ContentCommon {...props}>
//					<IMG2 class="-view" src={Cover} failsrc={CoverFail} />
//					<div class="-bar">
//						<div class="-title">{Title}</div>
//					</div>
//				</ContentCommon>
//			);
//		}
//		else {
//			return <ContentLoading />;
//		}
//	}
}
