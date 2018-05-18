import {h, Component} 				from 'preact/preact';

import Tick							from 'bar-axis-tick';

export default class YAxis extends Component {
	getMinorMajorTickSteps( axisMinPos, axisMaxPos, valueStep ) {
		const valueRangeLength = (axisMaxPos - axisMinPos) / valueStep;
		let majorTick = 1;
		let minorTick = 1;
		if ( valueRangeLength > 100 ) {
			majorTick = 50;
			minorTick = 10;
		}
		else if ( valueRangeLength > 40 ) {
			majorTick = 10;
			minorTick = 5;
		}
		else if ( valueRangeLength > 10 ) {
			majorTick = 5;
			minorTick = 1;
		}
		return {'minorTick': minorTick, 'majorTick': majorTick};
	}

	// NOTE: This emits SVG, not HTML
	render( props ) {
		const {yZeroPos, yOnePos, showTicks, padBottom, padTop, width} = props;
		let ShowTicks = null;
		if ( (yZeroPos !== null) && (yOnePos !== null) && (showTicks == true) ) {
			if ( showTicks === true ) {
				ShowTicks = [];
				const step = yOnePos - yZeroPos;
				const axisMaxPos = 100 - padTop;
				const {minorTick, majorTick} = this.getMinorMajorTickSteps(padBottom, axisMaxPos, step);

				let tick = 0;
				let tickHeight = yZeroPos;
				while ( true ) {
					tick += minorTick;
					tickHeight = yZeroPos + (tick * step);
					if ( tickHeight >= axisMaxPos ) {
						break;
					}
					if ( (tick % majorTick) === 0 ) {
						ShowTicks.push(<Tick major horizontal outside axis={width} position={tickHeight} />);
					}
					else if ( (tick % minorTick) === 0 ) {
						ShowTicks.push(<Tick minor horizontal outside axis={width} position={tickHeight} />);
					}
				}

				tickHeight = yZeroPos;
				tick = 0;
				while ( true ) {
					tick += minorTick;
					tickHeight = yZeroPos - (tick * step);
					if ( tickHeight <= padBottom ) {
						break;
					}
					if ( (tick % majorTick) === 0) {
						ShowTicks.push(<Tick major horizontal outside axis={width} position={tickHeight} />);
					}
					else if ( (tick % minorTick) === 0 ) {
						ShowTicks.push(<Tick minor horizontal outside axis={width} position={tickHeight} />);
					}
				}
			}
			else {
				ShowTicks = showTicks.map((tickHeight) => <Tick major horizontal outside axis={width} position={tickHeight} />);
			}
		}
		return (
			<g>
				<line class={cN('-chart-axis', 'y-axis', props.class)} x1={width} y1={padBottom} x2={width} y2={100 - padTop} />
				{ShowTicks}
			</g>
        );
	}
}
