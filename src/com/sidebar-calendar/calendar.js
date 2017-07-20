import { h, Component } 				from 'preact/preact';
import SVGIcon 							from 'com/svg-icon/icon';

export default class SidebarCalendar extends Component {
	constructor( props ) {
		super(props);
	}

	shouldComponentUpdate( nextProps, nextState ) {
		// At the moment, there are no external events that should trigger an update (I ignore my props)
		return false;
	}

	genCalendar( today, rows ) {
		let cols = 7;
		/* Shifts the days to start with a Monday. */
		let startMonday = false; 
		
		let thisWeekday = today.getDay();
		let thisDay = today.getDate();
		let thisMonth = today.getMonth();
		let thisYear = today.getFullYear();
		let originalMonth = thisMonth;
		
		/* Months and Weeks start at 0. Years and Days start at 1. Using 0th day is like -1 */
		let nextDay = thisDay - thisWeekday;
		
		/* Advance the first day in the display to Monday for regions which prefer this style */
		if ( startMonday ) {
			nextDay++;
			if ( nextDay >= thisDay ) {
			  nextDay -= 7;
			}
		}

		/* Normalize date to get the correct year and month for the starting day. */
		let startDay = new Date(thisYear, thisMonth, nextDay);
		nextDay = startDay.getDate();
		thisYear = startDay.getFullYear();
		thisMonth = startDay.getMonth();
		let dayOfWeek = startDay.getDay();
		let monthEndsOn = new Date(thisYear, thisMonth+1, 0).getDate();
		
		// TODO: Insert scheduled events here
		let data = Array(...Array(rows)).map(() => Array.from( Array(cols),function(){
			let ret = {
				'year': thisYear,
				'month': thisMonth,
				'day': nextDay,
				'weekday': dayOfWeek
			};
			
			if ( nextDay === thisDay ) {
				ret['selected'] = true;
			}
			if ( (originalMonth ^ thisMonth) & 1 === 1 ) {
				ret['toggle'] = true;
			}
			
			dayOfWeek++;
			if ( dayOfWeek > 6 ) {
				dayOfWeek = 0;
			}
			
			nextDay++;
			if ( nextDay > monthEndsOn ) {
				nextDay -= monthEndsOn;
				thisMonth++;
				if ( thisMonth >= 12 ) {
					thisYear++;
					thisMonth = 0;
				}
				/* Determine how many days are in this month to allow the calendar generation to proceed indefinitely. */
				monthEndsOn = new Date(thisYear, thisMonth+1, 0).getDate();
			}
			
			return ret;
		}));
		
		return data;
	}

	genRow( row ) {
		return row.map(col => {
			let props = {};
			props.class = [];
			
			if ( col.selected ) {
				props.class.push('selected');
			}
			if ( col.toggle ) {
				props.class.push('month');
			}
			if ( col.weekday == 0 || col.weekday == 6 ) {
				props.class.push('weekend');
			}
			props.onclick = (e) => {
				console.log('cal: ',col); 
				window.location.hash = "#cal/"+col.year+"/"+(col.month+1)+"/"+col.day;
			};
			// In case Intl extensions are not available
			props.title = (col.month+1)+"-"+col.day+"-"+col.year;
			if ( window.Intl ) {
				// http://stackoverflow.com/a/18648314/5678759
				let objDate = new Date(col.year, col.month, col.day);
				props.title = objDate.toLocaleString("en-us", {month:"long", day:"numeric", year:"numeric"});
			}
			
			// Hack
			var ShowIcon = null;
			if ( col.year == 2017 && col.month == 6 && (col.day >= 28 && col.day <= 31) ) {
				if ( col.day === 28 ) {
					ShowIcon = <SVGIcon class="-icon">trophy</SVGIcon>;
				}
				props.class.push('scheduled');
			}
			
//			if ( col.year == 2017 && col.month == 3 && (col.day >= 21 && col.day <= 24) ) {
//				if ( col.day === 21 ) {
//					ShowIcon = <SVGIcon class="-icon">trophy</SVGIcon>;
//				}
//				props.class.push('scheduled');
//			}
//			else if ( col.year == 2017 && col.month == 4 /*4*/ && col.day == 19 ) {
//				ShowIcon = <SVGIcon class="-icon">checker</SVGIcon>;
//				props.class.push('scheduled');
//			}
//			else if ( col.year == 2017 && col.month == 2 && col.day == 24 ) {
//				ShowIcon = <SVGIcon class="-icon">suggestion</SVGIcon>;
//				props.class.push('scheduled');
//			}
//			else if ( col.year == 2017 && col.month == 3 && col.day == 7 ) {
//				ShowIcon = <SVGIcon class="-icon">mallet</SVGIcon>;
//				props.class.push('scheduled');
//			}

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
	
	render( {rows} ) {
		// TODO: Adjust noted days based on timezone
		// TODO: Adjust selected day/week when time itself rolls over

		let data = this.genCalendar(new Date(), rows ? rows : 3);
		
		return (
			<div class="sidebar-base sidebar-calendar">
				{data.map(row => this.genWeek(row))} 
			</div>
		);
	}
}
