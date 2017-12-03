import {h, Component} 				from 'preact/preact';

import PieSegment					from 'com/visualization/piechart/piesegment';
import Legend						from 'com/visualization/legend/legend';

export default class PieChart extends Component {

	constructor( props ) {
		super(props);

    }

    // Converts an array of number to an array of percentages
    convertToPercentage ( values ) {
        // calculate total
        let total = 0;
        values.forEach( ( v ) => ( total += v ) );

        // scale values so there sum is 100%
        let percentages = values.map( ( v ) => ( (100 * v) / total ) );

        return percentages;
    }

    render( props ) {

        if ( !(props && props.labels && props.values) ) {
            console.warn('PieChart was created with invalid props', props);
            return <div>No Data!</div>;
        }

        let {labels, values} = props;

        let percentages = this.convertToPercentage(values);

        let Segments = [];
		let Names = [];
		let Colors = [];

        let offset = 0;
        for ( var i = 0; i < percentages.length; i++ ) {

            let color = 1 + ( i % 6 );
            let legendclass = cN("-shape-circle", "vis_bg_color_"+color, props.class);

            Segments.push(<PieSegment angle={percentages[i]} offset={offset} color={color} />);
            Names.push(labels[i] +" (" + values[i] + " : " + (Math.round(percentages[i] * 100) / 100) + "%)");
            Colors.push(color);

            offset += percentages[i];
        }

        return (
            <div class="chart">
                <div class="-pie">
                    <svg class="-svg" viewBox="0 0 42 42" width="100%" height="100%">
                        {Segments}
                    </svg>
                </div>
                <Legend names={Names} colors={Colors}/>
            </div>
        );
    }
}
