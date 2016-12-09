import { h, Component } 				from 'preact/preact';

export default class ContentBody extends Component {
	constructor( props ) {
		super(props);
	}

	render( props ) {
		// '-body' for backwards compatibility (remove me)
		var _class = "content-body -body" + (props.class ? " "+props.class : "");

		return <div class={_class}>{props.children}</div>;
	}
}
