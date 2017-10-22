import {h, Component} 				from 'preact/preact';

export default class Col extends Component {
	constructor( props ) {
		super(props);
	}

	render( {children, flex = 1, flexBasis = 100} ) {
    // if(!flex) {
    //   flex = 1;
    // }

		return (
			<div class="-col" style={`flex: ${flex} ${flex} ${flexBasis}%;`}>
        {children}
      </div>
		);
	}
}
