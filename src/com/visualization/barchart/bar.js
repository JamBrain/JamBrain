const BAR_WIDTH_GAP_RATIO = 0.8;

// NOTE: This emits SVG, not HTML
export default function Bar( props ) {
	let {valuePos, zero} = props;
	const {width, color, left} = props;
	// it's valid for valuePos/width to be zero so we have to check it against undefined.
	if ( !((valuePos != null) && (width != null) && (left != null) && color) ) {
		console.warn("Bar was created with invalid props", props);
		return;
	}

	if ( valuePos < zero ) {
		let tmp = zero;
		zero = valuePos;
		valuePos = tmp;
	}
	let segmentclass = `-bar vis_fill_color_${color} ${props.class ?? ''}`;

	return (
		<rect class={segmentclass} x={left} y={zero} width={width * BAR_WIDTH_GAP_RATIO} height={valuePos - zero}/>
	);
}
