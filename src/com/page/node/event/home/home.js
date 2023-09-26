import { Component } from 'preact';
import {ContentHeadliner} from "com/content/headliner";
import ContentEvent from "com/content-event/event";

export default class Home extends Component {
	constructor( props ) {
		super(props);
	}

	render( props ) {
		let {node, user, featured, path, extra} = props;

		return (
			<div class="content -common event-home">
				<ContentHeadliner title="Event Details" icon="trophy" flagclass="-col-a" />
				<ContentEvent node={node} user={user} path={path} extra={extra} featured={featured} noflag title="Event Details" />
			</div>
		);
	}
}
