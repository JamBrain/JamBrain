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

    // https://stackoverflow.com/a/1152508
    randomColor() {
        return '#' + (0x1000000 + (Math.random() * 0xFFFFFF)).toString(16).substr(1, 6);
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

            let color = this.randomColor();
            let style = "background-color:"+color+";";

            Segments.push(<PieSegment angle={n_values[i]} offset={offset} color={color}></PieSegment>);
            Ledgend.push(
                <li>
                    <span class="shape-circle" style={style}></span>
                    {lables[i]} ({Math.round(n_values[i] * 100) / 100}%)
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
