import {h, Component}					from 'preact/preact';
import PageNavEventMy					from '../../../nav/event-my';

export default class EventMy extends Component {
	constructor( props ) {
		super(props);
	}

	render( props ) {
		return (
			<div>
				<PageNavEventMy {...props} />
				<div class="content-common event-my" style="overflow: overlay">
					<div class="content-common-body">
						<p>Things about you this event go here.</p>
						<p>Right now, that's only the button above that lets you see what games you've rated.</p>
					</div>
				</div>
			</div>
		);
	}
}
