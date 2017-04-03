import { h, Component } 				from 'preact/preact';
import SVGIcon 							from 'com/svg-icon/icon';
import NavLink 							from 'com/nav-link/link';
import ButtonBase						from 'com/button-base/base';

//import ContentSimple					from 'com/content-simple/simple';

import ContentBodyMarkup				from 'com/content-body/body-markup';

import ContentFooterButtonStar			from 'com/content-footer/footer-button-star';

import ContentCommon					from 'com/content-common/common';
import ContentCommonBodyTitle			from 'com/content-common/common-body-title';
import ContentCommonBodyAvatar			from 'com/content-common/common-body-avatar';
import ContentCommonBodyMarkup			from 'com/content-common/common-body-markup';

import $NodeStar						from '../shrub/js/node/node_star';


export default class ContentUser extends Component {
	constructor( props ) {
		super(props);
		
//		this.state = {
//			'following': null,
//			'hasClicked': null
//		};
//		
//		this.onFollow = this.onFollow.bind(this);
//		this.onUnfollow = this.onUnfollow.bind(this);
//		this.onUnfriend = this.onUnfriend.bind(this);
	}
	
	onFollow( e ) {
		//console.log("Follow");
		$NodeStar.Add(this.props.node.id)
		.then(r => {
			//console.log('win', r);
			this.setState({ 'hasClicked': true, 'following': true });
			
			// TODO: Tell parent user has changed
		})
		.catch(err => {
			this.setState({'error':err});
		});
	}
	onUnfollow( e ) {
		//console.log("Unfollow");
		$NodeStar.Remove(this.props.node.id)
		.then(r => {
			//console.log('wooon', r);
			this.setState({ 'hasClicked': true, 'following': false });
			
			// TODO: Tell parent user has changed
		})
		.catch(err => {
			this.setState({'error':err});
		});
	}
	onUnfriend( e ) {
		//console.log("Unfriend");
		this.onUnfollow(e);
	}
	
	render( props, {hasClicked, following, error} ) {
		var node = props.node;
		var user = props.user;
		var path = props.path;
		var extra = props.extra;


		if ( node && node.slug ) {
			props.class = typeof props.class == 'string' ? props.class.split(' ') : [];
			props.class.push("content-user");
			props.header = "USER";
			props.headerClass = "-col-b";
			if ( user.id && (node.id !== user.id) )
				props.star = 1;
			if ( user.id && (node.id === user.id) )
				props.edit = 1;
				
			return (
				<ContentCommon {...props}>
					<ContentCommonBodyAvatar src={node.meta.avatar ? node.meta.avatar : ''} />
					<ContentCommonBodyTitle href={path} title={node.meta['real-name'] ? node.meta['real-name'] : node.name} subtitle={'@'+node.name} />
					<ContentCommonBodyMarkup class="-block-if-not-minimized">{node.body}</ContentCommonBodyMarkup>
					{props.children}
				</ContentCommon>
			);
		}
		else {
			return <ContentLoading />;
		}
		
//		return <ContentSimple path={path} node={node} user={user} header="USER" headerClass="-col-b" minmax>{props.children}</ContentSimple>;
		
		
		if ( node.slug ) {
			var dangerousParsedBody = { __html:marked.parse(node.body) };
			var dangerousParsedTitle = { __html:titleParser.parse('**User:** `'+node.name+'`') };
			
			var avatar = STATIC_ENDPOINT + ((node.meta && node.meta.avatar) ? node.meta.avatar : '/other/dummy/user64.png');
			
			var url = '/users/'+node.slug+'/';
			
			//console.log('fee', user);
			
			let ShowFollow = [];
			if ( user && user.id && node.id !== user.id ) {
				if ( hasClicked ? following : user.private && user.private.link && user.private.link.star && user.private.link.star.indexOf(node.id) !== -1 ) {
					if ( user.private.refs.star && user.private.refs.star.indexOf(node.id) !== -1 ) {
						ShowFollow = <ButtonBase class="-button -green" onclick={this.onUnfriend}><SVGIcon class="if-not-hover-block">users</SVGIcon><SVGIcon class="if-hover-block">user-minus</SVGIcon> Friend</ButtonBase>;
					}
					else {
						ShowFollow = <ButtonBase class="-button -blue" onclick={this.onUnfollow}><SVGIcon class="if-not-hover-block">user-check</SVGIcon><SVGIcon class="if-hover-block">user-minus</SVGIcon> Following</ButtonBase>;
					}
				}
				else {
					ShowFollow = <ButtonBase class="-button" onclick={this.onFollow}><SVGIcon class="if-not-hover-block">user</SVGIcon><SVGIcon class="if-hover-block">user-plus</SVGIcon> Follow</ButtonBase>;
				}
			}
//				<ButtonBase class="-button -blue" onclick={this.onUnfollow}><SVGIcon class="if-not-hover-block">user-check</SVGIcon><SVGIcon class="if-hover-block">user-minus</SVGIcon> Followed</ButtonBase>,
//				<ButtonBase class="-button -green" onclick={this.onUnfriend}><SVGIcon class="if-not-hover-block">users</SVGIcon><SVGIcon class="if-hover-block">user-minus</SVGIcon> Friend</ButtonBase>
//			];


			var FooterItems = [];
			if ( !props['no_star'] )
				FooterItems.push(<ContentFooterButtonStar user={user} node={node} wedge_left_bottom />);
			
			return (
				<div class="content-base content-common content-user">
					<div class='-headline -col-ab'>USER</div>
					<div class="-header">
						<div class="-avatar"><img src={avatar} /></div>
						<div class="-title _font2"><NavLink href={url} dangerouslySetInnerHTML={dangerousParsedTitle} /></div>
						<div class="-link"><strong>Link:</strong> <input type="text" value={"https://ldjam.com"+url} readonly /></div>
					</div>
					<div class="-body -nav">
						{ShowFollow}
					</div>
					<ContentBodyMarkup class="fudge">{node.body}</ContentBodyMarkup>
					<div class="content-footer content-footer-common -footer">
						<div class="-left">
							<div class="-minmax _hidden" onclick={this.onMinMax}>
								<SVGIcon>arrow-up</SVGIcon>
							</div>
						</div>
						<div class="-right">
							{FooterItems}
				  		</div>
					</div>
				</div>
			);
		}
		else {
			return (
				<div class="content-base content-post">
					{ error ? error : "Please Wait..." }
				</div>
			);
		}
	}

//					<div class="-body markup" dangerouslySetInnerHTML={dangerousParsedBody} />

//							<div class="-minmax"><SVGIcon>arrow-up</SVGIcon></div>
//							<div class="-edge"><SVGIcon>wedge-left</SVGIcon></div>

//							<div class="-edge"><SVGIcon>wedge-right</SVGIcon></div>
//							<div class="-heart"><SVGIcon>heart-check</SVGIcon></div>
//							<div class="-text -heart-count">0</div>
//							<div class="-spacer"><SVGIcon>wedge-right</SVGIcon></div>
//							<div class="-comment"><SVGIcon>bubble-empty</SVGIcon></div>
//							<div class="-text -comment-count">0</div>
//							<div class="-spacer2"><SVGIcon>wedge-right</SVGIcon></div>
//							<div class="-gear"><SVGIcon>cog</SVGIcon></div>

/*
		var user = props.node;//CoreData.getNodeById( props.node );
		
		var hasTwitter = user.meta.twitter ? <span class="-twitter"> (<a href={"https://twitter.com/"+user.meta.twitter} target="_blank" rel="noopener noreferrer" title={"https://twitter.com/"+user.meta.twitter}><SVGIcon baseline small>twitter</SVGIcon>/{user.meta.twitter}</a>)</span> : <span />;
//		var hasTeam = props.user.team ? <span class="-team"> of <em>{props.user.team}</em> <SVGIcon>users</SVGIcon></span> : <span />;
		
		// Build URL //
		// TODO: append trailing '/' to base if missing
		var url = '/u/'+user.slug+'/';
		// TODO: if single post mode, prefix with '../'
		
//		function parseNames( str ) {
//			// Dummy: Use Global Object //
//			var users = {
//				'pov': {
//					name:'PoV',
//					slug:'pov',
//					avatar:'/other/logo/mike/Chicken64.png',
//					twitter:'mikekasprzak',
//				}
//			};
//			
//			return str.replace(/@([A-Za-z][A-Za-z0-9-]*)/g,function(original,p1,offset,s) {
//				//console.log(match,p1,offset);
//				var name = p1.toLowerCase();
//				if ( users[name] ) {
//					return "<span class='inline-name'><img src='//"+STATIC_DOMAIN+users[name].avatar+"'><a href='/u/"+users[name].slug+"'>"+users[name].name+"</a></span>";
//				}
//				else {
//					return original;
//				}
//			});
//			
//			// TODO: attach the Navigation link code to the <a> tag above //
//		}

		var dangerousParsedBody = { __html:marked.parse(user.body) };
		var dangerousParsedTitle = { __html:titleParser.parse(user.name) };
		
		var avatar = user.meta.avatar ? "//"+STATIC_DOMAIN+user.meta.avatar : "";
		
		return (
			<div class="content-base content-user">
				<div class="-header">
					<div class="-avatar"><img src={avatar} /></div>
					<div class="-title _font2"><NavLink href={url} dangerouslySetInnerHTML={dangerousParsedTitle} /></div>
				</div>
				<div class="-body markup" dangerouslySetInnerHTML={dangerousParsedBody} />
				<div class="-footer">
					<div class="-left">
						<div class="-minmax"><SVGIcon>arrow-up</SVGIcon></div>
						<div class="-edge"><SVGIcon>wedge-left</SVGIcon></div>
					</div>
					<div class="-right">
						<div class="-edge"><SVGIcon>wedge-right</SVGIcon></div>
						<div class="-heart"><SVGIcon>heart-check</SVGIcon></div>
						<div class="-text -heart-count">0</div>
						<div class="-spacer"><SVGIcon>wedge-right</SVGIcon></div>
						<div class="-comment"><SVGIcon>bubble-empty</SVGIcon></div>
						<div class="-text -comment-count">0</div>
						<div class="-spacer2"><SVGIcon>wedge-right</SVGIcon></div>
						<div class="-gear"><SVGIcon>cog</SVGIcon></div>
					</div>
				</div>
			</div>
		);
	}
	// body: unmagin-top, unmargin-bottom. replace with selector
*/	
}

//marked.setOptions({
//	highlight: function( code, lang ) {
//		var language = Prism.languages.clike;
//		if ( Prism.languages[lang] )
//			language = Prism.languages[lang];
//		return Prism.highlight( code, language );
//	},
//	sanitize: true,			// disable HTML //
//	smartypants: true,		// enable automatic fancy quotes, ellipses, dashes //
//});
