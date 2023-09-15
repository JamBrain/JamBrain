import { Component } from 'preact';
import './more.less';

import {Button} from 'com/ui/button';
import {UISpinner} from 'com/ui/spinner';

export default class ContentMore extends Component {
	render( props ) {
		// MK: This is fine as a prop, but don't do loading states, mmkay
		if ( props.loading ) {
			return (
				<nav class="content -more">
					<UISpinner />
				</nav>
			);
		}
		return (
			<nav class="content -more">
				<Button onClick={props.onClick}>MORE</Button>
			</nav>
		);
	}
}
