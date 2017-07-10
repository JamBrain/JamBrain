import { h, Component } 				from 'preact/preact';
import { shallowDiff }	 				from 'shallow-compare/index';

import NavLink							from 'com/nav-link/link';
import SVGIcon							from 'com/svg-icon/icon';

export default class InputText extends Component {
	constructor( props ) {
		super(props);
		
		this.onModify = this.onModify.bind(this);
	}

	shouldComponentUpdate( nextProps ) {
		return shallowDiff(this.props, nextProps);
	}
	
	onModify( e ) {
		if ( this.props.onmodify )
			this.props.onmodify(e);
	}
	
	render( props ) {
		//props = Object.assign({}, props);
		
		var ShowLimit = null;
		if ( props.maxlength )
			ShowLimit = <div class="-right"><span class="-chars">{props.value.length}</span>/<span class="-limit">{props.maxlength}</span></div>;

		return (
			<div class="input-text">
				<input {...props}
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
