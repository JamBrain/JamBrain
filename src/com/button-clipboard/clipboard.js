import {h, Component, Fragment} from 'preact';
import ButtonBase						from 'com/button-base/base';
import SVGIcon							from 'com/svg-icon/icon';

import UIButton from 'com/ui/button';
import UIIcon from 'com/ui/icon';

export default class CopyToClipboardButton extends Component {
	constructor( props ) {
		super(props);
/*
		this.state = {
			"status": "IDEL"
		};*/

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
		/*
		let info = e.target.getElementsByTagName('div')[0];

		this.copy(this.props.data).then( () => {
			// @ifdef DEBUG
			console.log("Copied " + this.props.data + " to clipboard");
			// @endif

			if (this.state.status === "IDEL") {
				this.setState({status: "SUCCESS"});
				window.setTimeout(() => {
					if (this.state.status === "SUCCESS") {
						this.setState({status: "IDEL"});
					}
				}, 2000);
			}

		}).catch((e) => {
			// @ifdef DEBUG
			console.log("Error copying shortlink to clipboard", e);
			// @endif

			this.setState({"state": "ERROR"});

		});
		*/
	}

/*
	// Edited from https://gist.github.com/lgarron/d1dee380f4ed9d825ca7
	copy(str) {
		return new Promise(
			(resolve, reject) => {
				var success = false;

				listener = (e) => {
					e.clipboardData.setData("text/plain", str);
					e.preventDefault();
					success = true;
				};

				document.addEventListener("copy", listener);
				document.execCommand("copy");
				document.removeEventListener("copy", listener);
				success ? resolve() : reject();
			}
		);
	}
	*/


	render( props ) {
		let {value} = props;

		// @ifndef DEBUG
		if ( !value || !navigator.clipboard ) {
			return <Fragment />;
		}
		// @endif

		return (
			<UIButton title={'Copy "'+value+'" to clipboard'} {...props} class={cN("-clipboard a", props.class)} onclick={this.onClick}>
				{props.icon ? <UIIcon src={props.icon} /> : null}
				{props.children}
			</UIButton>
		);
	}
}
