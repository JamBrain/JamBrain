import {signal} from "@preact/signals";

import './noob.less';

import {Link, ButtonIcon} from 'com/ui';
import {ContentAside} from "com/content";

const isNoobHidden = signal(sessionStorage.getItem('noob-hidden') === 'true');

function hideNoob() {
	isNoobHidden.value = true;
	sessionStorage.setItem('noob-hidden', isNoobHidden.value.toString());
}

export default function ContentHeaderNoob() {
	return isNoobHidden.value ? null : (
		<ContentAside class="noob -bg">
			<header class="_font2"><h1>What is Ludum Dare?</h1></header>
			<section>
				<p>
					<Link href="/about">Ludum Dare</Link> is an online event where games are made from scratch in a weekend. Check us out every April and October!
				</p>
			</section>
			<ButtonIcon aria-label="close" class="close" onClick={hideNoob} icon="cross" />
		</ContentAside>
	);
}
