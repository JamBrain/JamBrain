import { Component } from 'preact';
import UIIcon from 'com/ui/icon';

export default class LabelYesNo extends Component {
	constructor( props ) {
		super(props);
	}

	render( props ) {
		if ( Number(props.value) > 0 ) {
			return (
				<div class="label-yesno">
					<UIIcon>checkmark</UIIcon>
				</div>
			);
		}
		else if ( Number(props.value) <= 0 ) {
			return (
				<div class="label-yesno">
					<UIIcon>cross</UIIcon>
				</div>
			);
		}
	}
}
