import {h, Component} 				from 'preact/preact';

export default class PieSegment extends Component {

	constructor( props ) {
		super(props);

    }

    render( props ) {

        // it's valid for offset/angle to be zero so we have to check it against undefined.
        if ( !(props && props.angle != undefined && props.offset != undefined && props.color) ) {
            console.warn('PieSegment was created with invalid props', props);
            return;
        }

        let angle = props.angle;

        // drawing a segment of 0 width causes artifacting so bail out.
        if ( angle == 0 ) {
            return;
        }

        let offset = 100 - props.offset + 25;
        let color = props.color;
        let segmentclass = cN("-segment", "vis_stroke_color_"+color, props.class);
        let dash = angle + " " + (100 - angle);

        return (
            <circle class={segmentclass} cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke-width="6" stroke-dasharray={dash} stroke-dashoffset={offset}></circle>
        );
    }
}
