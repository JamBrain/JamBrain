import { h, Component } 				from 'preact/preact';
import SVGIcon							from 'com/svg-icon/icon';

export default class LabelYesNo extends Component {
	constructor( props ) {
		super(props);
	}

	componentDidMount() {
	}
	
	render( props ) {
		if ( parseInt(props.value) > 0 ) {
			return (
				<div class="label-yesno">
					<SVGIcon>checkmark</SVGIcon>
				</div>
			);
		}
		else if ( parseInt(props.value) < 0 ) {
			return (
				<div class="label-yesno">
					<SVGIcon>cross</SVGIcon>
				</div>
			);
		}

		// This is actually a "yes, no, maybe"
		return (
			<div class="label-yesno">
			</div>
		);			
	}
}
