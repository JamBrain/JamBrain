//import {Component} from 'preact';
//import './button-clipboard.less';
//import {UIButton, UIIcon} from 'com/ui';

//import { signal } from '@preact/signals';
import { Button } from '../button';

function onClick( e ) {
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

/** @deprecated */
export default function UIButtonClipboard( props ) {
	const {...otherProps} = props;
	return <Button {...otherProps} onClick={onClick} />;
}

/*
export default class UIButtonClipboard extends Component {
	constructor( props ) {
		super(props);

		this.onClick = this.onClick.bind(this);
	}


	onClick( e ) {
		if ( navigator.clipboard ) {
			navigator.clipboard.writeText(this.props.value).then(r => {
				// TODO: Trigger event that notifies user of action
				DEBUG && console.log("Written to clipboard");
			})
			.catch(r => {
				DEBUG && console.warn("Failed to write to clipboard");
			});
		}
		else {
			DEBUG && console.warn("Clipboard unavailable (are you connected via HTTPS?)");
		}
	}


	render( props ) {
		let {value} = props;

		if ( DEBUG && (!value || !navigator.clipboard) ) {
			return null;
		}

		return (
			<UIButton title={'Copy "'+value+'" to clipboard'} {...props} class={`-clipboard a ${props.class ?? ''}`} onClick={this.onClick}>
				{props.icon ? <UIIcon src={props.icon} /> : null}
				{props.children}
			</UIButton>
		);
	}
}
*/
