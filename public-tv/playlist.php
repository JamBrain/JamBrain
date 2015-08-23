<!DOCTYPE html>
<html>
<head>
	<script>
		var Videos = [
			"chtFbRyxdIo",	// (~48)
			"R3H9lBz3pYs",	// DoomCauldron (~3)
			"XzNg7RZjWYE",	// Dynamole (~9)
			"yhsQaNGwUgQ",	// Gaidai, Kyle Pulver (~5)
			"_MRDp2RHGEc",	// Let me save you (~3)
			"U57lgpx1YeU",	// Tom Jackson (~7)
		];
		
		var ShortVideos = [
			'-QB6lckA3y0',	// C64
			'gvdf5n-zI14',	// Nope
			'CjhrIsSCcjs',	// Float
			'eygNgryTDXM'	// Thanks Bro
		];

	</script>
</head>
<body>
	<!-- 1. The <iframe> (and video player) will replace this <div> tag. -->
	<div id="player"></div>

	<script>
		// 2. This code loads the IFrame Player API code asynchronously.
		var tag = document.createElement('script');
	
		tag.src = "https://www.youtube.com/iframe_api";
		var firstScriptTag = document.getElementsByTagName('script')[0];
		firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
	
		// 3. This function creates an <iframe> (and YouTube player)
		//    after the API code downloads.
		var player;
		function onYouTubeIframeAPIReady() {
			player = new YT.Player('player', {
				height: '576',
				width: '1024',
				//videoId: ShortVideos[0],
				playerVars: {
					'rel': 0,
					'controls':0,
					'modestbranding':1,
					'showinfo':0,
				},
				events: {
					'onReady': onPlayerReady,
					'onStateChange': onPlayerStateChange
				}
			});
		}
		
		var vid_active = null;
	
		// 4. The API will call this function when the video player is ready.
		function onPlayerReady(event) {
			vid_active = Date.now() + 1000;
			console.log("ready");
			
			//event.target.loadPlaylist(ShortVideos);
			event.target.cuePlaylist(ShortVideos);
		}
	
		// 5. The API calls this function when the player's state changes.
		//    The function indicates that when playing a video (state=1),
		//    the player should play for six seconds and then stop.

		var vid_seeking = false;
		var vid_length = 0;
		var vid_index = -1;
		
		function padZero(val) {
			if ( val < 10 ) {
				return "0"+val;
			}
			return val;
		}

		function onPlayerStateChange(event) {
			if (event.data == YT.PlayerState.PLAYING) {
				vid_length = player.getDuration();
				vid_index = player.getPlaylistIndex();

				var seek = (Date.now()-vid_active)/1000;
				
				console.log( "Playing: " + vid_index + " (" + Math.floor(vid_length/60) + ":" + padZero(vid_length%60) + ") [" + player.getCurrentTime() + "] [" + seek + "]" ); 
				
				if ( !vid_seeking && (seek > 0) ) {
					console.log("SeekTo: " + seek);
					player.seekTo(seek,true);
					vid_seeking = true;
				}
				else {
					vid_seeking = false;
				}
			}
			else if (event.data == YT.PlayerState.PAUSED) {
				vid_seeking = false;
			}
			else if (event.data == YT.PlayerState.ENDED) {
				vid_seeking = false;
				vid_active += (vid_length+1)*1000;
				
				console.log( "Ended: " + vid_index + " (" + player.getPlaylist().length + ")" );
				
				if ( (player.getPlaylist().length-1) == vid_index ) {
					player.playVideoAt(0);
				}
				
				//event.target.playVideo();
				//console.log("poo");
				//player.loadVideoById("gvdf5n-zI14");
			}
			else if (event.data == YT.PlayerState.CUED) {
				player.playVideo();
			}
			else {
				console.log(event.data);
			}
		}
		function stopVideo() {
			player.stopVideo();
		}
	</script>
</body>
</html>