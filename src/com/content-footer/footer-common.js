import {h, Component} 					from 'preact';

import ContentFooterButtonLove			from 'com/content-footer/footer-button-love';

export default class ContentFooterCommon extends Component {
	constructor( props ) {
		super(props);
	}

	render( {node, user, love} ) {
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
