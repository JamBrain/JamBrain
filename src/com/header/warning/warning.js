import {h, Component}				from 'preact/preact';
import UIIcon 						from 'com/ui/icon/icon';
import UILink 						from 'com/ui/link/link';

export default class HeaderWarning extends Component {
	constructor( props ) {
		super(props);
	}

	render( props ) {
		let {root} = props;

		if ( root ) {
			if ( root.message ) {
				return (
					<div class="header-base header-warning outside">
						<UIIcon baseline small src="warning" /> {root.message}
					</div>
				);
			}
		}

		return null;
	}
}
