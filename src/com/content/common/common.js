import {Section} from "../basic/contents";

/**
 * Common content header type with children
 *
 * IMPORTANT: Use {@link BasicHeader} instead for building this from scratch
 *
 * @param {object} props
 * @param {any} [props.children]
 * @param {string} [props.class]
 */
 export function CommonHeader( props ) {
	return <header {...props} class={`content -basic ${props.class ?? ''}`} children={<Section children={props.children}/>}/>;
}


/**
 * Common content section type with children
 *
 * IMPORTANT: Use {@link BasicSection} instead for building this from scratch
 *
 * @param {object} props
 * @param {any} [props.children]
 * @param {string} [props.class]
 */
export function CommonSection( props ) {
	return <section {...props} class={`content -basic ${props.class ?? ''}`} children={<Section children={props.children}/>}/>;
}


/**
 * Common content article type with children
 *
 * IMPORTANT: Use {@link BasicArticle} instead for building this from scratch
 *
 * @param {object} props
 * @param {any} [props.children]
 * @param {string} [props.class]
 */
 export function CommonArticle( props ) {
	return <article {...props} class={`content -basic ${props.class ?? ''}`} children={<Section children={props.children}/>}/>;
}


/**
 * Common content aside type with children
 *
 * IMPORTANT: Use {@link BasicAside} instead for building this from scratch
 *
 * @param {object} props
 * @param {any} [props.children]
 * @param {string} [props.class]
 */
 export function CommonAside( props ) {
	return <aside {...props} class={`content -basic ${props.class ?? ''}`} children={<Section children={props.children}/>}/>;
}


/**
 * Common content footer type with children
 *
 * IMPORTANT: Use {@link BasicFooter} instead for building this from scratch
 *
 * @param {object} props
 * @param {any} [props.children]
 * @param {string} [props.class]
 */
 export function CommonFooter( props ) {
	return <footer {...props} class={`content -basic ${props.class ?? ''}`} children={<Section children={props.children}/>}/>;
}
