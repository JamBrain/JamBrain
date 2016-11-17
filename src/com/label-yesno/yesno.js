import { h, Component } 				from 'preact/preact';
import SVGIcon							from 'com/svg-icon/icon';

export default class LabelYesNo extends Component {
	constructor() {
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

		return (
			<div class="label-yesno">
			</div>
		);			
	}
}
