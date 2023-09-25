import PageNavRoot from '../../nav/root';

import ContentGames from 'com/content-games/games';
import ContentArticle from 'com/content-common/common';
import CommonBody from 'com/content-common/common-body';

import {Link, Icon} from 'com/ui';


export default function PageTag( props ) {
	const {node, user, path, extra, ...otherProps} = props;
	const methods = ['target'];

	// TODO: the <br />'s are gross
	return <>
		<div id="content">
			<PageNavRoot {...props} />
			<ContentArticle node_id={node.id} user_id={user.id} header={node.name} headerIcon="tag">
				<CommonBody>
					<br /><br /><br />
					<div><Link href={node.path+'/..'}><span><Icon src="previous" /> </span>../</Link></div>;
				</CommonBody>
			</ContentArticle>
			<ContentGames node={node} user={user} path={path} extra={extra} methods={methods} tags={node.id} />
		</div>
	</>;
}
