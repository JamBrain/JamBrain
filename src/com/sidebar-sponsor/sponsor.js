import { h, Component }					from 'preact/preact';

export default class ViewSidebar extends Component {
	constructor( props ) {
		super(props);
	}

	render( {}, {} ) {
		/* If event is active, and it's sponsored */
		if ( false ) {
			return (
				<div class="sidebar-sponsor">
					Sponsor
				</div>
			);
		}
		return null;
	}
};

