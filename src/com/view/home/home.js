import {h, Component}					from 'preact';
import Notifications					from 'com/content-notifications/notifications';

export default class ViewHome extends Component {
	constructor( props ) {
		super(props);
	}

	render( props ) {
		let ShowContent = null;
		if ( Array.isArray(props.show) && props.show[0] == 'notifications' ) {
			ShowContent = <Notifications />;
		}

		return (
			<div id="content">
				{ShowContent}
			</div>
		);
	}
}
