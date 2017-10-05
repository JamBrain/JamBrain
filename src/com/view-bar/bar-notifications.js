import { h, Component } 				from 'preact/preact';

import NavSpinner						from 'com/nav-spinner/spinner';
import NavLink 							from 'com/nav-link/link';

import NotificationsBase				from 'com/content-notifications/base';
import Dropdown							from 'com/input-dropdown/dropdown';

import $Notification					from '../../shrub/js/notification/notification';

export default class DropdownNotification extends NotificationsBase {
	
	componentDidMount() {
		const showCount = 8;
		if (this.props.getNew) {
			$Notification.GetFeedUnread(Math.max(0, this.props.totalNew - showCount), showCount).then((r) => {
				this.processNotificationFeed(r);
			}).catch((e)=> console.log('[Notification error]', e));
		} else {
			$Notification.GetFeedAll(0, showCount ).then((r) => {
				this.processNotificationFeed(r);
			}).catch((e)=> console.log('[Notification error]', e));
		}
	}
		
	onModifyFunction(id) {
		if (id == -1) {
			if (this.props.hideCallback) {
				this.props.hideCallback();
			}
		}
	}
		
	render( props ) {
		const state = this.state;
		const loading = this.isLoading();
		let ShowSpinner = null;
		let Notifications = [];
		
		if (state.status === null) {
			ShowSpinner = (<NavSpinner />);
		} else if (state.status != 200) {
			Notifications = [[null, (<div>An error occurred retrieving the notifications...</div>)]];
		} else {
			if (loading) {
				ShowSpinner = (<NavSpinner />);
			}
			Notifications = this.getNotifications();			
		}

		if (ShowSpinner !== null) {
			Notifications.push([null, ShowSpinner]);
		}
		
		if (Notifications.length > 0 && !loading) {
			Notifications.push([-1, (<NavLink href='/home/notifications'><em>View notifications feed...</em></NavLink>)]);
		}
		
		return (
			<DropdownCommon class='-notifications' items={Notifications} startExpanded={true} hideSelectedField={true} onmodify={ (id) => this.onModifyFunction(id) } />			
		);
	}
}
