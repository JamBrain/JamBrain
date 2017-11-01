import {h, Component} 				from 'preact/preact';

import Bar							from 'com/visualization/barchart/bar';

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

        let labels = props.labels;
        let values = props.values;

        let adjusted = this.scaleValues(values);
		let width = 100/values.length;

        let Bars = [];
        let Legend = [];

        for ( var i = 0; i < values.length; i++ ) {

            let color = 1 + ( i % 6 );
            let legendclass = cN("-shape-circle", "vis_bg_color_"+color, props.class);

            Bars.push(<Bar height={adjusted[i]} width={width} index={i} color={color} />);
            Legend.push(
                <li>
                    <span class={legendclass}></span>
                    <p>{labels[i]} ({values[i]})</p>
                </li>
            );

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
                <div class="-legend">
                    {Legend}
                </div>
            </div>
        );
    }
}
