import { Component } from 'preact';
import './star.less';

import {Icon} from 'com/ui';
import ButtonBase						from 'com/button-base/base';


export default class InputStar extends Component {
	constructor( props ) {
		super(props);
	}

	onClick( index, e ) {
		if ( this.props.onClick ) {
			this.props.onClick(index, e);
		}
	}

	onDelete( e ) {
		if ( this.props.ondelete ) {
			this.props.ondelete(e);
		}
	}

	render( props, state ) {
		let Value = state.value || parseFloat(props.value);
		let Count = Number(props.max) || 5;
		let Title = null;

		let ShowNumber = null;
		if ( props.number ) {
			ShowNumber = <div class="-number">{Value.toFixed(1)}</div>;
		}

		// NOTE: This looks interesting https://codepen.io/jamesbarnett/pen/vlpkh

		let Stars = [];
		let ShowDelete = null;
		if ( props.edit ) {
			// First star is a full star
			Stars.push(
				<ButtonBase class={`-star -hover ${(Value >= 1) ? '-lit' : ''}`} onClick={this.onClick.bind(this, 1)} title={1}>
					<Icon baseline>{'star-full'}</Icon>
				</ButtonBase>
			);

			// Half Stars
			for ( var idx = 3.0/*1.0*/; idx <= Math.floor(Value*2.0); idx++ ) {
				Stars.push(<ButtonBase class="-star -hover -lit" onClick={this.onClick.bind(this, idx*0.5)} title={idx*0.5}><Icon baseline>{'star-'+(idx&1?'left':'right')+'-full'}</Icon></ButtonBase>);
			}
			for ( /*let idx = Math.ceil(Value*2.0)+1*/; idx <= (Count*2.0); idx++ ) {
				Stars.push(<ButtonBase class="-star -hover" onClick={this.onClick.bind(this, idx*0.5)} title={idx*0.5}><Icon baseline>{'star-'+(idx&1?'left':'right')+'-full'/*'-empty'*/}</Icon></ButtonBase>);
//				Stars.push(<ButtonBase class="-star -hover" onClick={this.onClick.bind(this, idx*0.5)} title={idx*0.5}><UIIcon baseline>{'star-'+(idx&1?'left':'right')+'-empty'}</UIIcon></ButtonBase>);
			}

			// Delete button
			if ( props.delete ) {
				ShowDelete = (
					<ButtonBase class="-delete -hover" onClick={this.onDelete.bind(this)}>
						<Icon small baseline>cross</Icon>
					</ButtonBase>
				);
			}
		}
		else {
			for ( let idx = 0; idx < Math.floor(Value); idx++ ) {
				Stars.push(<div class="-star"><Icon small={props.small} baseline>star-full</Icon></div>);
			}
			if ( Value % 1 ) {
				Stars.push(<div class="-star"><Icon small={props.small} baseline>star-half</Icon></div>);
			}
			for ( let idx = Math.ceil(Value); idx < Count; idx++ ) {
				Stars.push(<div class="-star"><Icon small={props.small} baseline>star-empty</Icon></div>);
			}

			Title = Value+' of '+Count;
		}

		return (
			<div class="input-star" title={Title}>
				{props.prefix}
				<div class="-stars">{Stars}</div>
				{ShowNumber}
				{ShowDelete}
				{props.suffix}
			</div>
		);
	}
}
