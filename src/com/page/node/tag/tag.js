import {h, Component}					from 'preact/preact';
import PageNavRoot						from '../../nav/root';

import ContentGames						from 'com/content-games/games';
import Common							from 'com/content-common/common';
import CommonBody						from 'com/content-common/common-body';

import NavLink 							from 'com/nav-link/link';
import UIIcon							from 'com/ui/icon/icon';


export default class PageTag extends Component {
	constructor( props ) {
		super(props);
	}

	render( props, state ) {
		let {node, user, path, extra} = props;

		let Methods = ['target'];

		let body = <div><NavLink href={node.path+'/..'}><span><UIIcon src="previous" /> </span>../</NavLink></div>;
		return (
			<div id="content">
				<PageNavRoot {...props} />
				<Common node={node} user={user} header={node.name} headerIcon='tag'>
					<CommonBody>
						<br /><br /><br />
						{body}
					</CommonBody>
				</Common>
				<ContentGames node={node} user={user} path={path} extra={extra} methods={Methods} tags={node.id} />
			</div>
		);
	}
}
