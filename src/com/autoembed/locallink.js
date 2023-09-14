import NavLink from 'com/nav-link/link';
import UIIcon from 'com/ui/icon';
import './locallink.less';

export default function LocalLink( props ) {
	let ShowIcon;
	if (props.hashLink) {
		ShowIcon = (
			<span class="-icon-domain">
				<UIIcon baseline small name={'link'}/>
			</span>
		);
	}
	else {
		ShowIcon = (
			<span class="-icon-domain">
				<UIIcon baseline small name={'l-udum'}/>
				<UIIcon baseline small name={'d-are'}/>
			</span>
		);
	}

	return (
		<span class="smart-link local-link">
			<NavLink href={props.href} title={props.title} target={props.target}>
				<span class="-the-rest">
					{props.text}
				</span>
			</NavLink>
		</span>
	);
}
