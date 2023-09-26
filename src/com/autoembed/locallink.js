import {Link, Icon} from 'com/ui';
import './locallink.less';

/**
 * @typedef LocalLinkProps
 * @property {string} href
 * @property {string} [text]
 * @property {string} [title]
 * @property {string} [target]
 * @property {boolean} [hashLink]
 */

/**
 * @deprecated
 * @param {LocalLinkProps} props
 * */
export default function LocalLink( props ) {
	let ShowIcon;
	if (props.hashLink) {
		ShowIcon = (
			<span class="-icon-domain">
				<Icon class="-baseline -small" src="link" />
			</span>
		);
	}
	else {
		ShowIcon = (
			<span class="-icon-domain">
				<Icon class="-baseline -small" src="l-udum" />
				<Icon class="-baseline -small" src="d-are" />
			</span>
		);
	}

	return (
		<span class="smart-link local-link">
			<Link href={props.href} title={props.title} target={props.target}>
				<span class="-the-rest">
					{props.text}
				</span>
			</Link>
		</span>
	);
}
