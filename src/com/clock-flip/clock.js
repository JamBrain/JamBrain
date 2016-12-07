import { h, Component } from 'preact/preact';
import SVGIcon 			from 'com/svg-icon/icon';

export default class Clock extends Component {
  constructor( props ) {
    super( props );

    let n = new Date();
    let diff = props.date.getTime() - n.getTime();
    let ts = Math.abs(diff/1000);
    let ss = String(parseInt(ts % 60));
    let mm = String(Math.floor(ts / 60) % 60);
    let hh = String(Math.floor(ts / 60 / 60) % 24);
    let dd = String(Math.floor(ts / 60 / 60 / 24));

    this.setState({countdown_interval: null, total_seconds: ts, values: { days: dd, hours: hh, minutes: mm, seconds: ss }, loaded: false});
  }

  init() {
    this.setState({loaded: true});
    this.count();
  }

  componentDidMount() {
    this.init();
  }

  count() {
    let that = this;
		let d = that.daysblock.children[1];
		let h = that.hoursblock.children[1];
		let m = that.minutesblock.children[1];
		let s = that.secondsblock.children[1];
		let ci = setInterval(function() {
			if(that.state.total_seconds > 0) {
				--that.state.values.seconds;

				if(that.state.values.minutes >= 0 && that.state.values.seconds < 0) {

            that.state.values.seconds = 59;
            --that.state.values.minutes;
        }

        if(that.state.values.hours >= 0 && that.state.values.minutes < 0) {

            that.state.values.minutes = 59;
            --that.state.values.hours;
        }

				if(that.state.values.days >= 0 && that.state.values.hours < 0) {
					that.state.values.hours = 24;
					--that.state.values.days;
				}

        // Days
        that.checkHour(that.state.values.days, d.children[0], d.children[1]);
        // Hours
        that.checkHour(that.state.values.hours, h.children[0], h.children[1]);
        // Minutes
        that.checkHour(that.state.values.minutes, m.children[0], m.children[1]);
        // Seconds
        that.checkHour(that.state.values.seconds, s.children[0], s.children[1]);

        --that.state.total_seconds;
			} else {
				clearInterval(that.state.countdown_interval);
			}
		}, 1000);

    this.setState({countdown_interval: ci});
  }

  animateFigure($el, value) {
		let that = this;
		let $top = $el.children[0];
		let $bottom = $el.children[2];
		let $back_top = $el.children[1];
		let $back_bottom = $el.children[3];

		$back_top.children[0].innerHTML = value;
		$back_bottom.children[0].innerHTML = value;

    $top.setAttribute('style', 'transition: 0.8s all ease-out; transform: matrix3d(1, 0, 0, 0, 0, -1, 0, 0, 0, 0, -1, 0, 0, 0, 0, 1)');
    setTimeout(function(){
      $top.setAttribute('style', 'transition: 0.0s all ease-out; transform: matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)');
      $top.innerHTML = value;
			$bottom.innerHTML = value;
    }, 800);

    $back_top.setAttribute('style', 'transition: 0.8s all ease-out; transform: matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)');
    setTimeout(function(){
      $back_top.setAttribute('style', 'transition: 0.0s all ease-out; transform: matrix3d(1, 0, 0, 0, 0, -1, 0, 0, 0, 0, -1, 0, 0, 0, 0, 1)');
    }, 800);

		/*$top.setAttribute('style', 'transition: 0.4s all ease-out; transform: rotateX(-180deg) perspective(300px)');
		setTimeout(function() {
			$top.setAttribute('style', 'transition: 0.4s all ease-out; transform: rotateX(-0deg) perspective(0px)');
			$top.innerHTML = value;
			$bottom.innerHTML = value;
		}, 400);

		$back_top.setAttribute('style', 'transition: 0.4s all ease-out; transform: rotateX(0deg) perspective(300px)');
		setTimeout(function() {
			$back_top.setAttribute('style', 'transition: 0.4s all ease-out; transform: rotateX(180deg) perspective(000px)');
		}, 400);*/
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

  renderDigit( value, classname ) {
		let Digit1 = Math.floor(value / 10);
		let Digit2 = value % 10;
		//console.log(value, Digit1, Digit2);
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
    let n = new Date();

    let size = "font-size: 1em";
    if(props.comSize)
      size = "font-size: "+props.comSize+"em";

    let display = "display: block";
    let urgent = "-countdown";
    let displayAfterDays = 1;
    if(props.displayAfterDays)
      displayAfterDays = props.displayAfterDays;
    if(props.displayAfterHours && props.displayAfterHours != 0) {
      if(this.state.values.days < displayAfterDays && this.state.values.hours < props.displayAfterHours)
        display = "display: block";
      else
        display = "display: none";
    }
    if(props.urgentAfterHours && props.urgentAfterHours != 0)
    {
      if(this.state.values.days < 6 && this.state.values.hours < props.urgentAfterHours)
        urgent = "-countdown urgent";
    }

    let daysblock = "display: inline-block";
    let secondsblock = "display: inline-block";
    if(!this.props.jumbo) {
      let daysblock = "display: none";
  		let secondsblock = "display: inline-block";
    }
		if(!this.props.jumbo && this.state.values.days > displayAfterDays){
			daysblock = "display: inline-block";
			secondsblock = "display: none";
		}

		return (
			<div class={ "clock-base clock-countdown " + props.classes } style={ size } >
				<div class="-clock font2" id={ props.id } style={ display }>
					<h1>{ props.h1 } <strong>{ props.h2 }</strong></h1>
					<div class={ urgent }>

					<div class="bloc-time days" data-init-value="00"  ref={c => this.daysblock=c} style={ daysblock }>
						<span class="count-title">Days</span>

						{ this.renderDigit(this.state.values.days, "days") }

					</div>

						<div class="bloc-time hours" data-init-value="00"  ref={c => this.hoursblock=c}>
							<span class="count-title">Hours</span>

							{ this.renderDigit(this.state.values.hours, "hours") }

						</div>

						<div class="bloc-time min" data-init-value="0"  ref={c => this.minutesblock=c} style={this.state.ShowDays ? "margin-right: 0px;" : ""}>
							<span class="count-title">Minutes</span>

							{ this.renderDigit(this.state.values.minutes, "minutes") }

						</div>

						<div class="bloc-time sec" data-init-value="0" style={ secondsblock }  ref={c => this.secondsblock=c}>
							<span class="count-title">Seconds</span>

							{ this.renderDigit(this.state.values.seconds, "seconds") }

						</div>
					</div>
				</div>
			</div>
		);
  }
}
