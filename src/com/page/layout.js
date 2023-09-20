import PageNavBar						from './bar/bar';
import ViewHeader						from 'com/view/header/header';
import ViewSidebar						from 'com/view/sidebar/sidebar';
import ViewContent						from 'com/view/content/content';
import ViewFooter						from 'com/view/footer/footer';

export default function Layout( props ) {
	const {user, featured, node, root, ...otherProps} = props;
	const isLoading = !node || (node.id == 0);

	return <>
		<header aria-label="Ludum Dare">
			<PageNavBar user={user} featured={featured} loading={isLoading}/>
		</header>
		<main>
			<ViewHeader user={user} featured={featured} root={root}/>
			<section id="body">
				<ViewContent>
					{props.children}
				</ViewContent>
				{!props.noSidebar ? <ViewSidebar user={user} featured={featured} /> : null}
			</section>
		</main>
		<ViewFooter/>
	</>;
}
