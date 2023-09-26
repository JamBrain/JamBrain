import './nav.less';
import ContentNavButton	from './nav-button';

export default function ContentNavItem( props ) {
	const {node, user, path, extra, ...otherProps} = props;
	let NewPath = '/'+ (extra ? extra.join('/') : '');

	// Default to /hot if not logged in
	if ( NewPath === '/' )
		NewPath = '/comments';

	return <>
		<nav class="content -nav -item">
			<ContentNavButton path={path+NewPath} title="Comments" icon="bubbles" href={path+'/comments'}>Comments</ContentNavButton>
			{/*<ContentNavButton path={path+NewPath} icon='feed' title="Feed" href={path+'/feed'}>Feed</ContentNavButton>*/}
		</nav>
	</>;
}
