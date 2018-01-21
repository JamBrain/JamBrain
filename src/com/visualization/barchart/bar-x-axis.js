import {h, Component} 				from 'preact/preact';

// Non used prop `height` is the expected maximum extent of axis
// content down from the `yZeroPos` y.
export default class XAxis extends Component {
	render({yZeroPos, padLeft, padRight}) {
		return (
			<line class={cN('-chart-axis', 'x-axis', this.props.class)} x1={padLeft} y1={yZeroPos} x2={100 - padRight} y2={yZeroPos} />
        );
	}
}
