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
		let thisWeekday = today.getDay();
		let thisDay = today.getDate();
		let thisMonth = today.getMonth();
		let thisYear = today.getFullYear();
		
		/* Months and Weeks start at 0. Years and Days start at 1. Using 0th day is like -1 */
		let monthEndsOn = new Date(thisYear, thisMonth+1, 0).getDate();
		let nextDay = thisDay - thisWeekday;
		let toggleMonth = false;
		
		if ( nextDay < 1 ) {
			let lastMonth = new Date(thisYear, thisMonth, 0);
			monthEndsOn = lastMonth.getDate();
			//console.log( lastMonth.getFullYear(), lastMonth.getMonth(), lastMonth.getDate(), lastMonth.getDay() );
			nextDay = lastMonth.getDate() - lastMonth.getDay();
			toggleMonth = true;
		}
		
		// TODO: Insert scheduled events here
		let data = Array(...Array(rows)).map(() => Array.from( Array(cols),function(){
			let ret = {
				'year': thisYear,
				'month': thisMonth,
				'day': nextDay
			};
			
			if ( nextDay === thisDay ) {
				ret['selected'] = true;
			}
			if ( toggleMonth ) {
				ret['toggle'] = true;
			}
			
			nextDay++;
			if ( nextDay > monthEndsOn ) {
				nextDay -= monthEndsOn;
				thisMonth++;
				if ( thisMonth > 12 ) {
					thisYear++;
					thisMonth = 1;
				}
				toggleMonth = !toggleMonth;
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
			if ( col.toggle === true ) {
				props.class.push('month');
			}
			props.onclick = (e) => {
				console.log('cal: ',col); 
				window.location.hash = "#cal/"+col.year+"/"+col.month+"/"+col.day;
			};
			// In case Intl extensions are not available
			props.title = col.month+"-"+col.day+"-"+col.year;
			if ( window.Intl ) {
				// http://stackoverflow.com/a/18648314/5678759
				let objDate = new Date(col.year, col.month, col.day);
				props.title = objDate.toLocaleString("en-us", {month:"long", day:"numeric", year:"numeric"});
			}
			
			// Hack
			var ShowIcon = null;
			if ( col.year == 2017 && col.month == 3 && (col.day >= 1 && col.day <= 3) ) {
				if ( col.day === 1 ) {
					ShowIcon = <SVGIcon class="-icon">trophy</SVGIcon>;
				}
				props.class.push('scheduled');
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
