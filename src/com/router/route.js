import {h, Component, cloneElement}		from 'preact/preact';

export default class Route extends Component {
	shouldComponentUpdate(nextProps, nextState) {
		if ( nextProps.node.id == 0 ) {
			return false;
		}
		return true;
	}

	render( props ) {
		let {component, render, params} = props;
		let key = props.node.id;

		if ( Object.keys(params).length > 0 ) {
			key += props.props.extra.join("+");
		}

		let newProps = Object.assign(props.props, {"key": key, "params": params});

		if ( component ) {
			return h(component, props.props);
		}

		if ( render ) {
			return render(newProps);
		}
	}
}
