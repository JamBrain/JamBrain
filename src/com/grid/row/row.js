/** @deprecated */
export default function GridRow( props ) {
	return (
		<div {...props} class={`${props.class ?? ''} -row`}>
			{props.children}
		</div>
	);
}
