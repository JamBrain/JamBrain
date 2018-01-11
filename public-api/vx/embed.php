<?php
  	header('Content-type: text/html');
  	header('Access-Control-Allow-Origin: *;');
	$url = $_GET['url'];
	$autoplay = (isset($_GET['autoplay']) ? $_GET['autoplay'] : 0);;

	$embed_type = "none";
	$regex_json = "{}";

	if(isset($url)) {
		getEmbedType($url);
	}

	function getEmbedType($url_to_parse) {
		global $embed_type, $regex_json;

		$twitter_regex = "/twitter\.com\/(\w+)\/status(?:es)*\/(\d+)$/";
		$itch_regex = "/(.*)\.itch\.io\/(.+)$/";
		$gfycat_regex = "/gfycat\.com\/(\w+)/";
		$streamable_regex = "/streamable\.com\/(\w+)/";
		//Youtube regex's
		$youtube_regex = "/(?:youtube\\.com\\/watch\\?v=)(.*)(?:)/";
		$youtbe_regex = "/(?:youtu\\.be\\/)(.*)(?:)/";

		$sketchfab_regex = "/sketchfab\.com\/models\/(\w+)/";

		//$soundcloud_regex = "/^(?:http|https):\/\/(.*)\.itch\.io\/(.*+)$/";

		if(preg_match($twitter_regex, $url_to_parse, $regex_json) == 1) {
			$embed_type = "twitter";
		} else if(preg_match($itch_regex, $url_to_parse, $regex_json) == 1) {
			$embed_type = "itch";
		} else if(preg_match($gfycat_regex, $url_to_parse, $regex_json) == 1) {
			$embed_type = "gfycat";
		} else if(preg_match($streamable_regex, $url_to_parse, $regex_json) == 1) {
			$embed_type = "streamable";
		} else if(preg_match($youtube_regex, $url_to_parse, $regex_json) == 1) {
			$embed_type = "youtube";
		} else if(preg_match($youtbe_regex, $url_to_parse, $regex_json) == 1) {
			$embed_type = "youtube";
		} else if(preg_match($sketchfab_regex, $url_to_parse, $regex_json) == 1) {
			$embed_type = "sketchfab";
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
	       iframe.itch {
		       max-width: 552px;
		       width: 100%;
	       }
/*	       iframe.youtube {
	       		width: 100vw; 
    			height: 56.25vw;
	       }*/

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

	/* Taken from https://developer.mozilla.org/en-US/docs/Web/Events/resize */
	var optimizedResize = (function() {

	    var callbacks = [],
	        running = false;

	    // fired on resize event
	    function resize() {

	        if (!running) {
	            running = true;

	            if (window.requestAnimationFrame) {
	                window.requestAnimationFrame(runCallbacks);
	            } else {
	                setTimeout(runCallbacks, 66);
	            }
	        }

	    }

	    // run the actual callbacks
	    function runCallbacks() {

	        callbacks.forEach(function(callback) {
	            callback();
	        });

	        running = false;
	    }

	    // adds callback to loop
	    function addCallback(callback) {

	        if (callback) {
	            callbacks.push(callback);
	        }

	    }

	    return {
	        // public method to add additional callback
	        add: function(callback) {
	            if (!callbacks.length) {
	                window.addEventListener('resize', resize);
	            }
	            addCallback(callback);
	        }
	    }
	}());
	</script>

	<script type="text/javascript">
		var EMBED_TYPE = "<?php echo $embed_type ?>";
		var REGEX_JSON = <?php echo json_encode($regex_json) ?>;
		var URL = "<?php echo $url ?>";
		var AUTOPLAY = "<?php echo $autoplay ?>";

		var client;

		function getHeight() {
			var target = document.getElementById('container');

			var height = Math.max(
					target.scrollHeight,
					target.offsetHeight,
					target.clientHeight
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

		optimizedResize.add(messageClient);

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
						var url = regexJson[1].split("//");
						var user = url[0];
						if(url.length >= 1) {
							user = url[1];
						}

						Itch.getGameData({
							user: user,
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
				case "gfycat": 
					target.innerHTML = "<div style='position:relative;padding-bottom:51%'><iframe src='https://gfycat.com/ifr/" + regexJson[1] + "' frameborder='0' scrolling='no' width='100%' height='100%' style='position:absolute;top:0;left:0;' allowfullscreen></iframe></div>";
				  	break;
				case "streamable": 
					var params = "";
					if(AUTOPLAY == 1) {
						params = "?autoplay=" + AUTOPLAY;
					}

					target.innerHTML = "<div style='position:relative;padding-bottom:51%'><iframe src='https://streamable.com/o/" + regexJson[1] + params + "' frameborder='0' scrolling='no' width='100%' height='100%' style='position:absolute;top:0;left:0;' allowfullscreen></iframe></div>";
				  	break;
				case "youtube": 
					target.innerHTML = "<div style='position:relative;padding-bottom:56.25%'><iframe class='youtube' src='https://www.youtube.com/embed/" + regexJson[1] + "?autoplay=" + AUTOPLAY + "' frameborder='0' scrolling='no' width='100%' height='100%' style='position:absolute;top:0;left:0;' allowfullscreen></iframe></div>";
				  	break;
				case "sketchfab":
					target.innerHTML = "<div style='position:relative;padding-bottom:56.25%'><iframe src='https://sketchfab.com/models/" + regexJson[1] + "/embed?autostart=" + AUTOPLAY +"' style='position:absolute;top:0;left:0;' frameborder='0' scrolling='no' width='100%' height='100%'></iframe></div>";
				  	break;
			}
		}
	</script>
	</head>
	<body>
		<div id="main">
			<div id="container">
			</div>
		</div>
	<script type="text/javascript">
		handleEmbed(EMBED_TYPE, REGEX_JSON);
	</script>
</body>
</html>
