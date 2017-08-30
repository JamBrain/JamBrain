import { h, Component } from 'preact/preact';

export default class SVGIcon extends Component {
//	setIcon( name ) {
//		//el.firstChild.firstChild.setAttributeNS('http://www.w3.org/1999/xlink','href','/static/all.min.svg?v=1017-d0abbd8#icon-home3');
//	}
	
	render( props, state ) {
		let svg_props = { "class":"svg-icon" };
		let use_props = {};
		
		// Alignment Args //
		if ( props['baseline'] )		svg_props['class'] += " -baseline";
		if ( props['top'] )				svg_props['class'] += " -top";
		if ( props['bottom'] )			svg_props['class'] += " -bottom";
		if ( props['text-top'] )		svg_props['class'] += " -text-top";
		if ( props['text-bottom'] )		svg_props['class'] += " -text-bottom";
		if ( props['middle'] )			svg_props['class'] += " -middle";
		if ( props['small'] )			svg_props['class'] += " -small";
		if ( props['half'] )			svg_props['class'] += " -half";
		if ( props['block'] )			svg_props['class'] += " -block";
		if ( props['gap'] )				svg_props['class'] += " -gap";
		if ( props['pad'] )				svg_props['class'] += " -pad";
		
		// What Icon //
		if ( props.name ) {
			svg_props['class'] += " icon-"+props.name;
			use_props['xlinkHref'] = "#icon-"+props.name;
		}
		else if ( props.src ) {
			svg_props['class'] += " icon-"+props.src;
			use_props['xlinkHref'] = "#icon-"+props.src;
		}
		else {
			let name = props.children;
			svg_props['class'] += " icon-"+name;
			use_props['xlinkHref'] = "#icon-"+name;
		}

		// Any addon classes //
		if ( props.class ) {
			svg_props['class'] += " "+props.class;
		}
		
		// Generate it //
		return (
			<svg {...svg_props}><use {...use_props}></use></svg>
		);
	}
}
