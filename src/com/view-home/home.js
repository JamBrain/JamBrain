import { h, Component }					from 'preact/preact';

import Notifications					from 'com/content-notifications/notifications';

export default class ViewHome extends Component {
	constructor(props) {
		super(props);
	}

	render ( props, state) {
		return (<div class='contents'>
		<h1>Landing Page</h1>
		</div>);
	}
}