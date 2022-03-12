import {h, Component}				from 'preact';
import UIIcon 						from 'com/ui/icon/icon';
import UILink 						from 'com/ui/link/link';

export default class HeaderWarning extends Component {
	constructor( props ) {
		super(props);
	}

	render( props ) {
		let {root} = props;

		if ( root && root.meta && root.meta.message ) {
			return (
				<section class="header -warning outside">
					<UIIcon baseline small src="warning" />
					{root.meta.message}
				</section>
			);
		}

		return null;
	}
}
