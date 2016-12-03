import { h, Component } 				from 'preact/preact';
import ShallowCompare	 				from 'shallow-compare/index';

import NavSpinner						from 'com/nav-spinner/spinner';
import NavLink 							from 'com/nav-link/link';
import SVGIcon 							from 'com/svg-icon/icon';

import $Node							from '../../shrub/js/node/node';
import $NodeLove						from '../../shrub/js/node/node_love';

export default class ContentPost extends Component {
	constructor( props ) {
		super(props);
		
		this.state = {
			'author': {},
			'loved': null,
			'lovecount': null
		};
		
		$NodeLove.GetMy(props.user.id, props.node.id)
		.then(r => {
			//console.log( r ) ;
			this.setState({ 'loved': r });
		});
		
		// TODO: Extract Love from the global love pool (props.node.id)
		
		this.getAuthor( props.node );
		
		this.onLove = this.onLove.bind(this);
		this.onMinMax = this.onMinMax.bind(this);
	}

//	shouldComponentUpdate( nextProps, nextState ) {
//		var com = ShallowCompare(this, nextProps, nextState);
////		console.log("HOOP",com,this.props, nextProps);
////		console.log("HOOP",com,this.state, nextState);
//		return com;
//	}
	
//	componentWillReceiveProps( props ) {
	componentWillUpdate( newProps, newState ) {
		if ( this.props.user !== newProps.user ) {
			this.getAuthor(newProps.user);
		}
	}
	
	getAuthor( node ) {
		// Clear the Author
		this.setState({ author: {} });
		
		// Lookup the author
		$Node.Get( node.author )
		.then(r => {
			if ( r.node && r.node.length ) {
				this.setState({ author: r.node[0] });
			}
			else {
				this.setState({ error: "Not found" });
			}
		})
		.catch(err => {
			this.setState({ error: err });
		});
	}

	onLove( e ) {
		if ( this.state.loved ) {
			$NodeLove.Remove(this.props.node.id)
			.then(r => {
				this.setState({ 'loved': false, 'lovecount': r.love.count });
			});			
		}
		else {
			$NodeLove.Add(this.props.node.id)
			.then(r => {
				this.setState({ 'loved': true, 'lovecount': r.love.count });
			});
		}
	}
	
	onMinMax( e ) {
		console.log("minmax");
		window.location.hash = "#dummy";
	}

	getAvatar( user ) {
		return '//'+STATIC_DOMAIN + ((user && user.meta && user.meta.avatar) ? user.meta.avatar : '/other/dummy/user64.png');
	}
	
	getAtName( user ) {
		var user_url = '/users/'+user.slug+'/';
		return <NavLink class="at-name" href={user_url}><img src={this.getAvatar(user)} />{user.name}</NavLink>;
	}

	render( {node, user, path}, {author, loved, lovecount, error} ) {
		if ( node.slug && author.slug ) {
			var dangerousParsedBody = { __html:marked.parse(node.body) };
			var dangerousParsedTitle = { __html:titleParser.parse(node.name) };
			
			var url = path+node.slug+'/';
			
			var pub_date = new Date(node.published);
			var pub_diff = new Date().getTime() - pub_date.getTime();
			
			// x minutes ago
			var post_relative = <span class="if-sidebar-inline">{getRoughAge(pub_diff)}</span>;
			// simple date, full date on hover
			var post_date = <span>on <span class="-title" title={getLocaleDate(pub_date)}><span class="if-sidebar-inline">{getLocaleDay(pub_date)}</span> {getLocaleMonthDay(pub_date)}</span></span>;
			
			var post_by = <span>by {this.getAtName(author)}</span>;
			if ( author.meta['real-name'] ) {
				post_by = <span>by {author.meta['real-name']} ({this.getAtName(author)})</span>;
			}
			
			var post_avatar = this.getAvatar( author );
			
			return (
				<div class="content-base content-post">
					<div class="-header">
						<div class="-avatar" onclick={e => { console.log(author.slug); location.href = "#user-card"; }}><img src={post_avatar} /><SVGIcon class="-info">info</SVGIcon></div>
						<div class="-title _font2"><NavLink href={url} dangerouslySetInnerHTML={dangerousParsedTitle} /></div>
						<div class="-subtext">
							Posted {post_relative} {post_by} {post_date}
						</div>
					</div>
					<div class="-body markup" dangerouslySetInnerHTML={dangerousParsedBody} />
					<div class="-footer">
						<div class="-left">
							<div class="-minmax _hidden" onclick={this.onMinMax}>
								<SVGIcon>arrow-up</SVGIcon>
							</div>
						</div>
						<div class="-right">
							<div class={'-love'+ (loved ? ' loved' : '')} onclick={this.onLove}>
								<SVGIcon class="-hover-hide">heart</SVGIcon>
								<SVGIcon class="-hover-show -loved-hide">heart-plus</SVGIcon>
								<SVGIcon class="-hover-show -loved-show">heart-minus</SVGIcon>
								<div class="-count">{Number.isInteger(lovecount) ? lovecount : node.love}</div>
							</div>
						</div>
					</div>
				</div>
			);
		}
		else {
			return (
				<div class="content-base content-post">
					{ error ? error : <NavSpinner /> }
				</div>
			);
		}
	}
}

marked.setOptions({
	highlight: function( code, lang ) {
		var language = Prism.languages.clike;
		if ( Prism.languages[lang] )
			language = Prism.languages[lang];
		return Prism.highlight( code, language );
	},
	sanitize: true,			// disable HTML //
	smartypants: true,		// enable automatic fancy quotes, ellipses, dashes //
});
