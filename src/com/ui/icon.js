import './icon.less';
import 'icons/ludumdare/ludumdare.less';
import 'icons/icomoon/icons.less';
import 'icons/custom/icons.less';

/**
 * @typedef IconProps
 * @property {string} src
 * @property {string} [alt]
 * @property {string} [class] - Legacy styles: -baseline, -top, -bottom, -text-top, -text-bottom, -small, -half, -quarter, -block, -inline, -pad
 * @property {string} [title] - DON'T USE THIS! Wrap in <Tooltip> instead!
 */

/**
 * Component that pulls grahics from the SVG icon library (src/icons/)
 * @param {IconProps} props
 */
export function Icon( props ) {
	const {src, alt, 'class': classProp, ...otherProps} = props;

	return <svg class={`ui-icon icon-${src} ${classProp ?? ''}`} alt={alt ?? src} {...otherProps}><use xlinkHref={`#icon-${src}`} /></svg>;
}
