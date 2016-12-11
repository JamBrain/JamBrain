import { h, Component } 				from 'preact/preact';

import NavSpinner						from 'com/nav-spinner/spinner';
import NavLink 							from 'com/nav-link/link';
import SVGIcon 							from 'com/svg-icon/icon';

import ContentBody						from 'com/content-body/body';
import ContentBodyMarkup				from 'com/content-body-markup/body-markup';

import ContentFooterButtonLove			from 'com/content-footer-button-love/footer-button-love';

import $Node							from '../../shrub/js/node/node';

export default class ContentHeaderCommon extends Component {
	constructor( props ) {
		super(props);
	}

	render( {title, path}, state ) {
		var dangerousParsedTitle = { __html:titleParser.parse(title) };
		
		return (
			<div class="content-header content-header-common">
				<div class="-title _font2">
					<NavLink href={path} dangerouslySetInnerHTML={dangerousParsedTitle} />
				</div>
			</div>
		);
	}
}
