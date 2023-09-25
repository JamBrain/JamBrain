import {signal} from '@preact/signals';
import './common.less';
import './common-footer-button.less';

import {Icon, Button} from 'com/ui';


/**
 * @typedef ButtonMinMaxProps
 * @property {string} [class]
 * @property {*} [onClick]
 */

/**
 * @param {ButtonMinMaxProps} props
 */
export function ButtonMinMax( props ) {
	const {onClick, ...otherProps} = props;

	return (
		<Button aria-label="minimize" onClick={onClick} {...otherProps}>
			<Icon class="_inline-if-not-minimized" src="arrow-up" />
			<Icon class="_inline-if-minimized" src="arrow-down" />
		</Button>
	);
}

/**
 * @typedef ButtonCommentProps
 * @property {number} count
 * @property {string} href
 * @property {string} [class]
 */

/**
 * @param {ButtonCommentProps} props
 */
export function ButtonComment( props ) {
	const {count, 'class': classProp, ...otherProps} = props;
	const countClass = (count >= 10) ? 'popular' : ((count >= 1) ? 'nonzero' : '');

	return (
		<Button aria-label="view comments" class={`${countClass} ${classProp ?? ''}`} {...otherProps} data-count={count}>
			<Icon src="bubbles" />
		</Button>
	);
}


/**
 * @typedef ButtonEditProps
 * @property {string} href
 * @property {string} [class]
 */

/**
 * @param {ButtonEditProps} props
 */
export function ButtonEdit( props ) {
	return <Button aria-label="edit" {...props}><Icon src="edit" /></Button>;
}



export function ButtonLove( props ) {
	const {count, 'class': classProp, ...otherProps} = props;
	const countClass = (count >= 10) ? 'popular' : ((count >= 1) ? 'nonzero' : '');

	return (
		<Button aria-label="love" class={`${countClass} ${classProp ?? ''}`} {...otherProps} data-count={count}>
			<Icon class="-hover-hide" src="heart" />
			<Icon class="-hover-show -loved-hide" src="heart-plus" />
			<Icon class="-hover-show -loved-show" src="heart-minus" />
			<span>{count}</span>
		</Button>
	);
}


/**
 * @typedef ContentArticleProps
 * @property {number} node_id
 * @property {string} [path]
 * @property {number} [user_id]
 * @property {boolean} [footer] - If present, always show a footer
 * @property {boolean} [minimized]
 * @property {boolean} [minmax]
 * @property {number} [love]
 * @property {number} [comment]
 * @property {boolean} [edit]
 * @property {string} [class]
 * @property {*} [children]
 */

/**
 * @param {ContentArticleProps} props
 */
export default function ContentArticle( props ) {
	let {node_id, path, user_id = 0, footer, minimized = false, minmax, love, comment, edit, 'class': classProp, children, ...otherProps} = props;

	// Fetch the state from local storage, otherwise use the optional default value
	const minimizedStateKey = `article-${node_id}--${user_id}-minimized`;
	const minimizedStorage = localStorage;
	const minimizedState = minimizedStorage.getItem(minimizedStateKey) ? !!minimizedStorage.getItem(minimizedStateKey) : undefined;
	let isMinimized = signal(minimizedState ?? minimized);

	let leftFooter = [];
	if ( minmax ) {
		leftFooter.push(<ButtonMinMax onClick={() => {
			isMinimized.value = !isMinimized.value;
			minimizedStorage.setItem(minimizedStateKey, isMinimized.toString());
		}} />);
	}

	let rightFooter = [];
	/*
	if ( props['star'] )
		rightFooter.push(<FooterButtonStar {...props} />);
	*/
	if ( love ) {
		const lovedStateKey = `article-${node_id}--${user_id}-loved`;
		const loveStorage = sessionStorage;
		const lovedState = loveStorage.getItem(lovedStateKey) ? !!loveStorage.getItem(lovedStateKey) : undefined;
		let isLoved = signal(lovedState ?? false);

		rightFooter.push(<ButtonLove count={love} loved={isLoved} onClick={() => {
			// TODO: post love to server
			isLoved.value = !isLoved.value;
			loveStorage.setItem(lovedStateKey, isLoved.toString());
		}} />);
	}
	if ( path && comment ) {
		rightFooter.push(<ButtonComment count={comment} href={`${path}#comments`} />);
	}
	if ( path && edit ) {
		rightFooter.push(<ButtonEdit href={`${path}/edit`} />);
	}

	const hasFooterItems = (leftFooter.length + rightFooter.length) > 0;

	const showFooter = footer || hasFooterItems ? (
		<footer>
			{leftFooter.length ? <section class="left">{leftFooter}</section> : null}
			{rightFooter.length ? <section class="right">{rightFooter}</section> : null}
		</footer>
	) : null;

	return (
		<article class={`common-article ${(isMinimized ? "-minimized" : '')} ${classProp ?? ''}`}>
			{children}
			{showFooter}
		</article>
	);
}
