import {h, Component} 				from 'preact/preact';

import Bar							from 'com/visualization/barchart/bar';

export default class BarChart extends Component {

	constructor( props ) {
		super(props);

    }


    render( props ) {

        if ( !(props && props.labels && props.values) ) {
            console.warn('BarChart was created with invalid props', props);
            return <div>No Data!</div>;
        }

        let labels = props.labels;
        let values = props.values;

        let Bars = [];
        let Legend = [];

        for ( var i = 0; i < values.length; i++ ) {

            let color = 1 + ( i % 6 );
            let legendclass = cN("-shape-circle", "vis_bg_color_"+color, props.class);

            Bars.push(<Bar height={values[i]} offset={i} color={color} />);
            Legend.push(
                <li>
                    <span class={legendclass}></span>
                    <p>{labels[i]} ({values[i]})</p>
                </li>
            );

        }

        return (
            <div class="chart-bar">
                <div class="-chart">
                    <svg class="-svg" viewBox="0 0 42 42" width="100%" height="100%">
                        {Bars}
                    </svg>
                </div>
                <div class="legend">
                    {Legend}
                </div>
            </div>
        );
    }
}
