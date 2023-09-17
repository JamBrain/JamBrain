import './common-footer-button.less';

import {Link, Icon} from 'com/ui';

export default function ContentCommonFooterButtonEdit( props ) {
	return <>
		<Link href={props.node.path+"/edit"} class="content-common-footer-button -edit">
			<Icon src="edit" />
		</Link>
	</>;
}
