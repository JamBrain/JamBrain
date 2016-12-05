import { h, Component } from 'preact/preact';
import SVGIcon 			from 'com/svg-icon/icon';

export default class SidebarCountdown extends Component {
	constructor( props ) {
		super(props);
			this.el = document.getElementsByClassName('-countdown')[0];

			this.countdown_interval = null;
			this.total_seconds = 0;
			this.$ = {};
			this.values = {};
			this.class = this.props.nc;
			this.init(this.props.date);
	}

	init( countdownTo ) {
		let that = this;
		document.addEventListener("DOMContentLoaded", function(event) {

			let n = new Date();
			let diff = countdownTo.getTime() - n.getTime();
			let ts = Math.abs(diff/1000);
			let s = ts % 60;
			let m = Math.floor(ts / 60) % 60;
			let h = Math.floor(ts / 60 / 60) % 24;
			let d = Math.floor(ts / 60 / 60 / 24);
			//let d = Math.floor(countdownTo / (1000 * 60 * 60 * 24));

			that.$ = {
				days: document.querySelector('#'+that.class+' .bloc-time.days .figure'),
				hours: document.querySelector('#'+that.class+' .bloc-time.hours .figure'),
				minutes: document.querySelector('#'+that.class+' .bloc-time.min .figure'),
				seconds:  document.querySelector('#'+that.class+' .bloc-time.sec .figure')
			};

			that.values = {
				days: d,
				hours: h,
				minutes: m,
				seconds: s
			}
			if(d > 1) {
				that.$.days.parentElement.setAttribute('style', 'display: inline-block');
				that.$.seconds.parentElement.setAttribute('style', 'display: none');
			}

			//that.total_seconds = (((that.values.days * 24) * 60) * 60) + that.values.hours * 60 * 60 + (that.values.minutes * 60) + that.values.seconds;
			that.total_seconds = ts;

			that.count();
		});
	}

	animateFigure($el, value) {
		let that = this;
		let $top = $el.querySelector('.top');
		let $bottom = $el.querySelector('.bottom');
		let $back_top = $el.querySelector('.top-back');
		let $back_bottom = $el.querySelector('.bottom-back');

		$back_top.querySelector('span').innerHTML = value;
		$back_bottom.querySelector('span').innerHTML = value;

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
		let fig_1_value = e1.querySelector('.top').innerHTML;
		let fig_2_value = elc.querySelector('.top').innerHTML;
		if(value >= 10) {
        // Animate only if the figure has changed
				// Something weird is happening here, that's why I'm using arguments[1] rather than el...
        if(fig_1_value !== val_1) this.animateFigure( arguments[1], val_1 );
        if(fig_2_value !== val_2) this.animateFigure( elc, val_2 );
    }
    else {
        // If we are under 10, replace first figure with 0
        if(fig_1_value !== '0') this.animateFigure(arguments[1], 0);
        if(fig_2_value !== val_1) this.animateFigure(elc, val_1);
    }
	}

	count() {
		let that = this;
		let $day_1 = document.querySelector('#'+that.class+' .bloc-time.days .figure.days-1');
		let $day_2 = document.querySelector('#'+that.class+' .bloc-time.days .figure.days-2');
		let $hour_1 = document.querySelector('#'+that.class+' .bloc-time.hours .figure.hours-1');
		let $hour_2 = document.querySelector('#'+that.class+' .bloc-time.hours .figure.hours-2');
		let $min_1 = document.querySelector('#'+that.class+' .bloc-time.min .figure.min-1');
		let $min_2 = document.querySelector('#'+that.class+' .bloc-time.min .figure.min-2');
		let $sec_1 = document.querySelector('#'+that.class+' .bloc-time.sec .figure.sec-1');
		let $sec_2 = document.querySelector('#'+that.class+' .bloc-time.sec .figure.sec-2');
		console.log(that);
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
					that.values.hours = 24;
					--that.values.days;
				}

				if(that.values.days < 1) {
					that.$.seconds.parentElement.setAttribute('style', 'display: inline-block');
					that.$.days.parentElement.setAttribute('style', 'display: none');
				}

				if(that.values.days < 1 && that.values.hours <= 6)
				{
					if(!document.querySelector('#'+that.class+' .-countdown.urgent')) {
						document.querySelector('#'+that.class+' .-countdown').setAttribute('class', '-countdown urgent');
					}
				}

        // Update DOM values
        // Days
        that.checkHour(that.values.days, $day_1, $day_2);
        // Hours
        that.checkHour(that.values.hours, $hour_1, $hour_2);
        // Minutes
        that.checkHour(that.values.minutes, $min_1, $min_2);
        // Seconds
        that.checkHour(that.values.seconds, $sec_1, $sec_2);

        --that.total_seconds;
			} else {
				clearInterval(that.countdown_interval);
			}
		}, 1000);
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

		utcCode = utcCodep+utcCode;

		return (
			<div class="sidebar-base sidebar-countdown">
				<div class="-clock font2" id={ this.class }>
					<h1>{ props.to } <strong>{ props.tt }</strong></h1>
					<div class="-countdown">

					<div class="bloc-time days" data-init-value="00" style="display: none">
						<span class="count-title">Days</span>

						<div class="figure days days-1">
							<span class="top">0</span>
							<span class="top-back">
								<span>0</span>
							</span>
							<span class="bottom">0</span>
							<span class="bottom-back">
								<span>0</span>
							</span>
						</div>

						<div class="figure days days-2">
							<span class="top">0</span>
							<span class="top-back">
								<span>0</span>
							</span>
							<span class="bottom">0</span>
							<span class="bottom-back">
								<span>0</span>
							</span>
						</div>
					</div>

						<div class="bloc-time hours" data-init-value="00">
							<span class="count-title">Hours</span>

							<div class="figure hours hours-1">
								<span class="top">0</span>
								<span class="top-back">
									<span>0</span>
								</span>
								<span class="bottom">0</span>
								<span class="bottom-back">
									<span>0</span>
								</span>
							</div>

							<div class="figure hours hours-2">
								<span class="top">0</span>
								<span class="top-back">
									<span>0</span>
								</span>
								<span class="bottom">0</span>
								<span class="bottom-back">
									<span>0</span>
								</span>
							</div>
						</div>

						<div class="bloc-time min" data-init-value="0">
							<span class="count-title">Minutes</span>

							<div class="figure min min-1">
								<span class="top">0</span>
								<span class="top-back">
									<span>0</span>
								</span>
								<span class="bottom">0</span>
								<span class="bottom-back">
									<span>0</span>
								</span>
							</div>

							<div class="figure min min-2">
							 <span class="top">0</span>
								<span class="top-back">
									<span>0</span>
								</span>
								<span class="bottom">0</span>
								<span class="bottom-back">
									<span>0</span>
								</span>
							</div>
						</div>

						<div class="bloc-time sec" data-init-value="0">
							<span class="count-title">Seconds</span>

								<div class="figure sec sec-1">
								<span class="top">0</span>
								<span class="top-back">
									<span>0</span>
								</span>
								<span class="bottom">0</span>
								<span class="bottom-back">
									<span>0</span>
								</span>
							</div>

							<div class="figure sec sec-2">
								<span class="top">0</span>
								<span class="top-back">
									<span>0</span>
								</span>
								<span class="bottom">0</span>
								<span class="bottom-back">
									<span>0</span>
								</span>
							</div>
						</div>
					</div>
				</div>
				<div id={this.class} class="-info">{props.tt} on {days[props.date.getDay()]} @ <strong>{props.date.getHours()}:{props.date.getMinutes()} UTC{utcCode}</strong></div>
			</div>
		);
	}
}
