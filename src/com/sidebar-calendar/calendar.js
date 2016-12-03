import { h, Component } from 'preact/preact';
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
		let thisMonth = today.getMonth();
		let thisYear = today.getFullYear();
		
		/* Months and Weeks start at 0. Years and Days start at 1. Using 0th day is like -1 */
		let monthEndsOn = new Date(today.getFullYear(), today.getMonth(), 0).getDate();
		let nextDay = today.getDate() - today.getDay();
		
		if ( nextDay < 1 ) {
			let lastMonth = new Date(today.getFullYear(),today.getMonth(),0);
			monthEndsOn = lastMonth.getDate();
			//console.log( lastMonth.getFullYear(), lastMonth.getMonth(), lastMonth.getDate(), lastMonth.getDay() );
			nextDay = lastMonth.getDate() - lastMonth.getDay();
		}
		
		this.data = Array(...Array(this.rows)).map(() => Array.from( Array(this.columns),function(){
			let ret = {
				'year': thisYear,
				'month': thisMonth,
				'day': nextDay
			};
			
			if ( nextDay === thisDay ) {
				ret['selected'] = true;
			}
			
			nextDay++;
			if ( nextDay > monthEndsOn ) {
				nextDay -= monthEndsOn;
				thisMonth++;
				if ( thisMonth > 12 ) {
					thisYear++;
					thisMonth = 1;
				}
			}
			
			return ret;
		}));
	}

	genRow( row ) {
		return row.map(col => {
			let props = {};
			if ( col.selected ) {
				props.class = "selected";
			}
			props.onclick = (e) => {
				console.log('cal: ',col); 
				window.location.hash = "#cal/"+col.year+"/"+col.month+"/"+col.day;
			};
			// In case Intl extensions are not available
			props.title = col.month+"-"+col.day+"-"+col.year;
			if ( window.Intl ) {
				// http://stackoverflow.com/a/18648314/5678759
				let objDate = new Date(col.year, col.month-1, col.day);
				props.title = objDate.toLocaleString("en-us", {month:"long", day:"numeric", year:"numeric"});
			}
			
			// Hack
			var ShowIcon = null;
			if ( col.year == 2016 && col.month == 12 && (col.day >= 9 && col.day <= 12) ) {
				ShowIcon = <SVGIcon class="-icon">trophy</SVGIcon>;
			}

			return (
				<div {...props}>
					{ShowIcon}
					<div class="-text">{col.day}</div>
				</div>
			); 
		});
	}
	
	genWeek( row ) {
		return (
			<div class="-week">
			{this.genRow(row)}
			</div>
		);
	}
	
	render( props ) {
		return (
			<div class="sidebar-base sidebar-calendar">
			{this.data.map(row => this.genWeek(row))} 
			</div>
		);
	}
}
