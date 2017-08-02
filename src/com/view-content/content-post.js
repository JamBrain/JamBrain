import { h, Component }					from 'preact/preact';
import ContentPost						from 'com/content-post/post';
import ContentComments					from 'com/content-comments/comments';

export default class ViewContentPost extends Component {
	constructor(props) {
		super(props);
	}

	render( {node, user, path, extra, edit} ) {
		let ShowComments = null;
		if ( !edit ) {
			ShowComments = <ContentComments node={node} user={user} path={path} extra={extra} />;
		}

		return (
			<div id="content">
				<ContentPost node={node} user={user} path={path} extra={extra} authored by love />
				{ShowComments}
			</div>
		);
	}
};
