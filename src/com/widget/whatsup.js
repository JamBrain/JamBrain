import "./whatsup.less";
import "com/page/alert/alert.less";

import {Icon, Link} from 'com/ui';


function Side( title, children ) {
	return <aside class="side-item whatsup outside _block_if-sidebar">
		<span class="-title _font2">{title}</span> {children}
	</aside>;
}

export function SidebarWhatsup( props ) {
	return DoWhatsup( Side, props );
}

function Alert( title, children ) {
	return <aside class="alert-item whatsup outside _block_if-no-sidebar">
		<span class="-title _font2">{title}</span> {children}
	</aside>;
}

export function AlertWhatsup( props ) {
	return DoWhatsup( Alert, props );
}

function DoWhatsup( func, props ) {
	const {featured} = props;

	if ( !featured || !featured.meta )
		return null;

	const eventMode = Number(featured.meta['event-mode']) ?? 0;
	const eventHasTheme = featured.meta['event-theme'];

	if ( eventMode == 1 ) {			// Theme Suggestions
		return func("ON NOW:", <>{featured.name} <Link href={featured.path+'/theme'}><Icon class="-baseline -small" src="lightbulb" /> Theme Suggestions</Link> are open!</>);
	}
	else if ( eventMode == 2 ) {	// Theme Slaughter
		return func("ON NOW:", <>{featured.name} <Link href={featured.path+'/theme'}><Icon class="-baseline -small" src="fire" /> Theme Slaughter Round</Link></>);
	}
	else if ( eventMode == 3 ) {	// Theme Fusion
		return func("ON NOW:", <>{featured.name} <Link href={featured.path+'/theme'}><Icon class="-baseline -small" src="fire" /> Theme Fusion Round</Link></>);
	}
	else if ( eventMode == 4 ) {	// Theme Voting
		return func("ON NOW:", <>{featured.name} <Link href={featured.path+'/theme'}><Icon class="-baseline -small" src="ticket" /> Theme Voting</Link></>);
	}
	else if ( eventMode == 5 ) {
		// Theme is revealed
		if ( eventHasTheme ) {
			return func("ON NOW:", <><Link href={featured.path}><Icon class="-baseline -small" src="trophy" /> {featured.name}</Link> <span class="-title _font2">Theme:</span> {featured.meta['event-theme']}</>);
		}
		// Theme is not yet revealed
		else {
			return func("ON NOW:", <><Link href={featured.path}><Icon class="-baseline -small" src="trophy" /> {featured.name}</Link> Theme Announcement Soon! <Link href="https://twitter.com/ludumdare"><Icon class="-baseline -small" src="twitter" /> Check Twitter</Link></>);
		}
	}
	else if ( eventMode == 6 && eventHasTheme ) {
		return func("RATINGS+FEEDBACK & EXTRA ON NOW:", <><Link href={featured.path}><Icon class="-baseline -small" src="trophy" /> {featured.name}</Link> <span class="-title _font2">Theme:</span> {featured.meta['event-theme']}</>);
	}
	else if ( eventMode == 7 && eventHasTheme) {
		return func("RESULTS SOON:", <><Link href={featured.path}><Icon class="-baseline -small" src="trophy" /> {featured.name}</Link>. This can take a while (hours). <Link href="https://twitter.com/ludumdare"><Icon class="-baseline -small" src="twitter" /> Stay tuned</Link></>);
	}
	else if ( eventMode == 8 && eventHasTheme ) {
		return func("RESULTS:", <><Link href={featured.path+'/results'}><Icon class="-baseline -small" src="trophy" /> {featured.name}</Link></>);
	}

	// Unknown mode
	return null;
}
