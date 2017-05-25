import { h, Component } 				from 'preact/preact';
import SVGIcon 							from 'com/svg-icon/icon';
import NavLink 							from 'com/nav-link/link';

import ContentNavButton					from 'com/content-nav/nav-button';


export default class ContentNavRoot extends Component {
	constructor( props ) {
		super(props);
	}
	
	componentDidMount() {
	}


	render( {node, user, path, extra}, {} ) {
//		let ThemeMode = (node.meta['theme-mode']) ? parseInt(node.meta['theme-mode']) : 0;

//		var ThemeSelectionDiv = ThemeModeText ? <NavLink href={path+'/theme'} class="-item"><SVGIcon>mallet</SVGIcon> {ThemeModeText}</NavLink> : "";
//
//		var ShowEventMode = null;
//		if ( node.meta && node.meta['theme-mode'] > 0 ) {
//			ShowEventMode = (<div><strong>ON NOW:</strong> {ThemeModeName[node.meta['theme-mode']]}</div>);
//		}

		var NewPath = '/'+ (extra ? extra.join('/') : '');
		var PartPath = '/'+ (extra && extra.length ? extra[0] : '');
		
		var ShowMyFeed = null;
		if ( user && user.id ) {
			if ( NewPath == '/' )
				NewPath = '/feed';
			ShowMyFeed = <ContentNavButton path={NewPath} icon='feed' href='/feed'>Feed</ContentNavButton>;
		}
		// Default to normal /feed if not logged in
		else {
			if ( NewPath == '/' )
				NewPath = '/feed';
			ShowMyFeed = <ContentNavButton path={NewPath} icon='feed' href='/feed'>Feed</ContentNavButton>;
		}
		
		return (
			<div class="content-base content-nav content-nav-root">
				{ShowMyFeed}
				<ContentNavButton path={NewPath} icon='news' href='/news'>News</ContentNavButton>
				<ContentNavButton path={PartPath} icon='gamepad' href='/games'>Games</ContentNavButton>
			</div>
		);

//					<ContentNavButton path={NewPath} icon='heart' href='/hot'>Popular</ContentNavButton>
	}
}

//					<ContentNavButton path={NewPath} icon='article' href='/articles'>Articles</ContentNavButton>
//					<ContentNavButton path={NewPath} icon='tv' href='/tv'>TV</ContentNavButton>
//					<ContentNavButton path={NewPath} icon='infinity' href='/feed' minimize>Everything</ContentNavButton>

//					<ContentNavButton path={NewPath} icon='about' href='/about' class="-right">About</ContentNavButton>
