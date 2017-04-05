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

		var Class = [];
		if ( props.class )
			Class.concat(props.class.split(' '));
		Class.push('-follow');
		
		var Icon = <SVGIcon class="if-not-hover-block">user</SVGIcon>;
		var HoverIcon = <SVGIcon class="if-hover-block">user-plus</SVGIcon>;
		var Text = <span>Follow</span>;

		// Following or Friend
		if ( false ) {
			HoverIcon = <SVGIcon class="if-hover-block">user-minus</SVGIcon>;
		}
		// Friend only
		if ( false ) {
			Text = <span>Friends</span>;
			Class.push('-friends');
		}
		// Following only
		else if ( false ) {
			Text = <span>Following</span>;
			Class.push('-following');
		}
		
//		if ( node && node.slug ) {
			return (
				<NavButton class={Class} onclick={this.onClick}>
					{Icon}
					{HoverIcon}
					{Text}
				</NavButton>
			);
//		}
//		else {
//			return <ContentLoading />;
//		}
	}
}
