import {h, Component, cloneElement} from 'preact/preact';

export default class Route extends Component {

	render( props, state ) {
		let {component, render} = props;

		let newProps = Object.assign(props.props, {key: props.key});

		if (component) {
			return h(component, newProps);
		}

		if (render) {
			return render(newProps);
		}
	}
}
