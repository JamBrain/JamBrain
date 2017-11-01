import {h, Component} 				from 'preact/preact';

import Bar							from 'com/visualization/barchart/bar';
import Legend						from 'com/visualization/legend/legend';

export default class BarChart extends Component {

	constructor( props ) {
		super(props);

    }


    scaleValues ( values ) {

        let max = 1;
        values.forEach( ( v ) => ( max = (v > max) ? v : max ) );

        // scale values based on max
        let adjusted = values.map( ( v ) => ( 100 * (v / max) ) );

        return adjusted;
    }


    render( props ) {

        if ( !(props && props.labels && props.values) ) {
            console.warn('BarChart was created with invalid props', props);
            return <div>No Data!</div>;
        }

        let {labels, values} = props;

        let adjusted = this.scaleValues(values);
		let width = 100/values.length;

        let Bars = [];
        let Names = [];
		let Colors = [];

        for ( var i = 0; i < values.length; i++ ) {

            let color = 1 + ( i % 6 );
            Bars.push(<Bar height={adjusted[i]} width={width} index={i} color={color} />);
			Names.push(labels[i] +" (" + values[i] + ")");
            Colors.push(color);
        }

        return (
            <div class="chart">
                <div class="-bar">
                    <svg class="-svg" viewBox="0 0 100 100" width="100%" height="100%">
						<g transform="translate(0,100) scale(1,-1)">
							{Bars}
						</g>
                    </svg>
                </div>
				<Legend names={Names} colors={Colors}/>
            </div>
        );
    }
}
