import {h} from 'preact';

/**
 * @param {*} _props
 * @returns {*|null}
 */
export default function UIButtonButton( _props ) {
	const {'class': classNames, ...props} = _props;
	return <button type="button" {...props} class={`ui-button ${props.disabled ? "-disabled" : ''} ${classNames ?? ''}`} />;
}
