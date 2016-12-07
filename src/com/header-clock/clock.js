import { h, Component }					from 'preact/preact';
import ClockFlip 						from 'com/clock-flip/flip';


export default class HeaderClock extends Component {
	constructor( props ) {
		super(props);
	}

	render( props ) {
		return (
			<div class="header-base header-clock outside">
				<ClockFlip date={new Date()} jumbo />
			</div>
		);
	}
}
