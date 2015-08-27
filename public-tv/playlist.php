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

//		https://www.youtube.com/embed/-lnAehkIVQk?
//		autohide=0&
//		autoplay=1&
//		controls=0&
//		disablekb=1&
//		enablejsapi=1&
//		fs=1&
//		loop=0&
//		modestbranding=0&
//		playsinline=1&
//		quality=default&
//		rel=0&
//		showinfo=0&
//		start=299&
//		volume=100&
//		wmode=opaque&
//		origin=https%3A%2F%2Flive.monstercat.com

	</script>
	<style>
		#wrapper {
			position:relative;
		}
		
		#player {
/*			position:absolute;*/
			margin:auto;
			left:0;
			right:0;
		}
		
		#dummy {
			position:absolute;
			left:0;
			top:0;
			width:100%;
			height:100%;
		}
	</style>
</head>
<body>
	<!-- 1. The <iframe> (and video player) will replace this <div> tag. -->
	<div id="wrapper"><div id="player"></div><div id="dummy"></div></div>

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
		
		var vid_time = null;
	
		// 4. The API will call this function when the video player is ready.
		function onPlayerReady(event) {
			vid_time = Date.now() + 1000;
			console.log("ready");

			document.getElementById("dummy").addEventListener("click",onCapturedClick);
			
			//event.target.loadPlaylist(ShortVideos);
			event.target.cuePlaylist(ShortVideos);
		}
		
		function onCapturedClick(e) {
			console.log(e);
			if ( vid_active ) {
				player.pauseVideo();
			}
			else {
				var seek = (Date.now()-vid_time)/1000;
				
//				console.log( "Playing: " + vid_index + " (" + Math.floor(vid_length/60) + ":" + padZero(vid_length%60) + ") [" + player.getCurrentTime() + "] [" + seek + "]" ); 
				
//				if ( !vid_seeking && (seek > 0) ) {
					console.log("SeekTo: " + seek);
					player.seekTo(seek,true);
//					vid_seeking = true;
//				}
				
				player.playVideo();
			}
		}
	
		// 5. The API calls this function when the player's state changes.
		//    The function indicates that when playing a video (state=1),
		//    the player should play for six seconds and then stop.

		var vid_active = false;
		var vid_playing = true;
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
			vid_active = false;
			if (event.data == YT.PlayerState.PLAYING) {
				vid_active = true;
				vid_playing = true;
				vid_length = player.getDuration();
				vid_index = player.getPlaylistIndex();

//				var seek = (Date.now()-vid_time)/1000;
//				
//				console.log( "Playing: " + vid_index + " (" + Math.floor(vid_length/60) + ":" + padZero(vid_length%60) + ") [" + player.getCurrentTime() + "] [" + seek + "]" ); 
//				
//				if ( !vid_seeking && (seek > 0) ) {
//					console.log("SeekTo: " + seek);
//					player.seekTo(seek,true);
//					vid_seeking = true;
//				}
//				else {
//					vid_seeking = false;
//				}
			}
			else if (event.data == YT.PlayerState.PAUSED) {
				vid_playing = false;
				vid_seeking = false;
			}
			else if (event.data == YT.PlayerState.ENDED) {
				vid_seeking = false;
				vid_time += (vid_length+1)*1000;
				
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