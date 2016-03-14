<?php
require_once __DIR__."/../web.php";
//require_once __DIR__."/../core/config.php";

template_GetPageHeader();
?>
<style>
	.day {
		display:inline-block;
		width:80px;
		height:60px;
		
		border-top:1px solid #888;
		border-left:1px solid #888;
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
</style>
<div class="month">
	<?php
	for ( $week = 0; $week < 5; $week++ ) {
	?><div class="week"><?php
		for ( $day = 0; $day < 7; $day++ ) {
			if ( $day == 0 ) {
				?><div class="day -sunday"><?= (($day+1)+($week*7)) ?></div><?php
			}
			else if ( $day == 6 ) {
				?><div class="day -saturday"><?= (($day+1)+($week*7)) ?></div><?php
			}
			else {
				?><div class="day"><?= (($day+1)+($week*7)) ?></div><?php
			}
		}
	?></div><?php
	}
	?>
</div>
<?php 
template_GetPageFooter();
