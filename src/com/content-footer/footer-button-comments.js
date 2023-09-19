import './footer-button.less';

import {Link, Icon, Tooltip} from 'com/ui';
import $Node from 'backend/js/node/node';


export default function ContentFooterButtonComments( props ) {
	const {node, href, ...otherProps} = props;
	if ( node && Number.isInteger(node.comments) ) {
		return <Tooltip text="Comments">
			<Link href={href} class="footer-button footer-button-comments">
				<Icon src="bubbles" />
				<div class="-count">{node.comments}</div>
			</Link>
		</Tooltip>;
	}
	return null;
}
