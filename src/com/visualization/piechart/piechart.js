import {h, Component} 				from 'preact/preact';

import PieSegment					from 'com/visualization/piechart/piesegment';
import Legend						from 'com/visualization/legend/legend';

export default class PieChart extends Component {

	constructor( props ) {
		super(props);

    }

    render( props ) {

        if ( !(props && props.labels && props.values) ) {
            console.warn('PieChart was created with invalid props', props);
            return <div>No Data!</div>;
        }

        props["use_percentages"] = (props.use_percentages && props.use_percentages == true)? true : false;

		let {labels, values, use_percentages} = props;

        let total = values.reduce((a, b) => a + b, 0);
		let percentages = values.map((x) => { return Math.round((100*(x/total))*100)/100; });

        let Segments = [];
		let Names = [];
		let Colors = [];

        let offset = 0;
        for ( var i = 0; i < percentages.length; i++ ) {

			let color = null;
			if (props.colors) {
				color = props.colors[i];
			} else {
				color = 1 + ( i % 6 );
			}
			const legendclass = cN("-shape-circle", "vis_bg_color_"+color, props.class);

			Segments.push(<PieSegment angle={percentages[i]} offset={offset} color={color} />);

			if (use_percentages) {
				Names.push(labels[i] +" (" + values[i] + " : " + percentages[i] + "%)");
			}
			else {
				Names.push(labels[i] +" (" + values[i] + ")");
			}

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
