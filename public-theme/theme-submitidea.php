<?php

function ShowSubmitIdea( $logged_in ) { 
	if ( $logged_in && $GLOBALS['EVENT_MODE_DIFF'] > 0 ) {	// Confirm the round is still on
?>
	<div class="action" id="action-idea">
		<div class="title bigger">Suggest a Theme</div>
		<div class="form">
			<input type="text" class="single-input" id="input-idea" placeholder="Your suggestion" maxlength="64" />
			<button type="button" class="submit-button" onclick="SubmitIdeaForm();">Submit</button>
		</div>
		<div class="footnote small">You have <strong><span id="sg-count">?</span></strong> suggestion(s) left</div>
		<script>
			document.getElementById("input-idea").addEventListener("keydown", function(e) {
				if (!e) { var e = window.event; }
				if (e.keyCode == 13) { /*e.preventDefault();*/ SubmitIdeaForm(); }
			}, false);
		</script>
	</div>
<?php
	}
}
