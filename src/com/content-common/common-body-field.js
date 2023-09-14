import {Component} from 'preact';
import cN from 'classnames';

import InputText						from 'com/input-text/text';

export default class ContentCommonBodyField extends Component {
	constructor( props ) {
		super(props);
	}

	render( props ) {
		var Class = ["body","-field"];

		var Limit = 64;
		var Placeholder = props.placeholder ? props.placeholder : 'Field';

		if (props.editing) {
			Class.push('-editing');
			return (
				<div class={`${Class ?? ''} ${props.class ?? ''}`}>
					<div class="-label">{props.label ? props.label : ""}</div>
					<InputText
						value={props.value}
						onModify={props.onModify}
						placeholder={Placeholder}
						maxLength={Limit}
					/>
				</div>
			);
		}
		else {
			return <div class={`${Class ?? ''} ${props.class ?? ``}`}>{props.value}</div>;
		}
	}
}
