import { h, Component } from 'preact/preact';
import SVGIcon 			from 'com/svg-icon/icon';
import NavLink			from 'com/nav-link/link';

export default class SidebarCountdown extends Component {
	constructor( props ) {
		super(props);

			this.countdown_interval = null;
			this.total_seconds = 0;
			this.$ = {};
			this.values = {};
			this.class = this.props.nc;
			this.setState({loaded: false});
			//this.init(this.props.date);
	}

	init( countdownTo ) {
		let that = this;
		//document.addEventListener("DOMContentLoaded", function(event) {

			let n = new Date();
			let diff = countdownTo.getTime() - n.getTime();
			let ts = Math.abs(diff/1000);
			let s = ts % 60;
			let m = Math.floor(ts / 60) % 60;
			let h = Math.floor(ts / 60 / 60) % 24;
			let d = Math.floor(ts / 60 / 60 / 24);
			//let d = Math.floor(countdownTo / (1000 * 60 * 60 * 24));

			that.values = {
				days: d,
				hours: h,
				minutes: m,
				seconds: s
			};
			if(d > 0) {
				that.setState({"ShowDays": true});
			}

			//that.total_seconds = (((that.values.days * 24) * 60) * 60) + that.values.hours * 60 * 60 + (that.values.minutes * 60) + that.values.seconds;
			that.total_seconds = ts;
			that.setState({'values': {'days': d, 'hours': h, 'minutes': m, 'seconds': s}, 'fvalues': {'d1': 0, 'd2': 0, 'h1': 0, 'h2': 0, 'm1': 0, 'm2': 0, 's1': 0, 's2': 0}, 'animate': false});

			that.count();

		//});
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
		setTimeout(function() {
			$top.setAttribute('style', 'transition: 0.0s all ease-out; transform: rotateX(0deg) perspective(0px)');
			$top.innerHTML = value;
			$bottom.innerHTML = value;
		}, 800);

		$back_top.setAttribute('style', 'transition: 0.8s all ease-out; transform: rotateX(0deg) perspective(300px)');
		setTimeout(function() {
			$back_top.setAttribute('style', 'transition: 0.0s all ease-out; transform: rotateX(180deg) perspective(0px)');
		}, 800);
	}

	checkHour(value, e1, elc)
	{
		let val_1 = value.toString().charAt(0);
		let val_2 = value.toString().charAt(1);
		let fig_1_value = arguments[1].children[0].innerHTML;
		let fig_2_value = arguments[2].children[0].innerHTML;
		if(value >= 10) {
				//Animate only if the figure has changed
				// Something weird is happening here, that's why I'm using arguments[1] rather than el...
        if(fig_1_value !== val_1) this.animateFigure( arguments[1], val_1 );
        if(fig_2_value !== val_2) this.animateFigure( arguments[2], val_2 );
    }
    else {
        // If we are under 10, replace first figure with 0
        if(fig_1_value !== '0') this.animateFigure(arguments[1], 0);
        if(fig_2_value !== val_1) this.animateFigure(arguments[2], val_1);
    }
	}

	count() {
		let that = this;
		let d = that.daysblock.children[1];
		let h = that.hoursblock.children[1];
		let m = that.minutesblock.children[1];
		let s = that.secondsblock.children[1];
		this.countdown_interval = setInterval(function() {
			if(that.total_seconds > 0) {
				--that.values.seconds;

				if(that.values.minutes >= 0 && that.values.seconds < 0) {

            that.values.seconds = 59;
            --that.values.minutes;
        }

        if(that.values.hours >= 0 && that.values.minutes < 0) {

            that.values.minutes = 59;
            --that.values.hours;
        }

				if(that.values.days >= 0 && that.values.hours < 0) {
					that.values.hours = 23;
					--that.values.days;
				}

				if(that.values.days < 1 && that.state.ShowDays === true) {
					that.setState({"ShowDays": false});
				}

				if(that.values.days < 1 && that.values.hours <= 6)
				{
					if(!that.state.Urgent)
					{
						that.setState({'Urgent': true});
					}
				}
        // Update DOM values
        // Days

				if(!that.state.loaded)
					that.setState({loaded: true});

        that.checkHour(that.values.days, d.children[0], d.children[1]);
        // Hours
        that.checkHour(that.values.hours, h.children[0], h.children[1]);
        // Minutes
        that.checkHour(that.values.minutes, m.children[0], m.children[1]);
        // Seconds
        that.checkHour(that.values.seconds, s.children[0], s.children[1]);

        --that.total_seconds;
			} else {
				clearInterval(that.countdown_interval);
			}
		}, 1000);
	}

	renderDigit( value, classname ) {
		let Digit1 = Math.floor(value / 10);
		let Digit2 = value % 10;
		return (
			<div>
				<div class={ "figure " + classname + " " + classname + "-1" }>
					<span class="top">{  Digit1 }</span>
					<span class="top-back">
						<span>{ Digit1 }</span>
					</span>
					<span class="bottom">{ Digit1 }</span>
					<span class="bottom-back">
						<span >{ Digit1 }</span>
					</span>
				</div>

				<div class={ "figure " + classname + " " + classname + "-2" }>
					<span class="top">{  Digit2 }</span>
					<span class="top-back">
						<span>{ Digit2 }</span>
					</span>
					<span class="bottom">{ Digit2 }</span>
					<span class="bottom-back">
						<span >{ Digit2 }</span>
					</span>
				</div>
			</div>
		);
	}

	render( props ) {

		let days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
		let utcCode = (props.date.getTimezoneOffset()/60)*-1;
		let utcCodep = "";
		if(utcCode > 0)
			utcCodep = "+";

		if(utcCode % 1 !== 0)
		{
			utcCode = parseInt(utcCode)+":30";
		} else {
			utcCode = parseInt(utcCode)+":00";
		}

		let daysblock = "display: none";
		let secondsblock = "display: inline-block";
		if(this.state.ShowDays){
			daysblock = "display: inline-block";
			secondsblock = "display: none";
		}

		utcCode = utcCodep+utcCode;
		let urgentclass = "-countdown";
		if(this.state.Urgent && this.state.Urgent === true)
			urgentclass = "-countdown urgent";

		if(!this.state.loaded)
		{
			let n = new Date();
			let diff = props.date.getTime() - n.getTime();
			let ts = Math.abs(diff/1000);
			let ss = String(parseInt(ts % 60));
			let mm = String(Math.floor(ts / 60) % 60);
			let hh = String(Math.floor(ts / 60 / 60) % 24);
			let dd = String(Math.floor(ts / 60 / 60 / 24));

			this.values = {
				days: dd,
				hours: hh,
				minutes: mm,
				seconds: ss
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

					<div class="bloc-time days" data-init-value="00"  ref={c => this.daysblock=c} style={ daysblock }>
						<span class="count-title _font2">Days</span>

						{ this.renderDigit(this.values.days, "days") }

					</div>

						<div class="bloc-time hours" data-init-value="00"  ref={c => this.hoursblock=c}>
							<span class="count-title _font2">Hours</span>

							{ this.renderDigit(this.values.hours, "hours") }

						</div>

						<div class="bloc-time min" data-init-value="0"  ref={c => this.minutesblock=c} style={this.state.ShowDays ? "margin-right: 0px;" : ""}>
							<span class="count-title _font2">Minutes</span>

							{ this.renderDigit(this.values.minutes, "minutes") }

						</div>

						<div class="bloc-time sec" data-init-value="0" style={ secondsblock }  ref={c => this.secondsblock=c}>
							<span class="count-title _font2">Seconds</span>

							{ this.renderDigit(this.values.seconds, "seconds") }

						</div>
					</div>
				</div>
				<div id={this.class} class="-info" title={LanguagePrefix+props.date.toString()}>{props.tt} {getLocaleDay(props.date)} at <strong>{getLocaleTime(props.date)} {getLocaleTimeZone(props.date)}</strong> <NavLink href="https://github.com/ludumdare/ludumdare/issues/589"><strong title="Adjusted for your local timezone. If this is not your timezone, click here and let us know!">*</strong></NavLink></div>
			</div>
		);
	}
//				<div id={this.class} class="-info">{props.tt} {days[props.date.getDay()]} at <strong>{props.date.getHours()}:{(props.date.getMinutes()<10?'0':'') + props.date.getMinutes()} UTC{utcCode}</strong></div>
}
