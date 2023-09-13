import {h, Component, Fragment} from 'preact';
import cN from 'classnames';
import {UIButton, UIIcon} from 'com/ui';

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
				DEBUG && console.error("Failed to write to clipboard");
			});
		}
		else {
			DEBUG && console.log("Clipboard unavailable (are you connected via HTTPS?)");
		}
	}


	render( props ) {
		let {value} = props;

		if ( DEBUG && (!value || !navigator.clipboard) ) {
			return <Fragment />;
		}

		return (
			<UIButton title={'Copy "'+value+'" to clipboard'} {...props} class={cN("-clipboard a", props.class)} onClick={this.onClick}>
				{props.icon ? <UIIcon src={props.icon} /> : null}
				{props.children}
			</UIButton>
		);
	}
}
