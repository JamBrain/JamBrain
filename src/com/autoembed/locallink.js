import {Link, Icon} from 'com/ui';
import './locallink.less';

export default function LocalLink( props ) {
	let ShowIcon;
	if (props.hashLink) {
		ShowIcon = (
			<span class="-icon-domain">
				<Icon baseline small name={'link'}/>
			</span>
		);
	}
	else {
		ShowIcon = (
			<span class="-icon-domain">
				<Icon baseline small name={'l-udum'}/>
				<Icon baseline small name={'d-are'}/>
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
