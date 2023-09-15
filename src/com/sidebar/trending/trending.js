import '../base/base.less';
import {Icon} from 'com/ui';

export default function SidebarTrending() {
	return (
		<div class="sidebar-base sidebar-shortlist sidebar-trending">
			<div class="-title"><Icon baseline>fire</Icon> Live and Trending</div>
			<div class="-item"><strong>#LDJAM</strong> <Icon>trophy</Icon></div>
			<div class="-item"><strong>#BaconJAM</strong></div>
			<div class="-footer">More Jams</div>
		</div>
	);
}
