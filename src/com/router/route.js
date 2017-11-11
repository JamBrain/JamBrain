import {h, Component, cloneElement} from 'preact/preact';

export default class Route extends Component {
	shouldComponentUpdate(nextProps, nextState) {
		if(nextProps.node.id == 0) {
			return false;
		}
	}

	render( props, state ) {
		let {component, render} = props;
		let key = props.node.id;

		if(props.morePaths) {
			key += props.props.extra.join("+");
		}

		let newProps = Object.assign(props.props, {key: key});

		if ( component ) {
			return h(component, props.props);
		}

		if ( render ) {
			return render(newProps);
		}
	}
}
