import {Link2 as Link} from './link';
import {Icon} from './icon';

//import {ui_button} from './button.less';
import './button.less';
const ui_button = 'ui_button';

// <button type="button" /> has no side effects when clicked.
export function Button( props ) {
	const {'type': typeProp = "button", 'class': classProp, ...otherProps} = props;
	const classNames = `${ui_button} ${classProp ?? ''}`;
	return (props.href)
		? <Link {...otherProps} class={classNames} role="button" />
		: <button {...otherProps} class={classNames} type={typeProp} />;
}

export function IconButton( props ) {
	const {icon, children, ...otherProps} = props;
	return <Button {...otherProps}>
		{icon ? <Icon src={icon} /> : null}
		{children}
	</Button>;
}

// For submitting HTTP forms.
// Wrap this in a <form action='someurl'></form> or use the 'formaction' attribute to specify the URL to submit to.
export function ButtonSubmit( props ) {
	return <Button {...props} type="submit" />;
}

// For resetting forms to their initial value.
export function ButtonReset( props ) {
	return <Button {...props} type="reset" />;
}


// While "input inside label" and "input beside label" (using 'id' and 'for') are both valid ways to do this,
// https://stackoverflow.com/a/24596641 recommends "input inside label" because then the gap beteen text and checkbox is clickable

// When inspecting the element, the 'checked' attribute tells you if it's checked (selected).
// When submitting a form, when checked, 'name' is the property submitted and 'value' is its value (if unchecked, nothing gets submitted).
export function ButtonCheck( props ) {
	const {'type': typeProp = "checkbox", 'class': classProp, ...otherProps} = props;
	return <label class={`${ui_button} ${classProp ?? ''}`}>
		{otherProps.childen /* ?? otherProps.value*/}
		<input {...otherProps} type={typeProp} />
	</label>;
}

// For radio buttons, use the same 'name' for each radio button.
// When submitting a form, a single property 'name' with the 'value' of the checked radio button is submitted.
// Include the 'required' attribute on any (all) radio buttons to ensure that one is checked before submitting the form.
export function ButtonRadio( props ) {
	return <ButtonCheck {...props} type="radio" />;
}


// Variation of a UIButton that copies a value to the clipboard.
function copyValueToClipboard( e ) {
	if ( navigator.clipboard ) {
		const value = e.target.value;
		navigator.clipboard.writeText(value).then(r => {
			// TODO: Trigger event that notifies user of action
			DEBUG && console.log("[UIButtonClipboard]", `"${value}" written to navigator.clipboard`);
		})
		.catch(r => {
			DEBUG && console.warn("[UIButtonClipboard]", "Failed to write navigator.clipboard");
		});
	}
	else {
		DEBUG && console.warn("[UIButtonClipboard]", "navigator.clipboard unavailable (are you connected via HTTPS?)");
	}
}

export function ButtonClipboard( props ) {
	return <Button {...props} onClick={copyValueToClipboard} />;
}
