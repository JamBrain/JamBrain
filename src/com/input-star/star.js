import {h, Component} 					from 'preact/preact';
import {shallowDiff}	 				from 'shallow-compare/index';

import SVGIcon							from 'com/svg-icon/icon';
import ButtonBase						from 'com/button-base/base';


export default class InputStar extends Component {
	constructor( props ) {
		super(props);

		this.state = {
		};
	}

	onClick( e, t, index ) {
		console.log(index);

		// Only do click if the item has an index (i.e. not a separator)
//		if ( e.target.dataset.hasOwnProperty('index') ) {
//			if ( this.props.onmodify ) {
//				this.props.onmodify(parseInt(e.target.dataset.id));
//			}
//
//			this.setState({'value': parseInt(e.target.dataset.index)});
//			this.doHide(e);
//		}
	}

	render( props, state ) {
		let Value = state.value || parseFloat(props.value);
		let Count = parseInt(props.max) || 5;
		let Title = null;

		let ShowNumber = null;
		if ( props.number ) {
			ShowNumber = <div class='-number'>{Value.toFixed(2)}</div>;
		}

		// NOTE: This looks interesting https://codepen.io/jamesbarnett/pen/vlpkh

		let Stars = [];
		if ( props.edit ) {
			// Mini Stars
//			for ( let idx = 1.0; idx <= Math.floor(Value*2.0); idx++ ) {
//				Stars.push(<ButtonBase class='-star -hover' onclick={this.onClick.bind(this, idx*0.5)} title={idx*0.5}><SVGIcon quarter={idx&1} pad={idx&1} baseline>star-full</SVGIcon></ButtonBase>);
//			}
//			for ( let idx = Math.ceil(Value*2.0)+1; idx <= (Count*2.0); idx++ ) {
//				Stars.push(<ButtonBase class='-star -hover' onclick={this.onClick.bind(this, idx*0.5)} title={idx*0.5}><SVGIcon quarter={idx&1} pad={idx&1} baseline>star-empty</SVGIcon></ButtonBase>);
//			}

			// Half Stars
			for ( let idx = 1.0; idx <= Math.floor(Value*2.0); idx++ ) {
				Stars.push(<ButtonBase class='-star -hover' onclick={this.onClick.bind(this, idx*0.5)} title={idx*0.5}><SVGIcon baseline>{'star-'+(idx&1?'left':'right')+'-full'}</SVGIcon></ButtonBase>);
			}
			for ( let idx = Math.ceil(Value*2.0)+1; idx <= (Count*2.0); idx++ ) {
				Stars.push(<ButtonBase class='-star -hover' onclick={this.onClick.bind(this, idx*0.5)} title={idx*0.5}><SVGIcon baseline>{'star-'+(idx&1?'left':'right')+'-empty'}</SVGIcon></ButtonBase>);
			}

			// Delete button
//			if ( props.delete ) {
//				Stars.push(<ButtonBase class='-delete -hover' onclick={this.onGrade.bind(this, Line.key, 0)}><SVGIcon small baseline>cross</SVGIcon></ButtonBase>);
//			}
		}
		else {
			for ( let idx = 0; idx < Math.floor(Value); idx++ ) {
				Stars.push(<div class='-star'><SVGIcon small={props.small} baseline>star-full</SVGIcon></div>);
			}
			if ( Value % 1 ) {
				Stars.push(<div class='-star'><SVGIcon small={props.small} baseline>star-half</SVGIcon></div>);
			}
			for ( let idx = Math.ceil(Value); idx < Count; idx++ ) {
				Stars.push(<div class='-star'><SVGIcon small={props.small} baseline>star-empty</SVGIcon></div>);
			}

			Title = Value+' of '+Count;
		}

		return (
			<div class="input-star" title={Title}>
				{props.prefix}
				{Stars}
				{ShowNumber}
				{props.suffix}
			</div>
		);
	}
}
