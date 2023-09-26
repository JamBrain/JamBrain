import {signal} from "@preact/signals";
import './noob.less';

import {Image, Link, Icon, ButtonIcon} from 'com/ui';
import {ContentAside} from "com/content";

const isNoobHidden = signal(sessionStorage.getItem('noob-hidden') === 'true');

function hideNoob() {
	isNoobHidden.value = true;
	sessionStorage.setItem('noob-hidden', isNoobHidden.value.toString());
}

export default function ContentHeaderNoob() {
	// MK TODO: add image carousel that shows featured games
	return isNoobHidden.value ? null : (
		<ContentAside class="noob -bg">
			<div class="carosel _block_if-sidebar">
				<Image src="https://static-cdn.jtvnw.net/ttv-static/404_preview-320x180.jpg" />
			</div>
			<header class="_font2"><h1>What is Ludum Dare?</h1></header>
			<section>
				<p>Established in 2002, <Link href="/about">Ludum Dare</Link> is an online event that challenges you to make a game from scratch in a weekend. Join us every April and October!</p>
				<p>Get notified about events via email, RSS, social media, or add us to your calender.</p>
				<p>
					<ButtonIcon icon="mail" />
					<ButtonIcon icon="rss" />
					<ButtonIcon icon="twitter" />
					<ButtonIcon icon="calendar" />
				</p>
			</section>
			{/*<ButtonIcon aria-label="close" class="close" onClick={hideNoob} icon="cross" />*/}
		</ContentAside>
	);
}
