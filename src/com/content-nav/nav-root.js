import { h, Component } 				from 'preact/preact';
import SVGIcon 							from 'com/svg-icon/icon';
import NavLink 							from 'com/nav-link/link';

import ContentNavButton					from 'com/content-nav/nav-button';


export default class ContentNavRoot extends Component {
	constructor( props ) {
		super(props);
	}
	
	componentDidMount() {
//		$Theme.GetStats(this.props.node.id)
//		.then(r => {
//			if ( r.stats ) {
//				this.setState({ 'stats': r.stats });
//			}
//			else {
//				this.setState({ 'stats': null });
//			}
//		})
//		.catch(err => {
//			this.setState({ error: err });
//		});
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
		
		var ShowMyFeed = null;
		if ( user && user.id ) {
			ShowMyFeed = <ContentNavButton path={NewPath} icon='feed' href='/'>My Feed</ContentNavButton>;
		}
		// Default to /news if not logged in
		else if ( NewPath === '/' ) {
			NewPath = '/news';
		}
		
		return (
			<div class="-body">
				<div class="content-base content-nav content-nav-root">
					{ShowMyFeed}
					<ContentNavButton path={NewPath} icon='news' href='/news'>News</ContentNavButton>
					<ContentNavButton path={NewPath} icon='heart' href='/hot'>Popular</ContentNavButton>
					<ContentNavButton path={NewPath} icon='gamepad' href='/games'>Games</ContentNavButton>
				</div>
			</div>
		);
	}
}

//					<ContentNavButton path={NewPath} icon='warning' href='/feed' minimize>Everything</ContentNavButton>
