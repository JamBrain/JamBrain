import { h, Component } 				from 'preact/preact';
//import ShallowCompare	 				from 'shallow-compare/index';

import NavSpinner						from 'com/nav-spinner/spinner';
import NavLink 							from 'com/nav-link/link';
import SVGIcon 							from 'com/svg-icon/icon';

//import ContentBody						from 'com/content-body/body';
//import ContentBodyMarkup				from 'com/content-body-markup/body-markup';
//
//import ContentFooterButtonLove			from 'com/content-footer/footer-button-love';
//import ContentFooterButtonComments		from 'com/content-footer/footer-button-comments';
//
//import $Node							from '../../shrub/js/node/node';
//

export default class ContentComments extends Component {
	constructor( props ) {
		super(props);
	}
	
	render( props, {} ) {
		var node = props.node;
		var user = props.user;
		var path = props.path;
		var extra = props.extra;
		
		return (
			<div class={['content-base','content-comments',props['no_gap']?'-no-gap':'',props['no_header']?'-no-header':'']}>
				<div class="-item -comment -indent-0">
					<div class="-avatar"><img src="http://static.jam.vg/other/logo/mike/Chicken64.png" /></div>
					<div class="-title"><span class="-author">Author</span> (<span class="-atname">@PoV</span>)</div>
					<div class="-body">{"They think I'm slow 'cause I'm from Canada 'eh"}</div>
					<div class="-nav"><div class="-reply"><SVGIcon>reply</SVGIcon> Reply</div> <div class="-edit"><SVGIcon>edit</SVGIcon> Edit</div> <div class="-love"><SVGIcon>heart</SVGIcon> 4</div></div>
				</div>
				<div class="-item -comment -indent-1">
					<div class="-avatar"><img src="http://static.jam.vg/other/logo/mike/Chicken64.png" /></div>
					<div class="-title"><span class="-author">Author</span> (<span class="-atname">@PoV</span>)</div>
					<div class="-body">{"They think I'm slow 'cause I'm from Canada 'eh"}</div>
					<div class="-nav"><div class="-reply"><SVGIcon>reply</SVGIcon> Reply</div> <div class="-edit"><SVGIcon>edit</SVGIcon> Edit</div> <div class="-love"><SVGIcon>heart</SVGIcon> 0</div></div>
				</div>
			</div>
		);
	}
}

