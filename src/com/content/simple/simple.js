import {h} from 'preact';
import cN from 'classnames';
import {CommonSection, Header, Section, Footer} from "com/content/common";

export default function ContentSimple( props ) {
	/* Simple documents have only a single sub-section. For more complicated documents, make your own */
	return (
		<CommonSection {...props} class={cN("-simple", props.class)}>
			{props.title ? <Header title={props.title} href={props.href} /> : null}
			<Section children={props.children} />
			{props.footer ? <Footer {...(props.footer)} /> : null}
		</CommonSection>
	);
}
