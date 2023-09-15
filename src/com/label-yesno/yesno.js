import { Component } from 'preact';
import './yesno.less';
import {Icon} from 'com/ui';

export default class LabelYesNo extends Component {
	constructor( props ) {
		super(props);
	}

	render( props ) {
		if ( Number(props.value) > 0 ) {
			return (
				<div class="label-yesno">
					<Icon>checkmark</Icon>
				</div>
			);
		}
		else if ( Number(props.value) <= 0 ) {
			return (
				<div class="label-yesno">
					<Icon>cross</Icon>
				</div>
			);
		}
	}
}
