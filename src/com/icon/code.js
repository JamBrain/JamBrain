import { h, Component } from 'preact/preact';

export default class Icon extends Component {
//	setIcon(name) {
//		//el.firstChild.firstChild.setAttributeNS('http://www.w3.org/1999/xlink','href','/static/all.min.svg?v=1017-d0abbd8#icon-home3');
//	},
	
	render(props,state) {
		let svg_props = { "class":"icon" };
		let use_props = {};
		
		if ( props.hasOwnProperty('src') ) {
			svg_props['class'] += " icon-"+props.src;
//			use_props['xlinkHref'] = "/static/all.min.svg#icon-"+props.src;
			use_props['xlinkHref'] = "#icon-"+props.src;
		}

		if ( props.hasOwnProperty('class') ) {
			svg_props['class'] += " "+props.class;
		}
		
		return (
			<svg {...svg_props}><use {...use_props}></use></svg>
		);
	}
}
