import {h, Component} 				from 'preact/preact';

export default class PieChart extends Component {

	constructor( props ) {
		super(props);

    }

    render( props ) {
        console.log(props);

        let angle = props.angle;
        let offset = 100 - props.offset + 25;
        let color = props.color;
        let segmentclass = "piechart-segment piechart_color_"+color;

        let dash = angle + " " + (100 - angle);

        return (
            <circle class={segmentclass} cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke-width="6" stroke-dasharray={dash} stroke-dashoffset={offset}></circle>
        );
    }
}
