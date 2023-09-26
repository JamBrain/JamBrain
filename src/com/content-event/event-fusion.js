import $ThemeIdea						from 'backend/js/theme/theme_idea';

export default function ContentEventFusion( props ) {
	const {user} = props;
	const Title = <h3>Theme Fusion Round</h3>;

	if ( user && user['id'] ) {
		return <div class="-body">
			{Title}
			<div>welcome</div>
		</div>;
	}
	else {
		return <div class="-body">
			{Title}
			<div>Please log in</div>
		</div>;
	}
}
