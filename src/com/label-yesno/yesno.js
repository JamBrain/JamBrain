import './yesno.less';
import {Icon} from 'com/ui';

export default function LabelYesNo( props ) {
	const {value} = props;
	if ( Number(value) > 0 ) {
		return (
			<div class="label-yesno">
				<Icon src="checkmark" />
			</div>
		);
	}
	else if ( Number(value) <= 0 ) {
		return (
			<div class="label-yesno">
				<Icon src="cross" />
			</div>
		);
	}
}
