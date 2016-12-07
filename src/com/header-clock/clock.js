import { h, Component }					from 'preact/preact';
import ClockFlip 						from 'com/clock-flip/flip';


export default class HeaderClock extends Component {
	constructor( props ) {
		super(props);
	}

	render( props ) {
		let EventDate = Date.UTC(2016,11,10, 2,0,0);
		
		return (
			<div class="header-base header-clock outside">
				<ClockFlip date={new Date(EventDate)} h1="Ludum Dare" h2="Starts" class="if-no-sidebar-block" comSize="1.3" jumbo={true} />
			</div>
		);
	}
}
