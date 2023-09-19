import { toChildArray } from 'preact';
import './icon.less';
import 'icons/ludumdare/ludumdare.less';
import 'icons/icomoon/icons.less';
import 'icons/custom/icons.less';

// MK TODO: tidy up.

/**  */

/**
 * @typedef IconProps
 * @property {string} src
 * @property {string} [alt]
 * @property {string} [class] - Legacy styles: -baseline, -top, -bottom, -text-top, -text-bottom, -small, -half, -quarter, -block, -inline, -pad
 * @property {string} [title] - DON'T USE THIS! Wrap in <Tooltip> instead!
 * property {string} [children] - Deprecated
 */

/**
 * @param {IconProps} props
 */
export function Icon( props ) {
	const {src, alt, 'class': classProp, ...otherProps} = props;

	// deprecated - Add the sytle directly
	/*
	// Args (alignment, size)
	if ( props['baseline'] )		svgClass += " -baseline";
	if ( props['top'] )				svgClass += " -top";
	if ( props['bottom'] )			svgClass += " -bottom";
	if ( props['text-top'] )		svgClass += " -text-top";
	if ( props['text-bottom'] )		svgClass += " -text-bottom";

	if ( props['small'] )			svgClass += " -small";
	if ( props['half'] )			svgClass += " -half";
	if ( props['quarter'] )			svgClass += " -quarter";

	if ( props['block'] )			svgClass += " -block";
	if ( props['inline'] )			svgClass += " -inline";

	if ( props['pad'] )				svgClass += " -pad";
	*/

	// Which icon?
	//if ( props.src ) {
	const svgClass = `ui-icon icon-${src}`;
	const svgUseProps = {'xlinkHref': `#icon-${src}`};
	//}
	//else {
	//	let name = toChildArray(children).slice(0, 1);
	//	svgClass += " icon-"+name;
	//	svgUseProps = {'xlinkHref': "#icon-"+name};
	//}

	// Render
	return <svg class={`${svgClass} ${classProp ?? ''}`} alt={alt ?? src} {...otherProps}><use {...svgUseProps} /></svg>;
}
