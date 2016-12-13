import { h, Component } 				from 'preact/preact';
import { shallowDiff }	 				from 'shallow-compare/index';

import ContentFooterButtonLove			from 'com/content-footer-button-love/footer-button-love';

export default class ContentFooterCommon extends Component {
	constructor( props ) {
		super(props);
	}

//	shouldComponentUpdate( nextProps ) {
//		return shallowDiff(this.props.love, nextProps.love);
//	}

	render( {node, user, love}, state ) {
		var ShowLove = null;
		if ( love ) {
			ShowLove = <ContentFooterButtonLove node={node} user={user} wedge_left_bottom />;
		}
		
		return (
			<div class="content-footer content-footer-common">
				<div class="-left">
				</div>
				<div class="-right">
		  			{ShowLove}
		  		</div>
			</div>
		);
	}
}
