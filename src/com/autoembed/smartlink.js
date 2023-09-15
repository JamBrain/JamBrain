import { Icon } from 'com/ui';
import './smartlink.less';

export default function SmartLink(props, {}) {
	return (
		<span class="smart-link">
			<a href={props.full_url} target="_blank" rel="noopener noreferrer">
				<span class="-icon-domain">
					<Icon baseline small>{props.icon_name}</Icon>
					<span class="-domain">{props.domain}</span>
				</span>
				<span class="-the-rest">{props.part_url}</span>
			</a>
		</span>
	);
}
