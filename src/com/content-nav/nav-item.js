import {h, Component}	from 'preact';
import ContentNavButton	from './nav-button';


export default class ContentNavItem extends Component {
	render( {node, user, path, extra}, {} ) {
		var NewPath = '/'+ (extra ? extra.join('/') : '');

		// Default to /hot if not logged in
		if ( NewPath === '/' ) {
			NewPath = '/comments';
		}

		return (
			<nav class="content -nav -item">
				<ContentNavButton path={path+NewPath} title="Comments" icon="bubbles" href={path+'/comments'}>Comments</ContentNavButton>
			</nav>
		);

//					<ContentNavButton path={path+NewPath} icon='feed' title="Feed" href={path+'/feed'}>Feed</ContentNavButton>
	}
}
