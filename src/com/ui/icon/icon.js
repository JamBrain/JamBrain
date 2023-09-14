import { Component, toChildArray } from 'preact';
import './icon.less';
import 'icons/ludumdare/ludumdare.less';
import 'icons/icomoon/icons.less';
import 'icons/custom/icons.less';

import cN from 'classnames';

// MK TODO: tidy up.

export default class UIIcon extends Component {
//	setIcon( name ) {
//		//el.firstChild.firstChild.setAttributeNS('http://www.w3.org/1999/xlink','href','/static/all.min.svg?v=1017-d0abbd8#icon-home3');
//	}

	render( props ) {
		let svg_props = {'class': "ui-icon"};
		let use_props = {};

		// Args (alignment, size)
		if ( props['baseline'] )		svg_props.class += " -baseline";
		if ( props['top'] )				svg_props.class += " -top";
		if ( props['bottom'] )			svg_props.class += " -bottom";
		if ( props['text-top'] )		svg_props.class += " -text-top";
		if ( props['text-bottom'] )		svg_props.class += " -text-bottom";

		if ( props['small'] )			svg_props.class += " -small";
		if ( props['half'] )			svg_props.class += " -half";
		if ( props['quarter'] )			svg_props.class += " -quarter";

		if ( props['block'] )			svg_props.class += " -block";
		if ( props['inline'] )			svg_props.class += " -inline";

		if ( props['pad'] )				svg_props.class += " -pad";

		// What icon?
		if ( props.src ) {
			svg_props.class += " icon-"+props.src;
			use_props.xlinkHref = "#icon-"+props.src;
		}
		else {
			let name = toChildArray(props.children).slice(0, 1);
			svg_props.class += " icon-"+name;
			use_props.xlinkHref = "#icon-"+name;
		}

		// Any other classes
		svg_props.class = cN(svg_props.class, props.class);

		// Render
		return <svg {...svg_props}><use {...use_props}></use></svg>;
	}
}
