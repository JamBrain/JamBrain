import { h, Component } 				from 'preact/preact';

import SVGIcon							from 'com/svg-icon/icon';
import ContentLoading					from 'com/content-loading/loading';

import NavButton						from 'com/content-common/common-nav-button';

export default class ContentCommonNavButtonFollow extends Component {
	constructor( props ) {
		super(props);
		
		this.state = {
		};
		
		this.onClick = this.onClick.bind(this);
	}

	onClick( e ) {
		console.log("Click");
	}

	render( props ) {
		var node = props.node;
		var user = props.user;
//		var path = props.path;
//		var extra = props.extra;
		
		
//		if ( node && node.slug ) {
			return (
				<NavButton onclick={this.onClick}>
					<SVGIcon class="if-not-hover-block">user</SVGIcon><SVGIcon class="if-hover-block">user-plus</SVGIcon> Follow
				</NavButton>
			);
//		}
//		else {
//			return <ContentLoading />;
//		}
	}
}
