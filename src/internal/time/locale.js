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
var LocaleTimeRemapTable = {
	'en-GB':'en-US',			// 12 hour, from 24 hour
};
if ( LocaleTimeRemapTable.hasOwnProperty(navigator.language) ) {
	time_locale = LocaleTimeRemapTable[navigator.language];
}

// TODO: Consider making all GMT+2's in to CEST, except Africa
// https://www.timeanddate.com/time/zones/cest

// Timezone remapping table
var LocaleZoneRemaps = {
	"Argentina Standard Time":"ART",
	"GMT Standard Time":"BST"/*"GMT+1"*/,					// British Summer Time*
	"Central Europe Daylight Time":"CEST"/*"GMT+2"*/,		// was CEDT
	"Central European Daylight Time":"CEST"/*"GMT+2"*/,		// was CEDT
	//"??":"CET"/*"GMT+1"*/,
	"Western European Daylight Time":"CEST"/*"GMT+2"*/,		// was WEDT, but VERY uncommon
	//"??":"CET"/*"GMT+1"*/,
	"Western European Summer Time":"CEST"/*"GMT+2"*/,		// was WEST, but uncommon
	"Romance Standard Time":"CET"/*"GMT+1"*/,				// was RST, but uncommon
	"Romance Daylight Time":"CEST"/*"GMT+2"*/,				// was RDT, but uncommon
	"Mitteleuropäische Zeit":"MEZ"/*"GMT+1"*/,
	"Mitteleuropäische Sommerzeit":"MESZ"/*"GMT+2"*/,
	
	"Paris, Madrid (heure d’été)":"CEST"/*"GMT+2"*/,		// was PM, completely wrong

	"Eastern Europe Daylight Time":"EEST"/*"GMT+3"*/,		// was EEDT, but uncommon

	// Microsoft
	"W. Europe Standard Time":"CET"/*"GMT+1"*/,
}
// References:
// * https://gist.github.com/stemar/5556910e99e8df2fd21d - I'm not sure I trust this
// * https://msdn.microsoft.com/en-us/library/ms912391(v=winembedded.11).aspx

// Locale dependent changes 
var LocaleCustomZoneRemaps = {
	'en-IE': {
		"GMT Standard Time":"IST"/*"GMT+1"*/,				// Irish Standard Time
	},
};

// Overwrite master list with custom mappings
if ( LocaleCustomZoneRemaps[navigator.language] ) {
	LocaleZoneRemaps = Object.assign(LocaleZoneRemaps, LocaleCustomZoneRemaps[navigator.language]);
}
if ( navigator.languages ) {
	navigator.languages.forEach(function(lang) {
		if ( LocaleCustomZoneRemaps[lang] ) {
			LocaleZoneRemaps = Object.assign(LocaleZoneRemaps, LocaleCustomZoneRemaps[lang]);
		}
	});
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
		var Hours = (date.getHours() % 12);
		if ( Hours == 0 )
			Hours = 12;
		return Hours + ":" + 
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
		date.getDate() + DateSuffixTable[date.getDate() % 20] + ", " + 
		date.getFullYear();
}

// Date (i.e. January 21st) //
window.getLocaleMonthDay = function( date ) {
	return MonthOfTheYearTable[date.getMonth()] + " " + 
		date.getDate() + DateSuffixTable[date.getDate() % 20];
}

// Time Zone, short abbreviated form (i.e. EST, CET) //
window.getLocaleTimeZone = function( date ) {
	// http://stackoverflow.com/a/12496442
	date = date.toString();
	for (var key in LocaleZoneRemaps) {
		date = date.replace(key, LocaleZoneRemaps[key]);
	}
	var TZ, TZAll;
	if ( date.indexOf('(') > -1 ) {
		TZAll = date.match(/\([^\)]+\)/)[0];
		if ( TZAll ) {
			TZ = TZAll.match(/[A-Z]/g);
			if ( TZ ) {
				TZ = TZ.join('');
			}
		}
		if ( !TZ ) {
			TZ = TZAll;
		}
	}
	else {
		TZ = date.match(/[A-Z]{3,4}/)[0];
	}
		
//	var TZ = date.indexOf('(') > -1 ?
//		date.match(/\([^\)]+\)/)[0].match(/[A-Z]/g).join('') :
//		date.match(/[A-Z]{3,4}/)[0];
	if (TZ == "GMT" && /(GMT\W*\d{4})/.test(date)) 
		TZ = RegExp.$1;
	return TZ;
}

})();
