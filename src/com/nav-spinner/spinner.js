import {h} 					from 'preact';
import UIIcon 				from 'com/ui/icon';

export default function NavSpinner() {
	// NOTE: We used to need an extra div for IE, which can't apply transformations to SVG elements
	return <div class="nav-spinner"><UIIcon>spinner</UIIcon></div>;
}
