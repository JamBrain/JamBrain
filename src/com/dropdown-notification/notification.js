import { h, Component } 				from 'preact/preact';

import NavSpinner						from 'com/nav-spinner/spinner';

import DropdownCommon					from 'com/dropdown-common/common';

import $Notification					from '../../shrub/js/notification/notification';
import $Node							from '../../shrub/js/node/node';

export default class DropdownNotification extends Component {
	
	constructor( props ) {
		super(props);
	}

	componentDidMount() {
		console.log('mounted');
		if (this.props.getNew) {
			console.log('new check');
			$Notification.GetFeedUnread(0, 8).then((r) => {
				this.setState({status: r.status});
				this.queryInfoForNotification( r.feed[0]);
				console.log('Unread feed', r);
				//TODO: Set read
			}).catch((e)=> console.log('notification error', e));
		} else {
			console.log('recap');
			$Notification.GetFeedAll(-8, 8).then((r) => {
				this.queryInfoForNotification(r.feed[0]);
				
				console.log('Most recent feed', r);
			});			
		}
	}
	
	queryInfoForNotification(notification) {
				
		$Node.GetMy(notification.node).then((node) => {
			
			if (node.refs.author.includes(node.caller_id)) {
				//Notification about own post

				if (notification.note) {
					
					$Node.GetMy(notification.node).then((note) => {
						
						if (node.refs.author.includes(node.caller_id)) {
							// My comment on my post
						} else {
							// Other's comment on my post
							$Node.Get(node.refs.author[0]).then((author) => {
								console.log(author.name);
							});
							
						}
						
					});
					
				} else {
					// Something happened with my post
				}
				
			} else {
				//Notification about other's post
			
				if (notification.note) {
					
					$Node.GetMy(notification.node).then((note) => {
						
						if (node.refs.author.includes(node.caller_id)) {
							// My comment on other's post
						} else {
							// Other's comment on other's post
						}
						
					});
					
				} else {
					// Someone made a post
				}
			}
			
		});
	
	}
	
	handleNote(note) {
		console.log(note);
	}
	
	getNotifications() {
		let Notifications = [];
		const feed = this.state.feed;
		if (feed) {
			for (let i=0; i < feed.length; i++) {
				
				let notification = feed[i];
				
				Notifications.push((
					<div>Type: {notification.type}, {notification.node}: {notification.note}<br />{notification.created}</div>
				));
			}
		}
		return Notifications;
	}
	
	render( props ) {
		const state = this.state;
		
		let ShowSpinner = null;
		let Notifications = null;
		
		if (state.status === undefined) {
			ShowSpinner = (<NavSpinner />);
		} else if (state.status != 200) {
			Notifications = (<div>An error occurred retrieving the notifications...</div>);
		} else {
			Notifications = this.getNotifications();
		}
		console.log('render', state.status, state);
		
		return (
			<DropdownCommon>
			{ShowSpinner}
			{Notifications}
			</DropdownCommon>
		);
	}
	
}