import {h, Component}					from 'preact/preact';
import ButtonBase						from 'com/button-base/base';
import SVGIcon							from 'com/svg-icon/icon';

export default class CopyToClipboardButton extends ButtonBase {

	constructor( props ) {
		super(props);
		this.onClick = this.onClick.bind(this);

		this.state = {
			"data": props.data,
			"state": "IDEL"
		};
	}



	onClick(e) {

		let info = e.target.getElementsByTagName('div')[0];

		this.copy(this.state.data).then( () => {
			console.log("Copied " + this.state.data + " to clipboard");

			if (this.state.state === "IDEL") {
				this.setState({"state": "SUCCESS"});
				window.setTimeout(() => {
					if (this.state.state === "SUCCESS") {
						this.setState({"state": "IDEL"});
					}
				}, 2000);
			}

		}).catch((e) => {
			console.log("Error copying short link to clipboard", e);

			this.setState({"state": "ERROR"});

		});

	}

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
				success ? resolve(): reject();
			}
		);
	}

	render(props, state) {

		let {children} = Object.assign({}, props);

		let icon, style, tooltip;
		switch (state.state) {
			case "SUCCESS":
				icon = "checkmark";
				style = "-success";
				tooltip = "Copied to clipboard succesfully!";
				break;

			case "ERROR":
				icon = "cross";
				style = "-error";
				tooltip = "Failed to copy to clipboard";
				break;

			case "IDEL":
			default:
				icon =(this.props.icon === undefined)? "link" : props.icon;
				tooltip =(this.props.tooltip === undefined)? "Copy to clipboard" : props.tooltip;
				break;
		}

		return (
			<div title={tooltip} class={cN("-c2cbutton", props.class)} onclick={this.onClick}>
				<SVGIcon class={(style === undefined) ? null : style} baseline>{icon}</SVGIcon>
				{children}
			</div>
		);
	}
}
