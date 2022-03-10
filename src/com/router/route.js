import {h, Component}		from 'preact/preact';

export default class Route extends Component {
	/*
	shouldComponentUpdate(nextProps, nextState) {
		if ( nextProps.node.id == 0 ) {
			return false;
		}
		return true;
	}
	*/

	render( props ) {
		let {component, render, params} = props;
/*		let key = props.node.id;

		if ( Object.keys(params).length > 0 ) {
			key += props.props.extra.join("+");
		}
		*/

		// MK: Not a clone (missing {} 1st arg). This might be wrong
//		let newProps = Object.assign(props.props, {"key": key, "params": params});

		if ( component ) {
			return h(component, props.props);
		}

		return null;

//		if ( render ) {
//			return render(newProps);
//		}
	}
}
