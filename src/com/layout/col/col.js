import {h, Component} 				from 'preact/preact';

export default class Col extends Component {
	constructor( props ) {
		super(props);
	}

	render( {children, flex = 1, flexGrow, flexShrink, flexBasis = 100} ) {
	  let props = Object.assign({}, this.props, {
		  flex: undefined,
		  flexBasis: undefined,
		  flexGrow: undefined,
		  flexShrink: undefined
		});

		let flexGrow = flexGrow != undefined
								  ? flexGrow
								  : flex;

		let flexShrink = flexShrink != undefined
								  ? flexShrink
								  : flex;

		return (
		  <div class="-col" style={`flex: ${flexGrow} ${flexShrink} ${flexBasis}%;`} {...props}>
		    {children}
		  </div>
		);
	}
}
