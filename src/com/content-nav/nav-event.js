import {h, Component} 					from 'preact/preact';
import SVGIcon 							from 'com/svg-icon/icon';
import ContentNavButton					from 'com/content-nav/nav-button';


export default class ContentNavEvent extends Component {
	constructor( props ) {
		super(props);
	}

	render( props ) {
		let {node, user, path, extra} = props;

		var NewPath = '/'+ (extra ? extra.join('/') : '');
		var PartPath = '/'+ (extra && extra.length ? extra[0] : '');

		var ShowMyFeed = null;
		if ( user && user.id ) {
			ShowMyFeed = <ContentNavButton path={NewPath} icon='feed' href={path}>Feed</ContentNavButton>;
		}
		// Default to /hot if not logged in
		else if ( NewPath === '/' ) {
			NewPath = '/hot';
		}

		return (
			<div class="-body">
				<div class="content-base content-nav content-nav-root">
					{ShowMyFeed}
					<ContentNavButton path={NewPath} icon='heart' href={path+'/hot'}>Popular</ContentNavButton>
					<ContentNavButton path={NewPath} icon='news' href={path+'/news'}>News</ContentNavButton>
                    <ContentNavButton path={PartPath} icon='gamepad' href={path+'/games'}>View Games</ContentNavButton>
					<ContentNavButton path={NewPath} icon='gamepad' href={path+'/join'}>Join Event</ContentNavButton>
				</div>
			</div>
		);
	}
}
