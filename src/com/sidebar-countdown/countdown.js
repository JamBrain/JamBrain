import { h, Component } from 'preact/preact';
import SVGIcon 			from 'com/svg-icon/icon';

export default class SidebarCountdown extends Component {
	constructor( props ) {
		super(props);
		
		//Temporary Date Set, In future fetch from DB? Or code in a way for it to detect date
		// If date > than ludum start time etc, rather than manually inputting a date.
		//(I roughly converted the EST to UTC (no offset) to get a sorta right date...)
		this.initializeClock("-countdown-clock", new Date(Date.UTC(2016, 11, 9, 14, 0, 0)));
	}
	
	_getTimeRemaining(endtime) {
		let t = Date.parse(endtime) - Date.parse(new Date());
		let seconds = Math.floor((t / 1000) % 60);
		let minutes = Math.floor((t / 1000 / 60) % 60);
		let hours = Math.floor((t / (1000 * 60 * 60)) % 24);
		let days = Math.floor(t / (1000 * 60 * 60 * 24));
		return {
		  'total': t,
		  'days': days,
		  'hours': hours,
		  'minutes': minutes,
		  'seconds': seconds
		};	
	}
	
	_updateClock(c, d, h, m, s, e) {
		let t = _getTimeRemaining(e);
		
		if(t.total >= 0) {
			d.innerHTML = t.days;
			h.innerHTML = ('0' + t.hours).slice(-2);
			m.innerHTML = ('0' + t.minutes).slice(-2);
			s.innerHTML = ('0' + t.seconds).slice(-2);
		}
	}
	
	initializeClock(id, endtime) {
		let clock = document.getElementById(id);
		let daysSpan = clock.querySelector('.days');
		let hoursSpan = clock.querySelector('.hours');
		let minutesSpan = clock.querySelector('.minutes');
		let secondsSpan = clock.querySelector('.seconds'); 
		
		_updateClock(clock, daysSpan, hoursSpan, minutesSpan, secondsSpan, endtime);
		var ti = setInterval(function() { _updateClock(clock, daysSpan, hoursSpan, minutesSpan, secondsSpan, endtime); }, 1000);
	}

	render( props ) {
		return (
			<div class="sidebar-base sidebar-countdown">
				<div class="-clock font2" id="-countdown-clock"><div><span class="days"></span><div class="smalltext">Days</div></div> <div><span class="hours"></span><div class="smalltext">Hours</div></div> <div><span class="minutes"></span><div class="smalltext">Minutes</div></div> <div><span class="seconds"></span><div class="smalltext">Seconds</div></div></div>
				<div class="-info">Starts on Friday @ <strong>9:00 PM EST</strong> (Saturday @ <strong>02:00 GMT</strong>)</div>
			</div>
		);
	}
}
