<?php
/*
	ichart is based on Google Image Charts.
	
	https://developers.google.com/chart/image/
	
	Image Charts are depricated, but a lighter weight option for
	generating charts (i.e. Entirely server side at Google).
	
	Use this only for simple charts without much data.
*/

//const ICHART_PIE = 'cht=p';		//	https://developers.google.com/chart/image/docs/gallery/pie_charts
//const ICHART_BAR = 'cht=bvg';		//	https://developers.google.com/chart/image/docs/gallery/bar_charts

// Returns a URL to a chart given the data //
function ichart_GetPie( $width, $height, $data, $label = null ) {
	$url = 'https://chart.googleapis.com/chart?';
	$url .= 'cht=p';
	$url .= '&chs='.$width.'x'.$height;
	
	$url .= '&chd=t:'.implode(',',$data);
	if ( !empty($label) ) {
		$url .= '&chdl='.implode('|',$label);
	}
	
	return $url;
}

?>