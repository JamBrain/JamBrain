<?php
  	header('Content-type: text/html');
  	header('Access-Control-Allow-Origin: *;');
	$url = $_GET['url'];

	$embed_type = "none";
	$regex_json = "{}";

	if(isset($url)) {
		getEmbedType($url);
	}

	function getEmbedType($url_to_parse) {
		global $embed_type, $regex_json;

		$twitter_regex = "/^(?:http|https):\/\/twitter\.com\/(\w+)\/status(?:es)*\/(\d+)$/";
		$itch_regex = "/^(?:http|https):\/\/(.*)\.itch\.io\/(.*+)$/";
		//$soundcloud_regex = "/^(?:http|https):\/\/(.*)\.itch\.io\/(.*+)$/";

		if(preg_match($twitter_regex, $url_to_parse, $regex_json) == 1) {
			$embed_type = "twitter";
		} else if(preg_match($itch_regex, $url_to_parse, $regex_json) == 1) {
			$embed_type = "itch";
		}
		/* else if(preg_match($soundcloud_regex, $url_to_parse, $regex_json) == 1) {
			$embed_type = "soundcloud";
		} */

	}
?>

<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<link href="//fonts.googleapis.com/css?family=Raleway:600,600italic,800,800italic|Roboto:300,300italic,700,700italic" rel="stylesheet" type="text/css">
	<link href="https://ldjam.com/-/all.min.css?v=4033-24c3fc0" rel="stylesheet" type="text/css">
	<script href="https://cdn.jsdelivr.net/npm/promise-polyfill@6/dist/promise.min.js"></script>
	<meta content="width=device-width, initial-scale=1" name="viewport">
	<title>ldjam.com</title>
	<style>
	       html, body {
	           height: 100%;
	       }
	       body {
	           background: transparent;
	           top: 0;
	       }

	</style>

	<script type="text/javascript">
	/* Taken from https://gist.github.com/hagenburger/500716 */
	var JavaScript = {
	  load: function(src, callback) {
	    var script = document.createElement('script'),
	        loaded;
	    script.setAttribute('src', src);
	    if (callback) {
	      script.onreadystatechange = script.onload = function() {
	        if (!loaded) {
	          callback();
	        }
	        loaded = true;
	      };
	    }
	    document.getElementsByTagName('head')[0].appendChild(script);
	  }
	};
	</script>

	<script type="text/javascript">
		var EMBED_TYPE = "<?php echo $embed_type ?>";
		var REGEX_JSON = <?php echo json_encode($regex_json) ?>;
		var URL = "<?php echo $url ?>";

		var client;

		function getHeight() {
			var target = document.getElementById('container');

			var height = Math.max(
					Math.max(target.scrollHeight, target.scrollHeight),
					Math.max(target.offsetHeight, target.offsetHeight),
					Math.max(target.clientHeight, target.clientHeight)
				);

			return height;
		}

		function messageClient() {
			if(client) {
				client.postMessage({ "request_height": getHeight(), "url": URL }, "*");
			}
		}

		window.addEventListener('message', function (event) {
			if (event.data == "request_height") {	       
				client = event.source;

				messageClient();
			}
		});	

		function handleEmbed(embedType, regexJson) {
			var target = document.getElementById('container');

			switch(embedType) {
				case "twitter":
					JavaScript.load("https://platform.twitter.com/widgets.js", function() {
						twttr.events.bind('rendered', messageClient);

						twttr.widgets.createTweet(regexJson[2],	target);
					});
					break;

				case "itch":
					JavaScript.load("https://static.itch.io/api.js", function() {
						Itch.getGameData({
							user: regexJson[1],
							game: regexJson[2],
							onComplete: function(data) {
								target.innerHTML = '<iframe class="itch" src="https://itch.io/embed/' + data.id + '" width="552" frameborder="0" height="167" />';
								messageClient();
							}
						});
					});
					break;
				case "soundcloud": 
					JavaScript.load("https://connect.soundcloud.com/sdk/sdk-3.3.0.js", function() {
						SC.oEmbed(URL, {
					    	element: target,
					    	maxwidth: 552,
					  	}).then(messageClient);
					  });
				  	break;
			}
		}
	</script>
</head>
<body>
	<center>
		<div id="main">
			<div id="container">
			</div>
		</div>
	</center>
	<script type="text/javascript">
		handleEmbed(EMBED_TYPE, REGEX_JSON);
	</script>
</body>
</html>
