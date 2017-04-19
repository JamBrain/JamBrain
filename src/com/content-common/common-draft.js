import { h, Component } 				from 'preact/preact';

export default class ContentCommonDraft extends Component {
	constructor( props ) {
		super(props);
	}

	render( props ) {
		var _class = "content-common-draft" + (props.class ? " "+props.class : "");

		return <div class={_class}>Unpublished Draft</div>;
	}
}
