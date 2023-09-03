import {h, Component}	from 'preact';
import cN				from 'classnames';

import { getLocaleDay, getLocaleTime, getLocaleTimeZone } from 'internal/time';

import NavLink			from 'com/nav-link/link';

export default class SidebarCountdown extends Component {
	constructor( props ) {
		super(props);

		this.countdown_interval = null;
		this.total_seconds = 0;
		this.$ = {};
		this.values = {};
		this.class = this.props.nc;

		this.state = {
			'loaded': false,
		};
	}

	init( countdownTo ) {
		let n = new Date();
		let diff = countdownTo.getTime() - n.getTime();
		let ts = Math.abs(diff/1000);
		let s = ts % 60;
		let m = Math.floor(ts / 60) % 60;
		let h = Math.floor(ts / 60 / 60) % 24;
		let d = Math.floor(ts / 60 / 60 / 24);
		//let d = Math.floor(countdownTo / (1000 * 60 * 60 * 24));

		this.values = {
			'days': d,
			'hours': h,
			'minutes': m,
			'seconds': s
		};
		if (d > 0) {
			this.setState({"ShowDays": true});
		}

		//that.total_seconds = (((that.values.days * 24) * 60) * 60) + that.values.hours * 60 * 60 + (that.values.minutes * 60) + that.values.seconds;
		this.total_seconds = ts;
		this.setState({'values': {'days': d, 'hours': h, 'minutes': m, 'seconds': s}, 'fvalues': {'d1': 0, 'd2': 0, 'h1': 0, 'h2': 0, 'm1': 0, 'm2': 0, 's1': 0, 's2': 0}, 'animate': false});

		this.count();
	}

	componentDidMount() {
		this.init(this.props.date);
	}

	animateFigure($el, value) {
		let $top = $el.children[0];
		let $bottom = $el.children[2];
		let $back_top = $el.children[1];
		let $back_bottom = $el.children[3];

		$back_top.children[0].innerHTML = value;
		$back_bottom.children[0].innerHTML = value;

		$top.setAttribute('style', 'transition: 0.8s all ease-out; transform: rotateX(-180deg) perspective(300px)');
		setTimeout(() => {
			$top.setAttribute('style', 'transition: 0.0s all ease-out; transform: rotateX(0deg) perspective(0px)');
			$top.innerHTML = value;
			$bottom.innerHTML = value;
		}, 800);

		$back_top.setAttribute('style', 'transition: 0.8s all ease-out; transform: rotateX(0deg) perspective(300px)');
		setTimeout(() => {
			$back_top.setAttribute('style', 'transition: 0.0s all ease-out; transform: rotateX(180deg) perspective(0px)');
		}, 800);
	}

	checkHour(value, e1, elc) {
		let val_1 = value.toString().charAt(0);
		let val_2 = value.toString().charAt(1);
		let fig_1_value = arguments[1].children[0].innerHTML;
		let fig_2_value = arguments[2].children[0].innerHTML;
		if (value >= 10) {
			//Animate only if the figure has changed
			// Something weird is happening here, that's why I'm using arguments[1] rather than el...
			if (fig_1_value !== val_1) this.animateFigure( arguments[1], val_1 );
			if (fig_2_value !== val_2) this.animateFigure( arguments[2], val_2 );
		}
		else {
			// If we are under 10, replace first figure with 0
			if (fig_1_value !== '0') this.animateFigure(arguments[1], 0);
			if (fig_2_value !== val_1) this.animateFigure(arguments[2], val_1);
		}
	}

	count() {
		let d = this.daysblock.children[1];
		let h = this.hoursblock.children[1];
		let m = this.minutesblock.children[1];
		let s = this.secondsblock.children[1];
		this.countdown_interval = setInterval(() => {
			if (this.total_seconds > 0) {
				--this.values.seconds;

				if (this.values.minutes >= 0 && this.values.seconds < 0) {
					this.values.seconds = 59;
					--this.values.minutes;
				}

				if (this.values.hours >= 0 && this.values.minutes < 0) {
					this.values.minutes = 59;
					--this.values.hours;
				}

				if (this.values.days >= 0 && this.values.hours < 0) {
					this.values.hours = 23;
					--this.values.days;
				}

				if (this.values.days < 1 && this.state.ShowDays === true) {
					this.setState({"ShowDays": false});
				}

				if (this.values.days < 1 && this.values.hours <= 6) {
					if (!this.state.Urgent) {
						this.setState({'Urgent': true});
					}
				}
				// Update DOM values
				// Days

				if (!this.state.loaded) {
					this.setState({'loaded': true});
				}

				this.checkHour(this.values.days, d.children[0], d.children[1]);
				// Hours
				this.checkHour(this.values.hours, h.children[0], h.children[1]);
				// Minutes
				this.checkHour(this.values.minutes, m.children[0], m.children[1]);
				// Seconds
				this.checkHour(this.values.seconds, s.children[0], s.children[1]);

				--this.total_seconds;
			}
			else {
				clearInterval(this.countdown_interval);
			}
		}, 1000);
	}

	renderDigit( value, Classes ) {
		return (
			<div class={cN("figure", Classes)}>
				<span class="top">{ value }</span>
				<span class="top-back">
					<span>{ value }</span>
				</span>
				<span class="bottom">{ value }</span>
				<span class="bottom-back">
					<span >{ value }</span>
				</span>
			</div>
		);
	}

	renderDigits( value, classname ) {
		let Digit0 = Math.floor(value / 100);
		let Digit1 = Math.floor(value / 10) % 10;
		let Digit2 = Math.floor(value) % 10;

		let Digits = [];
		if ( Math.abs(Digit0) )
			Digits.push(this.renderDigit(Digit0, cN(classname, classname+'-0')));
		Digits.push(this.renderDigit(Digit1, cN(classname, classname+'-1')));
		Digits.push(this.renderDigit(Digit2, cN(classname, classname+'-2')));

		return <div>{Digits}</div>;
	}

	render( props ) {
		let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
		let utcCode = (props.date.getTimezoneOffset()/60)*-1;
		let utcCodep = "";
		if (utcCode > 0) {
			utcCodep = "+";
		}

		if (utcCode % 1 !== 0) {
			utcCode = (utcCode)+":30";
		}
		else {
			utcCode = (utcCode)+":00";
		}

		let daysblock = "display: none";
		let secondsblock = "display: inline-block";
		if (this.state.ShowDays) {
			daysblock = "display: inline-block";
			secondsblock = "display: none";
		}

		utcCode = utcCodep+utcCode;
		let urgentclass = "-countdown";
		if (this.state.Urgent && this.state.Urgent === true)
			urgentclass = "-countdown urgent";

		if (!this.state.loaded) {
			let n = new Date();
			let diff = props.date.getTime() - n.getTime();
			let ts = Math.abs(diff/1000);
			let ss = String(ts % 60);
			let mm = String(Math.floor(ts / 60) % 60);
			let hh = String(Math.floor(ts / 60 / 60) % 24);
			let dd = String(Math.floor(ts / 60 / 60 / 24));

			this.values = {
				'days': dd,
				'hours': hh,
				'minutes': mm,
				'seconds': ss
			};
		}

		var LanguagePrefix = "["+navigator.language+"] ";
		if ( navigator.languages ) {
			LanguagePrefix += "["+navigator.languages.join(',')+"] ";
		}

		var Title = null;
		if ( props.to ) {
			Title = <h1 class="_font2">{ props.to } <strong>{ props.tt }</strong></h1>;
		}

		return (
			<div class="sidebar-base sidebar-countdown">
				<div class="-clock" id={ this.class }>
					{Title}
					<div class={ urgentclass }>

					<div class="bloc-time days" data-init-value="00" ref={c => (this.daysblock=c)} style={ daysblock }>
						<span class="count-title _font2">Days</span>

						{ this.renderDigits(this.values.days, "days") }

					</div>

						<div class="bloc-time hours" data-init-value="00" ref={c => (this.hoursblock=c)}>
							<span class="count-title _font2">Hours</span>

							{ this.renderDigits(this.values.hours, "hours") }

						</div>

						<div class="bloc-time min" data-init-value="0" ref={c => (this.minutesblock=c)} style={this.state.ShowDays ? "margin-right: 0px;" : ""}>
							<span class="count-title _font2">Minutes</span>

							{ this.renderDigits(this.values.minutes, "minutes") }

						</div>

						<div class="bloc-time sec" data-init-value="0" style={ secondsblock } ref={c => (this.secondsblock=c)}>
							<span class="count-title _font2">Seconds</span>

							{ this.renderDigits(this.values.seconds, "seconds") }

						</div>
					</div>
				</div>
				<div id={this.class} class="-info" title={LanguagePrefix+props.date.toString()}>{props.tt} {getLocaleDay(props.date)} at <strong>{getLocaleTime(props.date)} {getLocaleTimeZone(props.date)}</strong> <NavLink href="https://github.com/ludumdare/ludumdare/issues/589"><strong title="Adjusted for your local timezone. If this is not your timezone, click here and let us know!">*</strong></NavLink></div>
			</div>
		);
	}
//				<div id={this.class} class="-info">{props.tt} {days[props.date.getDay()]} at <strong>{props.date.getHours()}:{(props.date.getMinutes()<10?'0':'') + props.date.getMinutes()} UTC{utcCode}</strong></div>
}
