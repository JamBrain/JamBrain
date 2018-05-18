import {h, Component} 				from 'preact/preact';

const BAR_WIDTH_GAP_RATIO = 0.8;

export default class Bar extends Component {
	constructor( props ) {
		super(props);
	}

	// NOTE: This emits SVG, not HTML
	render( props ) {
		let {valuePos, zero} = props;
		const {width, color, left} = props;
		// it's valid for valuePos/width to be zero so we have to check it against undefined.
		if ( !((valuePos != null) && (width != null) && (left != null) && color) ) {
			console.warn("Bar was created with invalid props", this.props);
			return;
		}

		if ( valuePos < zero ) {
			let tmp = zero;
			zero = valuePos;
			valuePos = tmp;
		}
		let segmentclass = cN("-bar", "vis_fill_color_"+color, this.props.class);

		return (
			<rect class={segmentclass} x={left} y={zero} width={width * BAR_WIDTH_GAP_RATIO} height={valuePos - zero}/>
		);
	}
}
