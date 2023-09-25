import { ContentArticle } from './types';


export function ContentNode( props ) {
	const {children, ...otherProps} = props;

	return <ContentArticle>
		{children}
	</ContentArticle>;
}
