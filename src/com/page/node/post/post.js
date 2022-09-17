import {h, Component, Fragment}	from 'preact';
import PageNavContent			from '../../nav/content';
import ViewContentPost			from 'com/view/content/content-post';

export default class PagePost extends Component {
	render( props ) {
		let {node, user, path, extra} = props;

		let EditMode = extra && extra.length && (extra[extra.length-1] == 'edit');

		return (
			<Fragment>
				<PageNavContent {...props} />
				<ViewContentPost node={node} user={user} path={path} extra={extra} edit={EditMode} />
			</Fragment>
		);
	}
}
