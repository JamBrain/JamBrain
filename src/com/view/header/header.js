import {HeadlinerNow} from 'com/widget';

import HeaderWarning					from 'com/header/warning/warning';
import HeaderWhatsup					from 'com/header/whatsup/whatsup';
import HeaderClock						from 'com/header/clock/clock';

export default function ViewHeader( props ) {
	let ShowWarning = <HeaderWarning root={props.root} />;
	let ShowWhatsup = <HeaderWhatsup featured={props.featured} />;
	let ShowClock = <HeaderClock featured={props.featured} />;

	return <header>
		<HeadlinerNow featured={props.featured} />
		{ShowWarning}
		{ShowWhatsup}
		{ShowClock}
	</header>;
}
