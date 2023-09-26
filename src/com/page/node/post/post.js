import PageNavContent from '../../nav/content';
import PageContentPost from 'com/page/content/content-post';

export default function PagePost( props ) {
	const {node, user, path, extra} = props;
	const editMode = extra && extra.length && (extra[extra.length-1] === 'edit');

	return <>
		<PageNavContent {...props} />
		<PageContentPost node={node} user={user} path={path} extra={extra} edit={editMode} />
	</>;
}
