import {h, Component} 					from 'preact/preact';
import {shallowDiff}	 				from 'shallow-compare/index';

import SVGIcon							from 'com/svg-icon/icon';
import ButtonBase						from 'com/button-base/base';


export default class InputStar extends Component {
	constructor( props ) {
		super(props);
	}

	onClick( index, e ) {
		if ( this.props.onclick ) {
			this.props.onclick(index, e);
		}
	}

	onDelete( e ) {
		if ( this.props.ondelete ) {
			this.props.ondelete(e);
		}
	}

	render( props, state ) {
		let Value = state.value || parseFloat(props.value);
		let Count = parseInt(props.max) || 5;
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
				<ButtonBase class={cN("-star -hover", (Value >= 1) ? '-lit' : '')} onclick={this.onClick.bind(this, 1)} title={1}>
					<SVGIcon baseline>{'star-full'}</SVGIcon>
				</ButtonBase>
			);

			// Half Stars
			for ( var idx = 3.0/*1.0*/; idx <= Math.floor(Value*2.0); idx++ ) {
				Stars.push(<ButtonBase class="-star -hover -lit" onclick={this.onClick.bind(this, idx*0.5)} title={idx*0.5}><SVGIcon baseline>{'star-'+(idx&1?'left':'right')+'-full'}</SVGIcon></ButtonBase>);
			}
			for ( /*let idx = Math.ceil(Value*2.0)+1*/; idx <= (Count*2.0); idx++ ) {
				Stars.push(<ButtonBase class="-star -hover" onclick={this.onClick.bind(this, idx*0.5)} title={idx*0.5}><SVGIcon baseline>{'star-'+(idx&1?'left':'right')+'-full'/*'-empty'*/}</SVGIcon></ButtonBase>);
//				Stars.push(<ButtonBase class="-star -hover" onclick={this.onClick.bind(this, idx*0.5)} title={idx*0.5}><SVGIcon baseline>{'star-'+(idx&1?'left':'right')+'-empty'}</SVGIcon></ButtonBase>);
			}

			// Delete button
			if ( props.delete ) {
				ShowDelete = (
					<ButtonBase class="-delete -hover" onclick={this.onDelete.bind(this)}>
						<SVGIcon small baseline>cross</SVGIcon>
					</ButtonBase>
				);
			}
		}
		else {
			for ( let idx = 0; idx < Math.floor(Value); idx++ ) {
				Stars.push(<div class="-star"><SVGIcon small={props.small} baseline>star-full</SVGIcon></div>);
			}
			if ( Value % 1 ) {
				Stars.push(<div class="-star"><SVGIcon small={props.small} baseline>star-half</SVGIcon></div>);
			}
			for ( let idx = Math.ceil(Value); idx < Count; idx++ ) {
				Stars.push(<div class="-star"><SVGIcon small={props.small} baseline>star-empty</SVGIcon></div>);
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
