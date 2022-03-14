import {h, Component} from 'preact';
import cN from 'classnames';
import {shallowDiff}	 				from 'shallow-compare/index';

import NavLink							from 'com/nav-link/link';
import SVGIcon							from 'com/svg-icon/icon';

export default class InputText extends Component {
	constructor( props ) {
		super(props);

		this.onModify = this.onModify.bind(this);
	}

	// MK: This normally checks children. Is this correct?
	shouldComponentUpdate( nextProps ) {
		return shallowDiff(this.props, nextProps);
	}

	onModify( e ) {
		if ( this.props.onModify )
			this.props.onModify(e);
	}

	render( props ) {
		const {maxlength} = props;

		let ShowLimit = null;
		if ( maxlength )
			ShowLimit = <div class="-right"><span class="-chars">{props.value.length}</span>/<span class="-limit">{maxlength}</span></div>;

		return (
			<div class={cN('input-text', props.class)}>
				<input
					value={props.value}
					placeholder={props.placeholder}
					maxLength={props.maxlength}
					type="text"
					onInput={this.onModify}
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
