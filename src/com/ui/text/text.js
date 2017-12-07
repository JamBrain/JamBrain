import {h, Component}	 				from 'preact/preact';

import UIIcon							from 'com/ui/icon/icon';
import UILink							from 'com/ui/link/link';
import UIButton							from 'com/ui/button/button';

export default class UIText extends Component {
	constructor( props ) {
		super(props);

		this.onModify = this.onModify.bind(this);
		this.onClick = this.onClick.bind(this);
	}

//	shouldComponentUpdate( nextProps ) {
//		return shallowDiff(this.props, nextProps);
//	}

	onModify( e ) {
		if ( this.props.onmodify )
			this.props.onmodify(e, this.textinput);
	}

	onClick( e ) {
		if ( this.props.onclick )
			this.props.onclick(e);
	}

	render( props ) {
		let ShowLimit = null;
		if ( props.maxlength )
			ShowLimit = <div class="-right"><span class="-chars">{props.value.length}</span>/<span class="-limit">{props.maxlength}</span></div>;

//		let ShowButton = null;
//		if ( props.onclick ) {
//			ShowButton = <UIButton onclick={this.onClick}>SEND</UIButton>;
//		}
//				{ShowButton}

		return (
			<div class={cN('ui-text', props.class)}>
				<input
					value={props.value}
					placeholder={props.placeholder}
					maxlength={props.maxlength}
					type="text"
					oninput={this.onModify}
					ref={(input) => { this.textinput = input; }}
				/>
				<div class="-footer">
					{ShowLimit}
					<div class="-left if-sidebar-block"></div>
				</div>
			</div>
		);
	}
}
