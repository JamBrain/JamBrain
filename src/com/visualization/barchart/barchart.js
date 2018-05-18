import {h, Component} 				from 'preact/preact';

import Bar							from 'com/visualization/barchart/bar';
import Legend						from 'com/visualization/legend/legend';
import XAxis						from './bar-x-axis';
import YAxis						from './bar-y-axis';

const AXIS_RESERVATION = 2;

export default class BarChart extends Component {
	scaleValues( values, minZero, posMin, posMax ) {
		let max = 1;
		let min = 0;
		values.forEach((v) => {
			if ( isFinite(v) ) {
				max = Math.max(v, max);
				min = Math.min(v, min);
			}
		});

		let yZeroPos = this.scale(0 - min, max - min, posMin, posMax);
		//console.log(values, min, max, minZero, yZeroPos);
		if ( yZeroPos < minZero ) {
			yZeroPos = minZero;
		}
		const yOnePos = this.scale(1, max, yZeroPos, posMax);
		const valuesYPos = values.map(v => this.scale(v, max, yZeroPos, posMax));
		//console.log(values, valuesYPos, yZeroPos, yOnePos);
		return {'valuesYPos': valuesYPos, 'yZeroPos': yZeroPos, 'yOnePos': yOnePos};
	}

	scale( value, valueMax, minPos, maxPos ) {
		return ((maxPos - minPos) * value / valueMax) + minPos;
	}

	// NOTE: This emits *BOTH* SVG and HTML
	render( props ) {
		// FIXME: This line seems redundant. Please document if there's a reason behind this.
		props["use_percentages"] = (props.use_percentages && (props.use_percentages == true));

		let {labels, values, use_percentages, hideLegend} = props;
		if ( !((labels || hideLegend) && values) ) {
			console.warn("BarChart was created with invalid props", props);
			return <div>No Data!</div>;
		}

		const padTop = 0;
		const padBottom = 0;
		const padLeft = 0;
		const padRight = 0;

		let minYZeroPos = 0;
		let xZeroPos = 0;
		const xAxisHeight = props.xAxisHeight ? props.xAxisHeight : AXIS_RESERVATION;
		const yAxisWidth = props.yAxisWidth ? props.yAxisWidth : AXIS_RESERVATION;

		let firstBarXStart = 0;
		if ( props.showXAxis ) {
			minYZeroPos = xAxisHeight;
		}
		if ( props.showYAxis ) {
			xZeroPos = yAxisWidth;
			firstBarXStart = 0.2;
		}
		const xMaxValue = firstBarXStart + values.length;

		const {valuesYPos, yZeroPos, yOnePos} = this.scaleValues(values, minYZeroPos, padBottom, 100 - padTop);

		let ShowXAxis = null;
		if ( props.showXAxis ) {
			ShowXAxis = <XAxis padLeft={padLeft} padRight={padRight} height={xAxisHeight} yZeroPos={yZeroPos} />;
		}
		let ShowYAxis = null;
		if ( props.showYAxis ) {
			ShowYAxis = <YAxis yZeroPos={yZeroPos} yOnePos={yOnePos} xZeroPos={xZeroPos} padTop={padTop} padBottom={padBottom} width={yAxisWidth} showTicks={props.showYTicks} />;
		}

		let barWidth = this.scale(1, xMaxValue, xZeroPos, 100 - padRight) - xZeroPos;

		let total = values.reduce((a, b) => (a + b), 0);
		let percentages = values.map((x) => (Math.round((100 * (x / total)) * 100) / 100));

		let Bars = [];
		let Names = [];
		let Colors = [];

		let ShowLegend = null;
		for ( let i = 0; i < values.length; i++ ) {
			// FIXME: This doesn't seem to do anything.
			if ( (valuesYPos[i] == yZeroPos) || isNaN(valuesYPos[i]) ) {
				//continue;
			}

			let color = 1 + (i % 6);
			Bars.push(<Bar valuePos={valuesYPos[i]} zero={yZeroPos} width={barWidth} left={this.scale(firstBarXStart + i, xMaxValue, xZeroPos, 100)} index={i} color={color} />);

			if ( !hideLegend ) {
				if ( use_percentages ) {
					Names.push(labels[i] +" (" + values[i] + " : " + percentages[i] + "%)");
				}
				else {
					Names.push(labels[i] +" (" + values[i] + ")");
				}
			}
			Colors.push(color);
		}
		if ( !hideLegend ) {
			ShowLegend = <Legend names={Names} colors={Colors} />;
		}

		return (
			<div class="chart">
				<div class="-bar">
					<svg class="-svg" viewBox="0 0 100 100" width="100%" height="100%">
						<g transform="translate(0,100) scale(1,-1)">
							{Bars}
							{ShowYAxis}
							{ShowXAxis}
						</g>
					</svg>
				</div>
				{ShowLegend}
			</div>
		);
	}
}
