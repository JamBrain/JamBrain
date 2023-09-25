import "./types.less";

export function ContentAside( props ) {
	const {'class': classProp, ...otherProps} = props;
	return <aside class={`content-item ${classProp ?? ''}`} {...otherProps} />;
}

export function ContentArticle( props ) {
	const {'class': classProp, ...otherProps} = props;
	return <article class={`content-item ${classProp ?? ''}`} {...otherProps} />;
}

// Feeds contain content items
export function ContentFeed( props ) {
	const {'class': classProp, ...otherProps} = props;
	return <section role="feed" class={`feed ${classProp ?? ''}`} {...otherProps} />;
}
