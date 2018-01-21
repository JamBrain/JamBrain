import {h, Component} 				from 'preact/preact';

import Tick							from 'bar-axis-tick';

export default class YAxis extends Component {
	render({yZeroPos, yOne, showTicks, padBottom, padTop, styleClass, width}) {
		let ShowTicks = null;
		if (yZeroPos !== null && yOne !== null && showTicks) {
			if (showTicks === true) {
				const step = yOne - yZeroPos;
				let tickHeight = yOne;
				const tickHeightMax = 100 - padTop;
				showTicks = [];
				while (tickHeight < tickHeightMax) {
					showTicks.push(tickHeight);
					tickHeight += step;
				}
			}
			ShowTicks = showTicks.map((tickHeight) => <Tick major horizontal outside axis={width} position={tickHeight} />);
		}
		return (
			<g>
				<line class={cN('-chart-axis', 'y-axis', styleClass)} x1={width} y1={padBottom} x2={width} y2={100 - padTop} />
				{ShowTicks}
			</g>
        );
	}
}
