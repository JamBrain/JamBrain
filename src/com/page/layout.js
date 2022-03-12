import {h, Component}					from 'preact';

import ViewBar							from 'com/view/bar/bar';
import ViewHeader						from 'com/view/header/header';
import ViewSidebar						from 'com/view/sidebar/sidebar';
import ViewContent						from 'com/view/content/content';
import ViewFooter						from 'com/view/footer/footer';

export default class Layout extends Component {
	render( props ) {
		let {user, featured, node, root} = props;

		let ShowSidebar = (!props.noSidebar ? <ViewSidebar user={user} featured={featured} /> : null);
		let loading = !node || (node.id == 0);

		return (
			<section id="layout">
				<ViewBar user={user} featured={featured} loading={loading}/>
				<ViewHeader user={user} featured={featured} root={root}/>
				<section id="body">
					<ViewContent>
						{props.children}
					</ViewContent>
					{ShowSidebar}
				</section>
				<ViewFooter/>
			</section>
		);
	}
}
