import PageNavRoot						from '../../nav/root';

import ContentGames						from 'com/content-games/games';
import Common							from 'com/content-common/common';
import CommonBody						from 'com/content-common/common-body';

import {Link, Icon} from 'com/ui';


export default function PageTag( props ) {
	const {node, user, path, extra, ...otherProps} = props;
	const methods = ['target'];

	// TODO: the <br />'s are gross
	return <>
		<div id="content">
			<PageNavRoot {...props} />
			<Common node={node} user={user} header={node.name} headerIcon="tag">
				<CommonBody>
					<br /><br /><br />
					<div><Link href={node.path+'/..'}><span><Icon src="previous" /> </span>../</Link></div>;
				</CommonBody>
			</Common>
			<ContentGames node={node} user={user} path={path} extra={extra} methods={methods} tags={node.id} />
		</div>
	</>;
}
