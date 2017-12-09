import {h, Component}	 				from 'preact/preact';

export default class UIText extends Component {
	constructor( props ) {
		super(props);

		this.onModify = this.onModify.bind(this);
		this.onKey = this.onKey.bind(this);
	}

//	shouldComponentUpdate( nextProps ) {
//		return shallowDiff(this.props, nextProps);
//	}

	onModify( e ) {
		if ( this.props.onmodify )
			this.props.onmodify(e, this.textinput);
	}

	onKey( e ) {
		if ( (e.keyCode === 13) && this.props.onselect ) {
			e.preventDefault();
			this.props.onselect(e);
		}
	}

	render( props ) {
		let ShowLimit = null;
		if ( props.maxlength && (props.showlength != false) )
			ShowLimit = <div class="-right"><span class="-chars">{props.value.length}</span>/<span class="-limit">{props.maxlength}</span></div>;

		return (
			<div class={cN('ui-text', props.class)}>
				<input
					value={props.value}
					placeholder={props.placeholder}
					maxlength={props.maxlength}
					type="text"
					oninput={this.onModify}
					onkeypress={this.onKey}
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
