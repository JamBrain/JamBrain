import './common-footer-button.less';

import {Link, Icon, Tooltip} from 'com/ui';

export default function ContentCommonFooterButtonComments( props ) {
	const {node, ...otherProps} = props;

	if (node) {
		let countStyle = '';
		if ( node.comments >= 10 )
			countStyle = '-count-10';
		else if ( node.comments >= 4 )
			countStyle = '-count-4';
		else if ( node.comments >= 1 )
			countStyle = '-count-1';

		if ( Number.isInteger(node.comments) ) {
			return <Tooltip text="Comments">
				<Link href={node.path} class={`content-common-footer-button -comments ${countStyle}`}>
					<Icon src="bubbles" />
					<div class="-count">{node.comments}</div>
				</Link>
			</Tooltip>;
		}
	}
	return null;
}
