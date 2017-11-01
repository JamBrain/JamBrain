import {h, Component} 				from 'preact/preact';

export default class Bar extends Component {

	constructor( props ) {
		super(props);

    }

    render( props ) {

        // it's valid for height/offset to be zero so we have to check it against undefined.
        if ( !(
			props &&
			props['height']	!= undefined &&
			props['offset']	!= undefined &&
			props['color']
		) ) {
            console.warn('Bar was created with invalid props', props);
            return;
        }

        let height = props.height;
        let index = props.offset;
		let color = props.color;

		const offset = "2";
		const width = "1";

        // drawing a bar of 0 height causes artifacting so bail out.
        if ( height == 0) {
            return;
        }

        let segmentclass = cN("-bar", "vis_fill_color_"+color, props.class);

        return (
            <rect class={segmentclass} x={offset + ((index) * (width*1.25))} y={offset} width={width} height={height}/>
        );
    }
}
