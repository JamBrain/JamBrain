import {h, Component}					from 'preact/preact';
import ContentEvent						from "com/content-event/event";

export default class Home extends Component {
	constructor( props ) {
		super(props);
	}

	render( props ) {
		let {node, user, featured, path, extra} = props;

		return (
			<div class="content-common event-home">
				<ContentEvent node={node} user={user} path={path} extra={extra} featured={featured} noflag title="Event Details" />
			</div>
		);
	}
}
