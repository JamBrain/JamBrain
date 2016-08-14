;(function(){
	
/**
	Time Library - Various Time related functions.
	
	NOTE: For converting dates to nice strings, see "locale.js".
*/

// Given a time difference, convert to words until a deadline
window.getCountdownInWeeks = function( time, max_places, padded ) {
	var Seconds = time % 60;
	var Minutes = Math.floor(time / 60) % 60;
	var Hours = Math.floor(time / (60*60)) % 24;
	var Days = Math.floor(time / (60*60*24)) % 7;
	var Weeks = Math.floor(time / (60*60*24*7)) % 365;
	var Years = Math.floor(time / (60*60*24*7*365));
	
	var Places = 0;
	if ( !max_places )
		max_places = 10;
	
	var out = "";
	
	if ( (Places < max_places && Years > 0) || (Places && Places < max_places && padded) ) {
		Places++;

		if ( Years == 1 )
			out += Years+" year";
		else
			out += Years+" years";
	}
	
	if ( (Places < max_places && Weeks > 0) || (Places && Places < max_places && padded) ) {
		Places++;

		if ( out )
			out += ", ";
		
		if ( Weeks == 1 )
			out += Weeks+" week";
		else
			out += Weeks+" weeks";
	}

	if ( (Places < max_places && Days > 0) || (Places && Places < max_places && padded) ) {
		Places++;
		
		if ( out )
			out += ", ";
		
		if ( Days == 1 )
			out += Days+" day";
		else
			out += Days+" days";
	}

	if ( (Places < max_places && Hours > 0) || (Places && Places < max_places && padded) ) {
		Places++;
		
		if ( out )
			out += ", ";
			
		if ( Hours == 1 )
			out += Hours+" hour";
		else
			out += Hours+" hours";
	}

	if ( (Places < max_places && Minutes > 0) || (Places && Places < max_places && padded) ) {
		Places++;
		
		if ( out )
			out += ", ";
			
		if ( Minutes == 1 )
			out += Minutes+" minute";
		else
			out += Minutes+" minutes";
	}

	if ( (Places < max_places && Seconds > 0) || (Places && Places < max_places && padded) ) {
		Places++;
		
		if ( out )
			out += ", ";
			
		if ( Seconds == 1 )
			out += Seconds+" second";
		else
			out += Seconds+" seconds";
	}
	
	return out;
}

// Given a time difference (positive), get roughly how old something is //
window.getRoughAge = function( time ) {
	if ( time < 0 ) {
		return "in the future";
	}
	else if ( time < 1000*60*2 ) { 
		return "right now";
	}
	else if ( time < 1000*60*60 ) {
		return Math.floor(time/(1000*60)) + " minutes ago";
	}
	else if ( time < 1000*60*60*2 ) {
		if ( time < 1000*60*30*3 )
			return "an hour ago";
		else
			return "an hour and a half ago";
	}
	else if ( time < 1000*60*60*24 ) {
		return Math.floor(time/(1000*60*60)) + " hours ago";
	}
	else if ( time < 1000*60*60*24*2 ) {
		if ( time < 1000*60*60*12*3 )
			return "a day ago";
		else
			return "a day and a half ago";
	}
	else if ( time < 1000*60*60*24*7*2 ) {				// 2 weeks of days
		return Math.floor(time/(1000*60*60*24)) + " days ago";
	}
	else if ( time < 1000*60*60*24*((7*4*3)+7.5) ) {	// 12 weeks (briefly 13)
		return Math.floor(time/(1000*60*60*24*7)) + " weeks ago";
	}
	else if ( time < 1000*60*60*24*182*3 ) {
		return Math.floor(time/(1000*60*60*24*30.5)) + " months ago";
	}
	else if ( time < 1000*60*60*24*365*2 ) {
		return "a year and a half ago";
	}
	
	return Math.floor(time/(1000*60*60*24*365)) + " years ago";
}

})();
