import './warning.less';
import '../header.less';

import {UIIcon} from 'com/ui';

export default function HeaderWarning( props ) {
	let {root} = props;

	if ( root && root.meta && root.meta.message ) {
		return (
			<section class="header -warning outside">
				<UIIcon baseline small src="warning" />
				{root.meta.message}
			</section>
		);
	}

	return null;
}
