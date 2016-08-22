<?php
require_once __DIR__."/../../web.php";
//require_once __DIR__."/../core/config.php";

// http://php.net/manual/en/function.date.php

$_day = intval(date("j"));
$_weekday = intval(date("w"));	// How many days to subtract to get Sunday //
$_dayofyear = intval(date("z"));

template_GetPageHeader();

echo $_day, " ** ", $_weekday, " ** ", $_dayofyear;
?>
<style>
	._hidden {
		display:hidden;
	}
	._invisible {
		visibility:hidden;
	}
	._nosel {
		-webkit-touch-callout: none;
		-webkit-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		user-select: none;
	}
		
	.day {
		display:inline-block;
		cursor:pointer;
		
		border-top:1px solid #888;
		border-left:1px solid #888;
		
		padding:2px 4px;
		
		width:80px;
		height:60px;
	}
	.day:hover {
		background:#DDD;
	}
	.week {
		display:block;
	}
	.month {
		display:inline-block;
		border-right:1px solid #888;
		border-bottom:1px solid #888;
	}
	
	.-saturday, .-sunday {
		background:#EEE;
	}
	
	.-next {
		background:#DDF;
	}
	.-next:hover {
		background:#BBD;
	}
</style>
<div class="month _nosel">
	<?php
	for ( $week = 0; $week < 5; $week++ ) {
	?><div class="week"><?php
		for ( $weekday = 0; $weekday < 7; $weekday++ ) {
			$day = (($weekday+1)+($week*7));
			$div_class = "day";
			
			if ( $weekday == 0 ) {
				$div_class .= " -sunday";
			}
			else if ( $weekday == 6 ) {
				$div_class .= " -saturday";
			}
			
			if ($day > 31) {
				$div_class .= " -next";
			}
			
			$daytext = strval($day);
			
			?><div class="<?=$div_class?>"><?=$daytext?></div><?php
		}
	?></div><?php
	}
	?>
</div>
<?php 
template_GetPageFooter();
