import {h}				from 'preact';

import UIImage			from 'com/ui/image';
import UIIcon 			from 'com/ui/icon';
import NavLink 			from 'com/nav-link/link';

export default function ViewSponsor() {
		return (
			<div class="sidebar-base sidebar-shortlist sidebar-sponsor">
				<div class="-title _font2"><UIIcon baseline>trophy</UIIcon> <span class="-text">Sponsored by</span></div>
				<div><a href="/events/ludum-dare/49/$258334/ann-intel-sponsors-ludum-dare-49"><UIImage src="///content/b/z/42d0f.png.w200.png" /></a></div>
				<div><a href="/events/ludum-dare/49/$258334/ann-gamemaker-studio-2-sponsors-ludum-dare-49"><UIImage src="///content/b/z/42d42.png.w200.png" /></a></div>
				<div><a href="/events/ludum-dare/49/$258334/ann-core-sponsors-ludum-dare-49"><UIImage src="///content/b/z/42ebe.png.w200.png" /></a></div>
			</div>
		);
}

