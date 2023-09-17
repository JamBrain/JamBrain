import './footer-button.less';

import {Link, Icon} from 'com/ui';
import $Node from 'backend/js/node/node';


export default function ContentFooterButtonComments( props ) {
	const {node, href, ...otherProps} = props;
	if ( node && Number.isInteger(node.comments) ) {
		return <>
			<Link href={href} class="footer-button footer-button-comments" title="Comments">
				<Icon src="bubbles" />
				<div class="-count">{node.comments}</div>
			</Link>
		</>;
	}
	return null;
}
