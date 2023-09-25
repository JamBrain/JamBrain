import './sponsor.less';
import '../base/base.less';

import {Link, Icon, Image} from 'com/ui';

export default function ViewSponsor() {
	return <>
		<div class="side-item sidebar-shortlist sidebar-sponsor">
			<div class="-title _font2"><Icon class="-baseline" src="trophy" /> <span class="-text">Sponsored by</span></div>
			<div><Link href="https://ludumdare.com/news/akamai-sponsors-ld-2022/"><Image src="///content/b/z/4ee45.png.w200.png" /></Link></div>
		</div>
	</>;
}

