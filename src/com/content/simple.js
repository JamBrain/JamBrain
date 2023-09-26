import {BasicSection, Header, Section, Footer} from "./basic";

/**
 * Simple section type with optional title and footer
 *
 * @param {object} props
 * @param {any} [props.children]
 * @param {string} [props.class]
 * @param {string} [props.title]
 * @param {string} [props.href]
 * @param {object} [props.footer]
 */
export function ContentSimple( props ) {
	const {...otherProps} = props;
	return (
		<section {...otherProps}>
			{props.title ? <Header title={props.title} href={props.href} /> : null}
			<Section>{props.children}</Section>
			{props.footer ? <Footer {...(props.footer)} /> : null}
		</section>
	);
}
