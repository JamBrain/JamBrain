import { h, Component } from 'preact/preact';
import CoreButton		from 'com/core-button/button';
import SVGIcon 			from 'com/svg-icon/icon';

export default class SidebarCalendar extends Component {
	constructor() {
		this.rows = 3;
		this.columns = 7;

		this.genCalendar( new Date() );
	}

	genCalendar( today ) {
		// TODO: Adjust noted days based on timezone
		// TODO: Adjust selected day/week when time itself rolls over

		let thisDay = today.getDate();
		
		/* Months and Weeks start at 0. Years and Days start at 1. Using 0th day is like -1 */
		let monthEndsOn = new Date(today.getFullYear(),today.getMonth()+1,0).getDate();
		let nextDay = today.getDate() - today.getDay();
		
		if ( nextDay < 1 ) {
			let lastMonth = new Date(today.getFullYear(),today.getMonth(),0);
			monthEndsOn = lastMonth.getDate();
			console.log( lastMonth.getFullYear(), lastMonth.getMonth(), lastMonth.getDate(), lastMonth.getDay() );
			nextDay = lastMonth.getDate() - lastMonth.getDay();
		}
		
		this.data = Array(...Array(this.rows)).map(() => Array.from( Array(this.columns),function(){
			let ret = {
				'day':nextDay
			};
			
			if ( nextDay === thisDay ) {
				ret['selected'] = true;
			}
			
			nextDay++;
			if ( nextDay > monthEndsOn ) {
				nextDay -= monthEndsOn;
			}
			
			return ret;
		}));
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
