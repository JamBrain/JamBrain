import { Component } from 'preact';
import './text.less';
import cN from 'classnames';
import {Diff}	 				from 'shallow';

export default class InputText extends Component {
	constructor( props ) {
		super(props);

		this.onModify = this.onModify.bind(this);
	}

	// MK: This normally checks children. Is this correct?
	shouldComponentUpdate( nextProps ) {
		return Diff(this.props, nextProps);
	}

	onModify( e ) {
		if ( this.props.onModify )
			this.props.onModify(e);
	}

	render( props ) {
		const {maxLength} = props;

		let ShowLimit = null;
		if ( maxLength )
			ShowLimit = <div class="-right"><span class="-chars">{props.value.length}</span>/<span class="-limit">{maxLength}</span></div>;

		return (
			<div class={`input-text ${props.class ?? ''}`}>
				<input
					value={props.value}
					placeholder={props.placeholder}
					maxLength={props.maxLength}
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
