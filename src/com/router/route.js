import {h, Component, cloneElement} from 'preact/preact';

export default class Route extends Component {

	componentWillReceiveProps( next ) {
        if(next.node.id != this.props.node.id) {
            this.forceUpdate();
        }
    }

	componentDidMount() {
		console.log("mounted", this.props.key);
	}

	render( props, state ) {
		let {component, render} = props;

		let newProps = Object.assign(props.props, {key: props.key});

		if ( component ) {
			return h(component, props.props);
		}

		if ( render ) {
			return render(newProps);
		}
	}
}
