import {AlertWhatsup} from 'com/widget';

import HeaderWarning from 'com/header/warning/warning';
import HeaderClock from 'com/header/clock/clock';

export default function PageAlert( props ) {
	let ShowWarning = <HeaderWarning root={props.root} />;
	let ShowClock = <HeaderClock featured={props.featured} />;

	return <header id="alert">
		<AlertWhatsup featured={props.featured} />
		{ShowWarning}
		{ShowClock}
	</header>;
}
