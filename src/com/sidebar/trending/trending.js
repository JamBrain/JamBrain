import '../base/base.less';
import {UIIcon} from 'com/ui';

export default function SidebarTrending() {
	return (
		<div class="sidebar-base sidebar-shortlist sidebar-trending">
			<div class="-title"><UIIcon baseline>fire</UIIcon> Live and Trending</div>
			<div class="-item"><strong>#LDJAM</strong> <UIIcon>trophy</UIIcon></div>
			<div class="-item"><strong>#BaconJAM</strong></div>
			<div class="-footer">More Jams</div>
		</div>
	);
}
