<?php

function ShowAnnouncement() {
?>
	<div class="action" id="action-ann">
		<div id="twitter-widget" style="width:28em">
			<a class="twitter-timeline" data-dnt="true" href="https://twitter.com/ludumdare" data-widget-id="665760712757657600">Tweets by @ludumdare</a>
			<script>!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?'http':'https';if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src=p+"://platform.twitter.com/widgets.js";fjs.parentNode.insertBefore(js,fjs);}}(document,"script","twitter-wjs");</script>
      	</div>

		<div id="ann-before" class="hidden">
			<div>The Theme will be announced in</div>
			<div>clock:clock:tick:tick</div>
		</div>
		<div id="ann-after" class="hidden">
			<div>The Theme is</div>
			<div>BAAAAAAAAAAAAAAAAAAAA</div>
		</div>
		<div class="gap"></div>
	</div>
<?php
}
