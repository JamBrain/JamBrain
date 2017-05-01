import { h, Component } 				from 'preact/preact';
//import SVGIcon 							from 'com/svg-icon/icon';
//import NavLink 							from 'com/nav-link/link';
//import ButtonBase						from 'com/button-base/base';

import ContentSimple					from 'com/content-simple/simple';

//import ContentBodyMarkup				from 'com/content-body/body-markup';

//import ContentFooterButtonStar			from 'com/content-footer/footer-button-star';

import ContentLoading					from 'com/content-loading/loading';
import ContentError						from 'com/content-error/error';

import ContentCommon					from 'com/content-common/common';
import ContentCommonBodyTitle			from 'com/content-common/common-body-title';
import ContentCommonBodyBy				from 'com/content-common/common-body-by';
import ContentCommonBodyAvatar			from 'com/content-common/common-body-avatar';
import ContentCommonBodyMarkup			from 'com/content-common/common-body-markup';

import ContentCommonNav					from 'com/content-common/common-nav';
import ButtonFollow						from 'com/content-common/common-nav-button-follow';


import ContentCommonEdit				from 'com/content-common/common-edit';

import $Node							from '../shrub/js/node/node';
//import $NodeStar						from '../shrub/js/node/node_star';


export default class ContentUser extends Component {
	constructor( props ) {
		super(props);
		
//		this.state = {
//			'editing': this.isEditMode(),
//			'modified': false,
//			
//			'body': props.node.body,
//		};
//
//		this.onEdit = this.onEdit.bind(this);
//		this.onPreview = this.onPreview.bind(this);
//		this.onSave = this.onSave.bind(this);
//		this.onPublish = this.onPublish.bind(this);
//
//		this.onModifyText = this.onModifyText.bind(this);
	}
	
//	onEdit( e ) {
//		this.setState({'editing': true});
//	}
//	onPreview( e ) {
//		this.setState({'editing': false});
//	}
//	onSave( e ) {
//		//var Name = /*this.state.title ? this.state.title :*/ this.props.node.name;
//		var Body = this.state.body ? this.state.body : this.props.node.body;
//		
//		return $Node.Update(this.props.node.id, null, Body)
//		.then(r => {
//			if ( r.status == 200 ) {
//				this.setState({ 'modified': false });
//			}
//			else {
//				if ( r.caller_id == 0 || (r.data && r.data.caller_id == 0) ) {
//					location.hash = "#savebug";
//				}
//				else {
//					this.setState({ 'error': r.status + ": " + r.error });
//				}
//			}
//		})
//		.catch(err => {
//			console.log(err);
//			this.setState({ 'error': err });
//		});
//	}
//	onPublish( e ) {
//		console.log( e );
//	}
//
//	onModifyText( e ) {
//		this.setState({'modified': true, 'body': e.target.value});
//	}

	isEditMode() {
		var extra = this.props.extra;
		return extra && extra.length && extra[extra.length-1] == 'edit';
	}

	render( props, state ) {
		props = Object.assign({}, props);	// Shallow copy we can change props
		
		var node = props.node;
		var user = props.user;
		var path = props.path;
		var extra = props.extra;
		
		var IsHome = false;
		if ( extra && extra.length == 0 || (extra.length && extra[0] == 'feed') ) {
			IsHome = true;
		}

		props.header = "USER";
		props.headerClass = "-col-b";
		
		props.subtitle = '@'+node.slug;
		props.notitleedit = true;
		
		props.authored = true;
		props.by = "Joined";
		props.noby = true;
		
		props.label = "Biography";
		
		props.minmax = true;
		if ( !IsHome ) {
			props.minimized = true;
		}
		
		
		var NavBar = [];
		if ( !this.isEditMode() ) {
			if ( user && user.id && node.id !== user.id ) {
				NavBar.push(<ButtonFollow node={node} user={user} />);
			}
		}
		
		return (
			<ContentSimple class="content-user" {...props}>
				<ContentCommonNav>{NavBar}</ContentCommonNav>
			</ContentSimple>
		);

	
//		if ( node && node.slug ) {
//			props.class = typeof props.class == 'string' ? props.class.split(' ') : [];
//			props.class.push("content-user");
//			props.header = "USER";
//			props.headerClass = "-col-b";
//			
//			var NavBar = [];
//			var EditBar = null;
//			var IsPublished = false;
//
//			if ( this.isEditMode() ) {
//				// Check if user has permission to edit
//				if ( node.id != user.id ) {
//					return <ContentError code="401">Permission Denied</ContentError>;
//				}
//				
//				// Hack
//				//var IsPublished = node.type.length;//;Number.parseInt(node.published) !== 0;
//				
//				// In this case, you shouldn't be able to publish (as all users are published upon registration)
//				// published={IsPublished}
//				// onpublish={this.onPublish}
//				EditBar = <ContentCommonEdit nopublish editing={state.editing} modified={state.modified} onedit={this.onEdit} onpreview={this.onPreview} onsave={this.onSave} />;
//			}
//			else {
////				if ( user.id && (node.id !== user.id) )
////					props.star = 1;
//				if ( user.id && (node.id === user.id) )
//					props.edit = 1;
//			
//				if ( user && user.id && node.id !== user.id ) {
//					NavBar.push(<ButtonFollow node={node} user={user} />);
//				}
//			}
//
//			// TODO: Swap this out for the minimized feature. Start it minimized instead.			
//			var ShowMarkup = null;
//			if ( (extra && !extra.length) || (extra && extra[0] == 'edit') || (extra && extra[0] == 'feed') ) {
//				ShowMarkup = <ContentCommonBodyMarkup user={user} editing={state.editing} label="Biography" placeholder="Share details about yourself {optional}" class="-block-if-not-minimized" onmodify={this.onModifyText}>{state.body}</ContentCommonBodyMarkup>;
//			}
//			
//			return (
//				<ContentCommon {...props}>
//					{EditBar}
//					<ContentCommonBodyAvatar src={node.meta.avatar ? node.meta.avatar : ''} />
//					<ContentCommonBodyTitle href={path} title={node.meta['real-name'] ? node.meta['real-name'] : node.name} subtitle={'@'+node.slug} />
//					<ContentCommonBodyBy node={node} label="Joined" when />
//					{ShowMarkup}
//					<ContentCommonNav>{NavBar}</ContentCommonNav>
//					{props.children}
//				</ContentCommon>
//			);
////<ContentCommonBodyMarkup user={user} editing={state.editing} label="Biography" placeholder="Share details about yourself {optional}" class="-block-if-not-minimized" onmodify={this.onModifyText}>{state.body}</ContentCommonBodyMarkup>
//		}
//		else {
//			return <ContentLoading />;
//		}
	}
}
		
//		return <ContentSimple path={path} node={node} user={user} header="USER" headerClass="-col-b" minmax>{props.children}</ContentSimple>;
		
/*		
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
	
}
*/
