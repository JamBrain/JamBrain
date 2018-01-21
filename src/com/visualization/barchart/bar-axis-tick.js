import {h, Component} 				from 'preact/preact';

const MAJOR_TICK_LENGTH = 6;
const MINOR_TICK_LENGTH = 2;

export default class Tick extends Component {
	render({major, horizontal, outside, axis, position}) {
		pos0 = outside ? axis - (major ? MAJOR_TICK_LENGTH : MINOR_TICK_LENGTH) : axis + (major ? MAJOR_TICK_LENGTH : MINOR_TICK_LENGTH);
		if (horizontal) {
			return <line class={cN('axis-tick', major ? 'tick-major': 'tick-minor')} x0={pos0} x1={axis} y0={position} y1={position} />;
		}
		else {
			return <line class={cN('axis-tick', major ? 'tick-major': 'tick-minor')} x0={position} x1={position} y0={pos0} y1={axis} />;
		}
	}
}
