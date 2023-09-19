import {Tooltip} from "./tooltip";

import './icon.less';
import 'icons/ludumdare/ludumdare.less';
import 'icons/icomoon/icons.less';
import 'icons/custom/icons.less';

/**
 * @typedef IconProps
 * @property {string} src
 * @property {string} [alt]
 * @property {string} [class] - Legacy styles: -baseline, -top, -bottom, -text-top, -text-bottom, -small, -half, -quarter, -block, -inline, -pad
 * @property {string} [tooltip] - If present, wraps the icon in a tooltip
 */

/**
 * Component that pulls grahics from the SVG icon library (src/icons/)
 * @param {IconProps} props
 */
export function Icon( props ) {
	const {src, alt, tooltip, 'class': classProp, ...otherProps} = props;

	const newIcon = <svg class={`ui-icon icon-${src} ${classProp ?? ''}`} alt={alt ?? src} {...otherProps}><use xlinkHref={`#icon-${src}`} /></svg>;

	// MK NOTE: Does this need to have an inline-block style?
	return tooltip ? <Tooltip text={tooltip}>{newIcon}</Tooltip> : newIcon;
}
