import {h, Component} 				from 'preact/preact';

import PieSegment					from 'com/visualization/piechart/piesegment';

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

        if ( !(props && props['lables'] && props['values'])) {
            console.warn('PieChart was created with invalid props', props);
            return <div> No Data! </div>;
        }

        let lables = props.lables;
        let values = props.values;

        let percentages = this.convertToPercentage(values);

        let Segments = [];
        let Ledgend = [];

        let offset = 0;
        for (var i = 0; i < percentages.length; i++) {

            let color = 1 + ( i % 6 );
            let ledgendclass = "shape-circle ledgend_color_"+color;

            Segments.push(<PieSegment angle={percentages[i]} offset={offset} color={color}></PieSegment>);
            Ledgend.push(
                <li>
                    <span class={ledgendclass}></span>
                    <p>{lables[i]} ({values[i]} / {Math.round(percentages[i] * 100) / 100}%)</p>
                </li>
            );

            offset += percentages[i];
        }

        return (
            <div class="piechart-figure">
                <div class="piechart">
                    <svg class="piechart-svg" viewBox="0 0 42 42" width="100%" height="100%">
                        {Segments}
                    </svg>
                </div>
                <div class="ledgend">
                    {Ledgend}
                </div>
            </div>
        );
    }
}
