import { Component } from 'preact';
import './text.less';

export class UIText extends Component {
	constructor( props ) {
		super(props);

		this.onModify = this.onModify.bind(this);
		this.onKey = this.onKey.bind(this);
	}

//	shouldComponentUpdate( nextProps ) {
//		return shallowDiff(this.props, nextProps);
//	}

	onModify( e ) {
		if ( this.props.onModify )
			this.props.onModify(e, this.textinput);
	}

	onKey( e ) {
		if ( (e.keyCode === 13) && this.props.onselect ) {
			e.preventDefault();
			this.props.onselect(e);
		}
	}

	render( props ) {
		let ShowLimit = null;
		if ( props.maxLength && (props.showLength != false) )
			ShowLimit = <div class="-right"><span class="-chars">{props.value.length}</span>/<span class="-limit">{props.maxLength}</span></div>;

		return (
			<div class={`ui-text ${props.class ?? ''}`}>
				<input
					value={props.value}
					placeholder={props.placeholder}
					maxLength={props.maxLength}
					type="text"
					onInput={this.onModify}
					onKeyPress={this.onKey}
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
