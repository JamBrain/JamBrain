import PageNavBar						from './bar/bar';
import PageAlert						from './alert/alert';
import PageSidebar						from './sidebar/sidebar';
import PageContent						from './content/content';
import PageFooter						from './footer/footer';

export default function Layout( props ) {
	const {user, featured, node, root, ...otherProps} = props;
	const isLoading = !node || (node.id == 0);

	return <>
		<header aria-label="Ludum Dare">
			<PageNavBar user={user} featured={featured} loading={isLoading}/>
		</header>
		<main>
			<PageAlert user={user} featured={featured} root={root}/>
			<section id="body">
				<PageContent>
					{props.children}
				</PageContent>
				{!props.noSidebar ? <PageSidebar user={user} featured={featured} /> : null}
			</section>
		</main>
		<PageFooter/>
	</>;
}
