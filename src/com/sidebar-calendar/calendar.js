import { h, Component } from 'preact/preact';
import CoreButton		from '../core-button/code';
import SVGIcon 			from 'com/svg-icon/code';

export default class SidebarCalendar extends Component {
	constructor() {
		this.rows = 3;
		this.columns = 7;
		let cell = {
			'day':0
		};
		
		this.data = Array(...Array(this.rows)).map(() => Array.from( Array(this.columns),() => (Object.assign({},cell))) );

		this.data[1][1].selected = true;
	}

	genRow(row) {
		return row.map( function(col) {
			let props = {};
			if ( col.selected ) {
				props.class = "selected";
			}

			return (<div {...props}>{col.day}</div>) 
		});
	}
	
	render( props, state ) {
		return (
			<div class="sidebar-calendar"> {
				this.data.map(
				row => (<div class="-week">{ this.genRow(row) }</div>) )
			} </div>
		);
	}
}
