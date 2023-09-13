import { Component } from 'preact';
import ContentTimeline					from 'com/content-timeline/timeline';

export default class UserFeed extends Component {
	constructor( props ) {
		super(props);
	}

	render( props ) {
		let {node, user, path, extra} = props;

		if ( !node || !user )
			return null;

		let Methods = ['author'];
		if ( node.id == user.id ) {
			Methods.push('unpublished');
		}

		return (
			<ContentTimeline types={['post']} methods={Methods} node={node} user={user} path={path} extra={extra} />
		);
	}
}
