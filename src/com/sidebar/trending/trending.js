import '../base/base.less';
import {Icon} from 'com/ui';

export default function SidebarTrending() {
	return (
		<div class="side-item sidebar-shortlist sidebar-trending">
			<div class="-title"><Icon class="-baseline" src="fire" /> Live and Trending</div>
			<div class="-item"><strong>#LDJAM</strong> <Icon src="trophy" /></div>
			<div class="-item"><strong>#BaconJAM</strong></div>
			<div class="-footer">More Jams</div>
		</div>
	);
}
