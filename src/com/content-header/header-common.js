import './header-common.less';
import titleParser						from 'internal/titleparser';

import {Link} from 'com/ui';

import ContentBody						from 'com/content-body/body';
import ContentBodyMarkup				from 'com/content-body/body-markup';

import $Node							from 'backend/js/node/node';

export default function ContentHeaderCommon( props ) {
	const {title, path, ...otherProps} = props;
	const dangerousParsedTitle = { '__html': titleParser(title) };

	return <>
		<div class="content-header content-header-common">
			<div class="-title _font2">
				<Link href={path} dangerouslySetInnerHTML={dangerousParsedTitle} />
			</div>
		</div>
	</>;
}
