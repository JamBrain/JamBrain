import Fetch	 				from '../internal/fetch';

export default {
	GetCountUnread,
	GetCountAll,
	GetFeedUnread,
	GetFeedAll,
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
	return Fetch.Get(API_ENDPOINT+'/vx/notification/unread/feed?offset=' + offset + '+length=' + length, true);
}

//Gets feed for all notifications
export function GetFeedAll( offset, length ) {
	return Fetch.Get(API_ENDPOINT+'/vx/notification/all/feed?offset=' + offset + '+length=' + length, true);
}