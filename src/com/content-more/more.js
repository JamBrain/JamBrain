import {h, Component}		from 'preact';

import UIButton				from 'com/ui/button';
import NavSpinner			from 'com/nav-spinner/spinner';

export default class ContentMore extends Component {
	render( props ) {
		// MK: This is fine as a prop, but don't do loading states, mmkay
		if ( props.loading ) {
			return (
				<nav class="content -more">
					<NavSpinner />
				</nav>
			);
		}
		return (
			<nav class="content -more">
				<UIButton onClick={props.onClick}>MORE</UIButton>
			</nav>
		);
	}
}
