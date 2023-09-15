import {UILink2 as UILink} from '../link';
import {ui_button} from './button.module.less';

// <button type="button" /> has no side effects when clicked.
export function UIButton( props ) {
	const {'type': typeProp = "button", 'class': classProp, ...otherProps} = props;
	const classNames = `${ui_button} ${classProp ?? ''}`;
	return (props.href)
		? <UILink {...otherProps} class={classNames} role="button" />
		: <button {...otherProps} class={classNames} type={typeProp} />;
}


// For submitting HTTP forms.
// Wrap this in a <form action='someurl'></form> or use the 'formaction' attribute to specify the URL to submit to.
export function UIButtonSubmit( props ) {
	return <UIButton {...props} type="submit" />;
}

// For resetting forms to their initial value.
export function UIButtonReset( props ) {
	return <UIButton {...props} type="reset" />;
}


// While "input inside label" and "input beside label" (using 'id' and 'for') are both valid ways to do this,
// https://stackoverflow.com/a/24596641 recommends "input inside label" because then the gap beteen text and checkbox is clickable

// When inspecting the element, the 'checked' attribute tells you if it's checked (selected).
// When submitting a form, when checked, 'name' is the property submitted and 'value' is its value (if unchecked, nothing gets submitted).
export function UIButtonCheck( props ) {
	const {'type': typeProp = "checkbox", 'class': classProp, ...otherProps} = props;
	return <label class={`${ui_button} ${classProp ?? ''}`}>
		{otherProps.childen /* ?? otherProps.value*/}
		<input {...otherProps} type={typeProp} />
	</label>;
}

// For radio buttons, use the same 'name' for each radio button.
// When submitting a form, a single property 'name' with the 'value' of the checked radio button is submitted.
// Include the 'required' attribute on any (all) radio buttons to ensure that one is checked before submitting the form.
export function UIButtonRadio( props ) {
	return <UIButtonCheck {...props} type="radio" />;
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

export function UIButtonClipboard( props ) {
	return <UIButton {...props} onClick={copyValueToClipboard} />;
}
