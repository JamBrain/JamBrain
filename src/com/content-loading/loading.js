import { UISpinner } from 'com/ui';

export default function ContentLoading( props ) {
	return (
		<div class="content">
			{ props.error ? props.error : <UISpinner /> }
		</div>
	);
}
