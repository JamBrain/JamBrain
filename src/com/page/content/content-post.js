import ContentPost from 'com/content-post/post';
import ContentComments from 'com/content-comments/comments';


export default function PageContentPost( props ) {
	const {node, user, path, extra, edit} = props;

	return <>
		<ContentPost node={node} user={user} path={path} extra={extra} authored by love single />
		{!edit ? <ContentComments node={node} user={user} path={path} extra={extra} /> : null}
	</>;
}
