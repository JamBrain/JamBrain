import {h, Component} 				from 'preact/preact';

export default class Bar extends Component {

	constructor( props ) {
		super(props);

    }

    render( props ) {

        // it's valid for height/width/index to be zero so we have to check it against undefined.
        if ( !(props && (props.height != null) && (props.index != null) && (props.width != null) && props.color) ) {
            console.warn('Bar was created with invalid props', props);
            return;
        }

        let {height, width, index, color} = props;

		const width_gap_ratio = 0.8;

        // drawing a bar of 0 height causes artifacting so bail out.
        //if ( height == 0 || width == 0 ) {
        //    return;
        //}

        let segmentclass = cN("-bar", "vis_fill_color_"+color, props.class);

        return (
            <rect class={segmentclass} x={width * index} y={0} width={width * width_gap_ratio} height={height}/>
        );
    }
}
