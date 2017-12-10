import Fetch	 				from '../internal/fetch';

const setNotificationSettingsCookie = (filter, value) => {
	const d = new Date();
	//Last for 20 days
	d.setTime(d.getTime() + (20 * 24 * 60 * 60 * 1000));
	document.cookie = `notificationsFilter${filter}=${value ? 1 : 0};expires=${d.toUTCString()};path=/`;
};

const getNotificationSettingsFromCookie = (filter) => {
	const decodedCookie = decodeURIComponent(document.cookie);
	const pattern = new RegExp(` *notificationsFilter${filter}=([^;]*)`);
	const match = decodedCookie.match(pattern);
	if (match && match.length == 2) {
		return Boolean(Number(match[1]));
	}
	return undefined;
};

const Filters = [
	'Mention', 'Comment', 'Feedback', 'FriendGame', 'FriendPost', 'Other',
];

const DefaultFilters = {
	'Mention': true,
	'Comment': false,
	'Feedback': true,
	'FriendGame': true,
	'FriendPost': true,
	'Other': true,
};

export const SetFilters = (filterSettings) => {
	for (let i = 0; i<Filters.length; i+=1) {
		const key = Filters[i];
		if (filterSettings[key] !== undefined) {
			setNotificationSettingsCookie(key, filterSettings[key]);
		}
	}
};

export const GetFilters = () => {
	const filterSettings = {};
	for (let i = 0; i<Filters.length; i+=1) {
		const key = Filters[i];
		let setting = getNotificationSettingsFromCookie(key);
		if (setting === undefined) {
			setting = DefaultFilters[key];
		}
		filterSettings[key] = setting;
	}
	return filterSettings;
};

const ShouldShow = (notification, settings) => {
	switch (notification.type) {
		case 'note':
			return settings.Comments;
		case 'mention':
			return settings.Mentions;
		case 'feedback':
			return settings.Feedback;
		case 'item':
			return settings.FriendsGames;
		case 'post':
			return settings.FriendsPosts;
		default:
			return settings.Other;
	}
};

const FilterResponse = (response) => {
	const settings = GetFilters();
	if (response.feed) {
		response.filtered = [];
		for (let i=response.feed.length; i>-1; i-=1) {
			if (!ShouldShow(response.feed[i])) {
				const item = response.feed.splice(i, 1);
				response.filtered.push(item);
			}
		}
		response.countFiltered = response.filtered.length;
		response.count = response.feed.length;
	}
	return Promise.resolve(response);
};

//Gets count, caller_id, and satus for unread notifications
export function GetCountUnread() {
	return Fetch.Get(API_ENDPOINT+'/vx/notification/unread/count', true);
}

//Gets count, caller_id, and satus for all notifications
export function GetCountAll() {
	return Fetch.Get(API_ENDPOINT+'/vx/notification/all/count', true);
}

//Gets feed for unread notifications
export function GetFeedUnread( offset, length ) {
	return Fetch.Get(API_ENDPOINT+'/vx/notification/unread/feed?offset=' + offset + '&limit=' + length, true);
}

export const GetUnreadFiltered = (offset, length) => {
	return GetFeedUnread(offset, length).then(r => FilterResponse(r));
};

//Gets feed for all notifications
export function GetFeedAll( offset, length ) {
	return Fetch.Get(API_ENDPOINT+'/vx/notification/all/feed?offset=' + offset + '&limit=' + length, true);
}

export function SetMarkRead( id ) {
	return Fetch.Post(API_ENDPOINT+'/vx/notification/markread', {'max_read': id});
}

export function GetSubscription( id ) {
	return Fetch.Get(API_ENDPOINT+'/vx/notification/subscription/get/' + id, true);
}

export function Subscribe( id ) {
	return Fetch.Post(API_ENDPOINT+'/vx/notification/subscription/add/' + id, {});
}

export function Unsubscribe( id ) {
	return Fetch.Post(API_ENDPOINT+'/vx/notification/subscription/remove/' + id, {});
}

export default {
	GetCountUnread,
	GetCountAll,
	GetFeedUnread,
	GetFeedAll,
	SetMarkRead,
	GetSubscription,
	Subscribe,
	Unsubscribe,
	SetFilters,
	GetFilters,
	GetUnreadFiltered,
};
