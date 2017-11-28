import {h, Component} 				from 'preact/preact';

export default class HistogramChart extends Component {

	constructor( props ) {
		super(props);

		this.graphradix = 0.1;
    }

	pickScale( maxValue ) {
		let radix = 0.01;

		while ( radix * 10 < maxValue ) {
			radix *= 10;
		}
		this.graphradix = radix;

		if ( radix * 2 > maxValue ) {
			return radix * 2;
		}
		if ( radix * 5 > maxValue ) {
			return radix * 5;
		}
		return radix * 10;
	}

	formatTimeValue( value ) {
		if ( value < 1.2 ) {
			if ( value < 0.1 ) {
				return (Math.round(value*100*1000) / 100) + "ms";
			}
			else {
				return (Math.round(value*1000)) + "ms";
			}
		}
		else {
			return (Math.round(value*100) / 100) + " sec";
		}
	}

    render( props ) {

        if ( !(props && ((props.keys && props.values) || (props.histogram))) ) {
            console.warn('HistogramChart was created with invalid props', props);
            return <div>No Data!</div>;
        }
		if ( props.histogram ) {
			// Generate keys and values from histogram data.
			let base = props.histogram.Origin;
			let power = props.histogram.Power;
			let buckets = props.histogram.Buckets;

			let bucketkeys = Object.keys(buckets);
			bucketkeys = bucketkeys.map((k) => parseInt(k, 10));
			bucketkeys.sort( (a, b) => (a - b));
			props.saveKeys = bucketkeys;

			let outkeys = [];
			let outvalues = [];
			let count = 0;
			bucketkeys.forEach( (bucket) => {
				let value = Math.pow(power, bucket) * base;

				if ( count == 0 ) {
					// First entry adds an additional entry at x=0;
					outkeys.push(count);
					outvalues.push(value);
				}

				count += parseInt(buckets[bucket], 10);
				outkeys.push(count);
				outvalues.push(value);
			});

			props.keys = outkeys;
			props.values = outvalues;
		}

        let {keys, values} = props;

		// Keys will start at 0
		let maxKey = keys.reduce( (acc, value) => Math.max(acc, value), 0);
		let maxValue = values.reduce( (acc, value) => Math.max(acc, value), 0);

		let scaleValue = this.pickScale(maxValue);

		let points = [];
        for ( var i = 0; i < values.length; i++ ) {
			let x = keys[i] * 100 / maxKey;
			let y = values[i] * 20 / scaleValue;
			points.push(x + "," + y);
        }
		let pointSet = points.join(" ");

        return (
            <div class="chart">
                <div class="-hist">
                    <svg class="-svg" viewBox="0 0 150 25" width="100%" height="100%">
						<rect x="1" y="1" width="102" height="22" fill="white" />
						<g transform="translate(2.5,22.5) scale(1,-1)">
							<line x1="0" y1="20" x2="100" y2="20" stroke="gray" stroke-width="0.1" />
							<line x1="0" y1="0" x2="100" y2="0" stroke="black" stroke-width="0.2" />
							<line x1="100" y1="0" x2="100" y2="21" stroke="black" stroke-width="0.2" />
							<polyline points={pointSet} fill="none" stroke="Blue" stroke-width="0.5" />
						</g>
						<text x="105" y="4" font-size="4">{this.formatTimeValue(scaleValue)}</text>
                    </svg>
                </div>
            </div>
        );
    }
}
