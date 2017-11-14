import { h, Component }					from 'preact/preact';

import ClockComponent					from 'com/clock-base/clock';
import SidebarCountdown					from 'com/sidebar/countdown/countdown';

export default class ViewSingle extends Component {
	constructor( props ) {
		super(props);
	}

	render( props, state ) {
		let jamEndDate = new Date(Date.UTC(2016, 11, 13, 2, 0, 0));
		let compoEndDate = new Date(Date.UTC(2016, 11, 12, 2, 0, 0));
		let ldStartDate = new Date(Date.UTC(2016, 11, 10, 2, 0, 0));

		let n = new Date();

		if (n < ldStartDate) {
			return (
				<div id="header">
					<ClockComponent date={ ldStartDate } h1="Ludum Dare" h2="Starts" classes="mobile-only" comSize="1.2" jumbo={true} />
				</div>
			);
		}
		else {
			return (
				<div id="header">
					<ClockComponent date={ compoEndDate } classes="compo not-mobile" h1="Compo" h2="Ends" jumbo={false} displayAfterHours={5} urgentAfterHours={3} comSize="2" />
					<ClockComponent date={ jamEndDate } classes="compo not-mobile" h1="Jam" h2="Ends" jumbo={false} displayAfterHours={5} urgentAfterHours={3} comSize="2" />
					<ClockComponent date={ compoEndDate } classes="compo mobile-only" h1="Compo" h2="Ends" jumbo={true} comSize="1.2" />
					<ClockComponent date={ jamEndDate } classes="compo mobile-only" h1="Jam" h2="Ends" jumbo={true} comSize="1.2" />
				</div>
			);
		}
	}
};
