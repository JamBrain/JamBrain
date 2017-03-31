import { h, Component } 				from 'preact/preact';
import SVGIcon 							from 'com/svg-icon/icon';
import NavLink 							from 'com/nav-link/link';

import ContentNavButton					from 'com/content-nav/nav-button';


export default class ContentNavUser extends Component {
	constructor( props ) {
		super(props);
	}
	
	componentDidMount() {
	}


	render( {node, user, path, extra}, {} ) {

		var NewPath = '/'+ (extra ? extra.join('/') : '');
		
		var ShowMyFeed = null;
		if ( NewPath === '/' ) {
			NewPath = '/games';
		}
		
		return (
			<div class="-body">
				<div class="content-base content-nav content-nav-root">
					<ContentNavButton path={NewPath} icon='gamepad' href='/games'>Games</ContentNavButton>
					<ContentNavButton path={NewPath} icon='feed' href='/feed'>Feed</ContentNavButton>
				</div>
			</div>
		);
	}
}

//					<ContentNavButton path={NewPath} icon='warning' href='/feed' minimize>Everything</ContentNavButton>
