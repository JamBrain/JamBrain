import {h, Component} 				from 'preact/preact';

export default class Col extends Component {
	constructor( props ) {
		super(props);
	}

	render( {children, flex = 1, flexBasis = 100} ) {
    // if(!flex) {
    //   flex = 1;
    // }
    var props = Object.assign({}, this.props, {flex: undefined, flexBasis: undefined});

		return (
			<div class="-col" style={`flex: ${flex} ${flex} ${flexBasis}%;`} {...props}>
        {children}
      </div>
		);
	}
}
