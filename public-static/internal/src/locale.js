;(function(){
	
/**
	Locale Library - Convert Date and Number types to locale appropriate English strings.
	
	NOTE: If using timestamps, convert them with 'new Date(MyTimestamp)' first.
*/

var DateSuffixTable = [
	"th","st","nd","rd","th","th","th","th","th","th",
	"th","th","th","th","th","th","th","th","th","th"
];
var DayOfTheWeekTable = [
	"Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"
];
var MonthOfTheYearTable = [
	"January","February","March","April","May","June","July",
	"August","September","October","November","December"
];

var time_locale = navigator.language;

// Since official time standards don't necessarily match common use, remap time locales //
var LocaleRemapTable = {
	'en-GB':'en-US'
};
if ( LocaleRemapTable.hasOwnProperty(navigator.language) ) {
	time_locale = LocaleRemapTable[navigator.language];
}

// I don't see this being used much, but a way to get the internal locale //
window.getLocale = function() {
	return time_locale;
}

// Get the suffix you'd append on a numer (i.e. 10th, 31st, just the TH, RD, ST, ND part) //
window.getLocaleNumberSuffix = function( num ) {
	var Digit = Math.abs(num) % 100;
	if ( (Digit > 10) && (Digit < 20) )
		return "th";
	else
		return DateSuffixTable[Digit % 10];
}

// Time, as either 12 hour (i.e. 2:35 AM) or 24 hour (i.e. 02:30) form, depending on browser locale //
window.getLocaleTime = function( date ) {
	// Check toLocaleTimeString for 12 hour clock, or if language is English, assume 12 hour clock //				
	if ( ('toLocaleTimeString' in Date.prototype )
		&& (date.toLocaleTimeString(time_locale).indexOf('M') > -1)	// AM PM both have M's
		|| (time_locale.indexOf("en-") >= 0) ) 
	{
		var HalfDay = (date.getHours() - 12) >= 0;
		return (date.getHours() % 12) + ":" + 
			new String("00"+date.getMinutes()).slice(-2) + 
			(HalfDay?" PM":" AM");
	}
	else {
		return new String("00"+date.getHours()).slice(-2) + ":" + new String("00"+date.getMinutes()).slice(-2);
	}
}

// Day of the Week (i.e. Sunday to Saturday) //
window.getLocaleDay = function( date ) {
	return DayOfTheWeekTable[date.getDay()];
}

// Date (i.e. January 21st, 2015) //
window.getLocaleDate = function( date ) {
	return MonthOfTheYearTable[date.getMonth()] + " " + 
		date.getDate() + DateSuffixTable[EventDate.getDate() % 20] + ", " + 
		date.getFullYear();
}

// Time Zone, short abbreviated form (i.e. EST, CET) //
window.getLocaleTimeZone = function( date ) {
	// http://stackoverflow.com/a/12496442
	date = date.toString();
	date = date.replace("Argentina Standard Time","ART");
	date = date.replace("W. Europe Standard Time","CET");	// Microsoft
	var TZ = date.indexOf('(') > -1 ?
	date.match(/\([^\)]+\)/)[0].match(/[A-Z]/g).join('') :
	date.match(/[A-Z]{3,4}/)[0];
	if (TZ == "GMT" && /(GMT\W*\d{4})/.test(date)) TZ = RegExp.$1;
	return TZ;
}

})();
