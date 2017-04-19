import { h, Component } 				from 'preact/preact';
import { shallowDiff }	 				from 'shallow-compare/index';

export default class InputTextarea extends Component {
	constructor( props ) {
		super(props);

		this.state = {
			'cursorPos': (props.value || '').length
		};
//		this.setState({'cursorPos': (props.value || '').length});
		
		this.onInput = this.onInput.bind(this);
	}

	shouldComponentUpdate( nextProps ) {
		return shallowDiff(this.props, nextProps);
	}
	
	resizeTextarea() {
		if ( this.textarea ) {
			this.textarea.style.height = 0;	/* Shockingly, this is necessary. textarea wont shrink otherwise */
			this.textarea.style.height = this.textarea.scrollHeight + 'px';
		}		
	}
	
	// After initial render
	componentDidMount() {
		this.resizeTextarea();
	}
	
	// After every update
	componentDidUpdate() {
		if ( this.textarea ) {
			this.textarea.setSelectionRange(this.state.cursorPos, this.state.cursorPos);
		}

		this.resizeTextarea();
	}
	
	onInput( e ) {
		if ( this.props.onmodify ) {
			this.props.onmodify(e);
		}
		
		e.preventDefault();
		this.setState({'cursorPos': e.target.selectionEnd});
	}

	render( props ) {
//		oninput={(e) => { props.onModify(e); this.onInput(e); }}
		return (
			<textarea {...props} 
				oninput={this.onInput}
				ref={(input) => { this.textarea = input; }} 
			/>
		);
	}
}
