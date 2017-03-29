import { h, Component } 				from 'preact/preact';
//import ShallowCompare	 				from 'shallow-compare/index';

import NavSpinner						from 'com/nav-spinner/spinner';
import NavLink 							from 'com/nav-link/link';
import SVGIcon 							from 'com/svg-icon/icon';

//import ContentBody						from 'com/content-body/body';
//import ContentBodyMarkup				from 'com/content-body-markup/body-markup';
//
//import ContentFooterButtonLove			from 'com/content-footer/footer-button-love';
import ContentFooterButtonComments		from 'com/content-footer/footer-button-comments';

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

		var FooterItems = [];
		if ( !props['no_comments'] )
			FooterItems.push(<ContentFooterButtonComments href={path} node={node} wedge_left_bottom />);
		
		return (
			<div class={['content-base','content-comments',props['no_gap']?'-no-gap':'',props['no_header']?'-no-header':'']}>
				<div class="-headline">COMMENTS</div>
				<div class="-item -comment -indent-0">
					<div class="-avatar"><img src="http://static.jam.vg/other/logo/mike/Chicken64.png" /></div>
					<div class="-body">
						<div class="-title"><span class="-author">Mike Kasprzak</span> (<span class="-atname">@PoV</span>)</div>
						<div class="-text">{"This is a sample comment. Sorry, you can't actually make comments yet."}</div>
						<div class="-nav">
							<div class="-love"><SVGIcon>heart</SVGIcon> 1</div>
							<div class="-reply"><SVGIcon>reply</SVGIcon> Reply</div>
							<div class="-edit"><SVGIcon>edit</SVGIcon> Edit</div>
						</div>
					</div>
				</div>
				<div class="-indent">
					<div class="-item -comment -indent-1">
						<div class="-avatar"><img src="http://static.jam.vg/other/logo/mike/Chicken64.png" /></div>
						<div class="-body">
							<div class="-title"><span class="-author">Mike Kasprzak</span> (<span class="-atname">@PoV</span>)</div>
							<div class="-text">{"Wow, this is a sample reply to that comment"}</div>
							<div class="-nav">
								<div class="-love"><SVGIcon>heart</SVGIcon> 0</div>
								<div class="-reply"><SVGIcon>reply</SVGIcon> Reply</div>
								<div class="-edit"><SVGIcon>edit</SVGIcon> Edit</div>
							</div>
						</div>
					</div>
					<div class="-item -comment -indent-1">
						<div class="-avatar"><img src="http://static.jam.vg/other/logo/mike/Chicken64.png" /></div>
						<div class="-body">
							<div class="-title"><span class="-author">Mike Kasprzak</span> (<span class="-atname">@PoV</span>)</div>
							<div class="-text">{"Double wow! This is another reply."}<br /><br />{"Amazing!"}</div>
							<div class="-nav">
								<div class="-love"><SVGIcon>heart</SVGIcon> 0</div>
								<div class="-reply"><SVGIcon>reply</SVGIcon> Reply</div>
								<div class="-edit"><SVGIcon>edit</SVGIcon> Edit</div>
							</div>
						</div>
					</div>
				</div>
				<div class="-item -comment -indent-0">
					<div class="-avatar"><img src="http://static.jam.vg/other/logo/mike/Chicken64.png" /></div>
					<div class="-body">
						<div class="-title"><span class="-author">Mike Kasprzak</span> (<span class="-atname">@PoV</span>)</div>
						<div class="-text">{"I was late to the party"}</div>
						<div class="-nav">
							<div class="-love"><SVGIcon>heart</SVGIcon> 0</div>
							<div class="-reply"><SVGIcon>reply</SVGIcon> Reply</div>
							<div class="-edit"><SVGIcon>edit</SVGIcon> Edit</div>
						</div>
					</div>
				</div>
				<div class="content-footer content-footer-common -footer">
					<div class="-left">
					</div>
					<div class="-right">
			  			{FooterItems}
			  		</div>
				</div>
			</div>
		);
	}
}

