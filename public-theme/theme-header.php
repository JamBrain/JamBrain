<?php

function ShowHeader() {
	global $EVENT_NAME, $EVENT_MODE, $EVENT_DATE;
	if ( isset($EVENT_NAME) ) {
		echo "<div class='hidden'>Hi there! If you're seeing this, then your security software wont let you access 'static.ldjam.org'. If you're running McAfee, AVG, Norton, or such, add an exception for 'static.ldjam.org'.<br /></div>";
		echo "<div class='event bigger big-space'>Event: <strong class='caps inv' id='event-name'>".$EVENT_NAME."</strong></div>";

		echo "<div class='mode small caps'>";
		$theme_mode_count = count(THEME_MODE_SHORTNAMES);
		for ( $idx = 1; $idx < $theme_mode_count-1; $idx++ ) {
			if ($idx !== 1)
				echo " | ";
			if ($idx === $EVENT_MODE)
				echo "<strong>".strtoupper(THEME_MODE_SHORTNAMES[$idx])."</strong>";
			else
				echo strtoupper(THEME_MODE_SHORTNAMES[$idx]);
		}
		echo "</div>";
		
		echo "<div class='date normal inv caps' id='event-date' title=\"".$EVENT_DATE->format("G:i")." on ".$EVENT_DATE->format("l F jS, Y ")."(UTC)\">Starts at ".
			"<strong id='ev-time' original='".$EVENT_DATE->format("G:i")."'></strong> on ".
			"<span id='ev-day' original='".$EVENT_DATE->format("l")."'></span> ".
			"<strong id='ev-date' original='".$EVENT_DATE->format("F jS, Y")."'></strong> ".
			"(<span id='ev-zone' original='UTC'></span>)</strong></div>";
?>
		<script>
			var EventDate = new Date("<?=$EVENT_DATE->format(DateTime::W3C)?>");

			dom_SetText( 'ev-time', getLocaleTime(EventDate) );
			dom_SetText( 'ev-day', getLocaleDay(EventDate) );
			dom_SetText( 'ev-date', getLocaleDate(EventDate) );
			dom_SetText( 'ev-zone', getLocaleTimeZone(EventDate) );
		</script>
<?php
	}
}

function ShowHeadline() {
	global $EVENT_MODE;

	$UTCDate = date(DATE_RFC850,$GLOBALS['EVENT_MODE_DATE']);
?>
	<div class='headline'>
		<div class='title bigger caps space inv soft-shadow'><strong><?=THEME_MODE_NAMES[$EVENT_MODE]?></strong></div>
<?php
	if ( THEME_MODE_SHOW_TIMES[$EVENT_MODE] ) {
?>
		<div class='clock' id='headline-clock'>Round ends in <span id='headline-time' title="<?=$UTCDate?>"></span></div>
		<script>
			var _SERVER_TIME_DIFF = <?=$GLOBALS['EVENT_MODE_DIFF']?>;
			var _LOCAL_TIME = Date.now();
			
			function UpdateRoundClock() {
				var LocalTimeDiff = Date.now() - _LOCAL_TIME;
				var TotalTimeDiff = _SERVER_TIME_DIFF - Math.ceil(LocalTimeDiff*0.001);
				if (TotalTimeDiff > 0) {
					dom_SetText('headline-time',getCountdownInWeeks(TotalTimeDiff,3,true));
					if ( TotalTimeDiff <= (24*60*60) )
						time_CallNextSecond(UpdateRoundClock);
					else
						time_CallNextMinute(UpdateRoundClock);
				}
				else {
					dom_SetText('headline-clock',"Round has ended. The next Round will begin soon.");
				}
			}
			UpdateRoundClock();
		</script>
<?php
	}
?>
	</div>
<?php
}
