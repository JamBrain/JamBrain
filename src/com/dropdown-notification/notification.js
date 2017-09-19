import { h, Component } 				from 'preact/preact';

import NavSpinner						from 'com/nav-spinner/spinner';

import DropdownCommon					from 'com/dropdown-common/common';
import $Notification					from '../../shrub/js/notification/notification';

export default class DropdownNotification extends Component {
	constructor( props ) {
		super(props);
	}

	componentDidMount() {
		if (this.props.getNew) {
			$Notification.GetFeedUnread(0, 8).then((r) => {
				this.setState(...r);
				//TODO: Set read
			});
		} else {
			$Notification.GetFeedUnread(-8, 8).then((r) => {
				this.setState(...r);
			});			
		}
	}
	
	getNotifications() {
		let Notifications = [];
		const feed = this.state.feed;
		
		for (let i=0; i < feed.length; i++) {
			
			let notification = feed[i];
			
			Notifications.push((
				<div>Type: {notification.type}, {notification.node}: {notification.note}<br />{notification.created}</div>
			));
		}
		
		return Notifications;
	}
	
	render( props, state ) {
		let ShowSpinner = null;
		let Notifications = null;
		
		if (state.status === undefined) {
			ShowSpinner = (<NavSpinner />);
		} else if (state.status != 200) {
			ShowSpinner = (<div>An error occurred retrieving the notifications...</div>);
		} else {
			Notification = this.getNotifications();
		}
		
		return (
			<DropdownCommon>
			{ShowSpinner}
			{Notifications}
			</DropdownCommon>
		);
	}
	
}