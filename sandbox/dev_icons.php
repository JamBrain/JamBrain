<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head><title>Render available icons</title></head>
<body style="background: #D0D0D8">
	
<?php 
	// Read the SVG file as an array of lines
	readfile( __DIR__."/../public-ludumdare.com/-/all.min.svg"); 
?>

<style>
.iconDisplay {
	padding:10px; 
	margin:5px; 
	background: #eef2f7;
	float:left;
	font-size: larger;
}
.iconText {
	margin:5px;
	display: inline-block;
}
.svg-icon {
	display: inline-block;
	
	width: 2em;
	height: 2em;
	vertical-align: middle;

	pointer-events: none;	/* disable the hover event that shows the title (title has a different meaning in SVG) */
	
	stroke-width: 0;
	stroke: currentColor;
	fill: currentColor;
}

</style>

<h1>SVG Icons</h1>
SVG Size:  <select onchange="changeStyle(this);" >
<option>1em</option>
<option selected>2em</option>
<option>4em</option>
<option>8em</option>
</select>


<div id="iconPanel"></div>

<script>
	var svg = document.body.getElementsByTagName('svg')[0];
	if ( svg ) {
		svg.setAttribute( 'aria-hidden', 'true' );
		svg.style.position = 'absolute';
		svg.style.width = 0;
		svg.style.height = 0;
		svg.style.overflow = 'hidden';
	}

	// Identify the css rule for .svg-icon
	var iconcss = null;
	for(var i = 0; i < document.styleSheets.length; i++) {
		var stylesheet = document.styleSheets[i];
		for(var j = 0; j < stylesheet.cssRules.length; j++) {
			var rule = stylesheet.cssRules[j];
			if ( rule.selectorText == ".svg-icon" ) {
				iconcss = rule;
				break;
			}
		}
		if ( iconcss ) break;
	}

	function changeStyle(src) {
		var newSize = src.value;
		
		if ( iconcss ) {
			iconcss.style.setProperty("width",newSize);
			iconcss.style.setProperty("height",newSize);
		}
	}


	// Iterate over the icons and add them to the panel
	var panel = document.getElementById('iconPanel');
	
	if ( svg ) {
		var allIcons = [];
		for(var i = 0; i < svg.childNodes.length; i++) {
			allIcons.push(svg.childNodes[i].id);
		}
		allIcons.sort();
		for(var i = 0; i < allIcons.length; i++) {
			var iconid = allIcons[i];
			
			var div = document.createElement('div');
			div.setAttribute('class','iconDisplay');
			
			var iconName = iconid.substring(5);
			
			div.innerHTML = '<svg class="' + iconid + ' svg-icon"><use href="#' + iconid + '"></use></svg><div class="iconText">' + iconName + '</div>';
			
			panel.appendChild(div);
		}
	}
	
</script>

</body></html>
