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

				console.log("Written to clipboard");
			})
			.catch(r => {
				console.log("Failed to write to clipboard");
			});
		}
		else {
			console.log("Clipboard unavailable (are you connected via HTTPS?)");
		}
	}


	render( props ) {
		let {value} = props;

		// @ifndef DEBUG
		if ( !value || !navigator.clipboard ) {
			return <Fragment />;
		}
		// @endif

		return (
			<UIButton title={'Copy "'+value+'" to clipboard'} {...props} class={cN("-clipboard a", props.class)} onClick={this.onClick}>
				{props.icon ? <UIIcon src={props.icon} /> : null}
				{props.children}
			</UIButton>
		);
	}
}
