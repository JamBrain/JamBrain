import {h, Component} 					from 'preact/preact';
import ContentNavButton					from 'com/content-nav/nav-button';


export default class ContentNavEvent extends Component {
	constructor( props ) {
		super(props);
	}

	render( props ) {
		let {node, user, path, extra} = props;

		let NewPath = '/'+ (extra ? extra.join('/') : '');
		let PartPath = '/'+ (extra && extra.length ? extra[0] : '');

		if ( NewPath === '/' ) {
			NewPath = '/home';
		}
		// Prefix with path
		NewPath = path + NewPath;
		PartPath = path + PartPath;

		let Buttons = [
			<ContentNavButton path={PartPath} icon="previous" href="/" />,
			<ContentNavButton path={NewPath} icon="trophy" href={path}>Event</ContentNavButton>
		];

//		var ShowMyFeed = null;
//		if ( user && user.id ) {
//			ShowMyFeed = <ContentNavButton path={NewPath} icon='feed' href={path}>Feed</ContentNavButton>;
//		}
//		// Default to /hot if not logged in
//		else if ( NewPath === '/' ) {
//			NewPath = '/hot';
//		}

		if ( user && user.id ) {
			// TODO: Check if any games are submitted
			Buttons.push(<ContentNavButton path={PartPath} icon="user" href={path+'/my'}>Me</ContentNavButton>);
		}

		if ( node ) {
			// TODO: Check if any games are submitted
			Buttons.push(<ContentNavButton path={PartPath} icon="gamepad" href={path+'/games'}>Games</ContentNavButton>);
		}

		let ShowTheme = null;
		if ( node ) {
			// TODO: Check if Theme Mode > 0
			Buttons.push(<ContentNavButton path={PartPath} icon="ticket" href={path+'/theme'}>Theme</ContentNavButton>);
		}

		Buttons.push(<ContentNavButton path={NewPath} icon="stats" href={path+'/stats'}>Stats</ContentNavButton>);

		return (
			<div class="-body">
				<div class="content-base content-nav content-nav-event">
					{Buttons}
				</div>
			</div>
		);

//					{ShowMyFeed}
//					<ContentNavButton path={NewPath} icon='heart' href={path+'/hot'}>Popular</ContentNavButton>
//					<ContentNavButton path={NewPath} icon='news' href={path+'/news'}>News</ContentNavButton>
//					<ContentNavButton path={NewPath} icon="gamepad" href={path+'/join'}>Join Event</ContentNavButton>
	}
}
