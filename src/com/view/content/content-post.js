import {h, Component, Fragment}	from 'preact';
import ContentPost				from 'com/content-post/post';
import ContentComments			from 'com/content-comments/comments';


export default class ViewContentPost extends Component {
	render( props ) {
		let {node, user, path, extra, edit} = props;

		let ShowComments = null;
		if ( !edit ) {
			ShowComments = <ContentComments node={node} user={user} path={path} extra={extra} />;
		}

		return (
			<Fragment>
				<ContentPost node={node} user={user} path={path} extra={extra} authored by love single />
				{ShowComments}
			</Fragment>
		);
	}
}
