import { Component }					from 'preact';
import '../../page/alert/alert.less';
import ClockFlip 						from 'com/clock-flip/flip';


export default class HeaderClock extends Component {
	constructor( props ) {
		super(props);
	}

	render( props ) {
		return null;

//		let EventDate = Date.UTC(2016,11,10, 2,0,0);
//
//		return (
//			<div class="header-base header-clock outside">
//				<ClockFlip date={new Date(EventDate)} h1="Ludum Dare" h2="Starts" class="_block_if-no-sidebar" comSize="1.3" jumbo={true} />
//			</div>
//		);
	}
}
