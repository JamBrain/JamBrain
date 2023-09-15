import { Component } from 'preact';
import './more.less';

import {UIButton} from 'com/ui/button';
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
				<UIButton onClick={props.onClick}>MORE</UIButton>
			</nav>
		);
	}
}
