import {h, Component} 				from 'preact/preact';

import PieSegment					from 'com/visualization/piechart/piesegment';

export default class PieChart extends Component {

	constructor( props ) {
		super(props);

    }

    normalize ( values ) {
        let total = 0;

        values.forEach( ( v ) => ( total += v ) );

        console.log(total);

        let n_values = values.map( ( v ) => ( (100 * v) / total ) );

        return n_values;
    }

    render( props ) {
        console.log(props);

        let lables = props.lables;
        let values = props.values;

        let n_values = this.normalize(values);

        let Segments = [];
        let Ledgend = [];

        let offset = 0;

        for (var i = 0; i < n_values.length; i++) {

            let color = 1 + ( i % 6 );
            let ledgendclass = "shape-circle ledgend_color_"+color;

            Segments.push(<PieSegment angle={n_values[i]} offset={offset} color={color}></PieSegment>);
            Ledgend.push(
                <li>
                    <span class={ledgendclass}></span>
                    <p>{lables[i]} ({values[i]} / {Math.round(n_values[i] * 100) / 100}%)</p>
                </li>
            );

            offset += n_values[i];
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
