import { diff_match_patch } from 'custom/diff_match_patch/diff_match_patch';

import { h, render }	from 'preact/preact';
import NavBar 			from 'com/nav-bar/code';
import SVGIcon 			from 'com/svg-icon/code';
import DarkOverlay		from 'com/dark-overlay/code';
import Notify			from 'internal/notify/notify';

render(<NavBar />, document.body);
render(<SVGIcon name="firefox" />, document.body);
//render(<DarkOverlay />, document.body);


var a = "The best\n\npart of waking up\nis folgers in your cup\nI think...\n\n???";
var b = "The best\npart of waking up\nis fulgers in your cup\nI think...\n\n???\n";

function diff_lineMode(text1, text2) {
	var dmp = new diff_match_patch();
	var a = dmp.diff_linesToChars(text1, text2);
	var lineText1 = a[0];
	var lineText2 = a[1];
	var lineArray = a[2];
	
	var diffs = dmp.diff_main(lineText1, lineText2, false);
	
	dmp.diff_charsToLines(diffs, lineArray);
	return diffs;
}

var lines = diff_lineMode(a,b);

lines.map( (el) => {
	if ( el[0] == 0 )
		return '  '+el[1];
	else if ( el[0] == -1 )
		return '- '+el[1];
	else if ( el[0] == 1 )
		return '+ '+el[1];
}).map( (el) => {
	console.log(el.replace('\n','¶'));
});
