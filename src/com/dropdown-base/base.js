export default function DropdownBase( props ) {
	return <div {...props} class={`dropdown-base ${props.class ?? ''}`} />;
}
