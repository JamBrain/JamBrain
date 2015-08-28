<?php 
require_once __DIR__ . "/../web.php";
require_once __DIR__ . "/../core/constants.php";
require_once __DIR__ . "/../core/node.php";
require_once __DIR__ . "/../core/internal/sanitize.php";
require_once __DIR__ . "/../core/internal/emoji.php";
require_once __DIR__ . "/../core/post.php";
require_once __DIR__ . "/../core/schedule.php";
require_once __DIR__ . "/../core/internal/ichart.php";

user_StartEnd();

//template_SetTheme("embed");

// Modes //
const M_DEFAULT = 1;	// Default State //
const M_ERROR = -255;	// Other Error //

$mode = M_DEFAULT;


$args = core_ParseActionURL();
$args_count = count($args);

// Sanitize Input
foreach( $args as $arg ) {
	$arg = sanitize_Slug($arg);
	if ( empty($arg) ) {
		$mode = M_ERROR;
		break;
	}
}

if ( $mode > 0 ) {
	$args_merged = implode('/',$args);
	
	
	$paths = [ CMW_NODE_ROOT ];
	foreach( $args as $key => $slug ) {
		$id = node_GetNodeIdByParentIdAndSlug($paths[$key],$slug);
		if ( !empty($id) ) {
			$paths[] = $id;
		}
		else {
			$mode = M_ERROR;
			break;			
		}
	}
	if ( $mode > 0 ) {
		$paths_count = count($paths);
		$this_node_id = &$paths[$paths_count-1];
		
		$this_node = node_GetNodeById( $this_node_id );
		$author_node = [];
		if ( !empty($this_node['author']) && ($this_node['author'] > 0) ) {
			$author_node = node_GetNodeById( $this_node['author'] );
		}
		if ( !empty($this_node['parent']) && ($this_node['parent'] > 0) ) {
			$parent_node = node_GetNodeById( $this_node['parent'] );
		}
		
		$nodes = node_GetNodesByParentId( $this_node_id );
		$nodes_count = count($nodes);
	}
}

?>
<?php template_GetHeader(); ?>
<body>
	<script>
		// Cookie Functions //
		function getCookie(name) {
			var value = "; " + document.cookie;
			var parts = value.split("; " + name + "=");
			if (parts.length == 2) 
				return parts.pop().split(";").shift();
			return parts;
		}
		function setCookie(name,value) {
			document.cookie = name + '=' + value;
		}
		function removeCookie( name ) {
			document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
		}
	</script>
	
	<style>
		/* Top Navigation Bar */
		#ldbar-outer {			
			width:100%;
			height:56px;

			/*position:fixed;*/
			left:0;
			top:0;
			z-index:1000;
			
			/* shadow */
			/*border-bottom:1px solid #000;/*rgba(96,96,96,0.2);*/
			box-shadow:0px -1px 8px rgba(0,0,0,0.7);

			/*-webkit-animation: slidein 3s;*/
			/*-moz-animation: slidein 3s;*/
			/*animation: slidein 3s;*/
		}
		@-webkit-keyframes slidein {
		    from{ top: -52px; }
		    50% { top: -52px; }
		    75%	{ top: 8px; }
		    90%	{ top: -4px; }
		    to	{ top: 0; }
		}
		@-moz-keyframes slidein {
		    from { top: -52px; }
		    50% { top: -52px; }
		    75%	{ top: 8px; }
		    90%	{ top: -4px; }
		    to   { top: 0; }
		}
		@keyframes slidein {
		    from { top: -52px; }
		    50% { top: -52px; }
		    75%	{ top: 8px; }
		    90%	{ top: -4px; }
		    to   { top: 0; }
		}

		
		#ldbar-inner {
			color:#fff;
			background:/*#765*/ rgba(64,64,64,1.0);
			
			line-height:56px;
			
			position:relative;
			width:100%;
		}
		/* Padding in the main document */
		#ldbar-pad {			
			width:100%;
			height:56px; /* plus shadow */
		}

		.noselect {
		    -webkit-touch-callout: none;
		    -webkit-user-select: none;
		    -khtml-user-select: none;
		    -moz-user-select: none;
		    -ms-user-select: none;
		    user-select: none;
		}
		#ldbar img {
			/*vertical-align:middle;*/
		}
		
		#ldbar-toggle {
			font-family:'Inconsolata',monospace;
			margin-left:32px;
			cursor:pointer;
		}
		
		#ldbar-notifications {
			font-size:20px;
			margin-left:24px;
			font-weight:bold;
			border-radius:9px;
			cursor:pointer;
			display:inline-block !important;
			width:32px;
			height:32px;
			line-height:32px;
			text-align:center;
			font-family:'Inconsolata',monospace;
			position:relative;
			text-shadow:0 2px rgba(0,0,0,0.5);
			
			background:rgba(255,32,48,0.5);
			border:3px solid #000;
			top:0px;

   			-webkit-transition:all 0.125s;
    		transition:all 0.125s;
		}
		#ldbar-notifications:hover {
			background:rgba(255,32,48,0.8);
			border-top:1px solid #000;
			border-bottom:5px solid #000;
			top:-2px;
		}

		#ldbar-logo {
			position:relative;
			cursor:pointer;
			
			top:9px;
			opacity:0.7;
 
   			-webkit-transition:all 0.125s;
    		transition:all 0.125s;
		}
		#ldbar-logo:hover {
			top:6px;
			opacity:1.0;
		}


		#ldbar .leftnav {
			display:inline;
			padding-left:64px;
			
		}
		#ldbar .rightnav {
			float:right;
			display:inline;
			/*padding-right:64px;*/
		}
		
		
		#ldbar .cell {
			display:inline;
		}
		
		#ldbar .size32 {
			position:relative;
			width:32px;
			height:32px;
			top:8px;
		}
		
		#warning {
			font-size:26px;
			text-align:center;
			padding:12px 16px;
			margin:16px 0;
			background:#F53;
			color:#FFF;
		}

	</style>
	
	<div id='ldbar' class='noselect'>
		<div id='ldbar-outer' style='position:fixed;'>
			<div id='ldbar-inner'>
				<div class='leftnav'>
					<div id='ldbar-logo' class='cell'><a href="/"><img src="<?php STATIC_URL(); ?>/logo/ludumdare/2009/LudumDareLogo80W.png" height="30" /></a></div>
				</div>
				<div class='rightnav'>
					<div class='cell size32' onclick='SendLogin();'><img src="<?php STATIC_URL(); ?>/logo/mike/Chicken64W.png" width="32" height="32" style="mix-blend-mode:screen" /></div>
					<div id='ldbar-notifications' class='cell' onclick='SendLogout();'>0</div>
					<div id='ldbar-toggle' class='cell' onclick='toggleLDBar();' title='Toggle Sticky Bar'>[x]</div>
				</div>
			</div>
		</div>
		<div id='ldbar-pad'></div>
	</div>
	
	<div id='warning' <?php if ( isset($_COOKIE['hide-warning']) ) { echo 'style="display:none;"'; } ?> >
		<strong>NOTE:</strong> This WIP website is <strong>pre-alpha</strong> quality. It is buggy, glitchy, and not pretty. Feedback is welcome, but do understand that I am <strong>NOT</strong> focusing on style or look. Currently I am working on <strong>user</strong> features, function/flow, performance, and security. We'll make it pretty later. The website will be live later this year. <strong><span onclick="warning_Hide();">[close]</span></strong>
	</div>
	
	<script>
		function SendLogin() {
			xhr_PostJSON( "/a/user/login/", "l=testuser&p=test",
				function( response, code ) {
					if ( code == 200 ) {
						document.getElementById("ldbar-notifications").innerHTML = response['id'];
					}
					else if ( code == 401 ) {
						document.getElementById("ldbar-notifications").innerHTML = ":(";
					}
					else {
						document.getElementById("ldbar-notifications").innerHTML = "x";
					}
				}
			);
		}

		function SendLogout() {
			xhr_PostJSON( "/a/user/logout/", "",
				function( response, code ) {
					if ( code == 200 ) {
						document.getElementById("ldbar-notifications").innerHTML = 0;
					}
					else {
						document.getElementById("ldbar-notifications").innerHTML = "x";
					}
				}
			);
		}
		
		function updateLDBar() {
			if ( getCookie('ldbar') === '1' ) {
				document.getElementById('ldbar-outer').style.position = '';
				document.getElementById('ldbar-pad').style.display = 'none';
				document.getElementById('ldbar-toggle').innerHTML = '[ ]';
			}
			else {
				document.getElementById('ldbar-outer').style.position = 'fixed';
				document.getElementById('ldbar-pad').style.display = '';
				document.getElementById('ldbar-toggle').innerHTML = '[x]';
			}
		}
		function toggleLDBar() {
			var val = !(getCookie('ldbar') === '1');
			if ( val ) {
				setCookie('ldbar',1);
			}
			else {
				removeCookie('ldbar');
			}
			updateLDBar();
		}
		updateLDBar();
		
		function bar_Hide( self ) {
			if ( self.style.height=="8px") { 
				self.style.height=""; 
			} 
			else { 
				self.style.height="8px"; 
			}
		}
		
		function item_ShowEdit( id ) {
			document.getElementById('flextext-'+id).style.display = '';
			document.getElementById('preview-'+id).style.display = 'none';
//			document.getElementById('item-'+id).style.maxHeight = document.getElementById('item-'+id).scrollHeight +"px";
		}
		function item_ShowPreview( id ) {
			document.getElementById('flextext-'+id).style.display = 'none';
			document.getElementById('preview-'+id).style.display = '';
//			document.getElementById('item-'+id).style.maxHeight = document.getElementById('item-'+id).scrollHeight +"px";
		}
		
		function item_UpdateEdit( o ) {
			var rows = o.value.split("\n").length;
			o.rows = (rows > 4) ? rows : 4;
		}
		
		function warning_Hide() {
			document.getElementById('warning').style.display = 'none';
			document.cookie = "hide-warning=1";
		}
	</script>
	
	<!-- *************** -->
	
	<style>
		body {
			background: #EEE;
		}
				
		#content {
			margin:0 auto;
			max-width:900px;
		}
		
		#content .item {
			margin:16px auto;

			background:#FFF;
			overflow:hidden;

			box-shadow: 0 0 3px rgba(0,0,0,0.2);
			
			/*max-height:0;*/
			-moz-transition: max-height 1s;
			-webkit-transition: max-height 1s;
			transition: max-height 1s;
		}
		
		#content .item-post {
		}
		#content .item-game {
			width:90%;

			background:#CDF;
			border: 1px solid #89C;
			border-bottom: 8px solid #89C; /* Hack, until controls */
		}

		#content .item .header {
			padding:0 1.5em;
			margin:1em 0;
		}
		#content .item .separator {
			border-top:1px dashed rgba(0,0,0,0.5);
		}
		#content .item .body {
			padding:0 1.5em;
			margin:1em 0;
		}
		#content .item .footer {
			background:#888;/*#CCC;/*rgba(0,0,0,0.1);*/
			color:#FFF;

		    -webkit-touch-callout: none;
		    -webkit-user-select: none;
		    -khtml-user-select: none;
		    -moz-user-select: none;
		    -ms-user-select: none;
		    user-select: none;
		}

		/* Item Header */
		#content .item .header h1 {
			font-size:2em;
			line-height:1.2;
			margin:0;
		}
		#content .item .header .info {
			font-size:0.7em;
			line-height:1;
			/* line-height is typically 1.2, so this is to compensate for the 2x top of <h1> */
			padding-bottom:0.4em;
		}
		#content .item .header .avatar {
			float:right;

			width:3.1em;
			max-width:64px;
			height:3.1em;
			max-height:64px;

			background-size:cover;	/* DIV only */
		}

		/* Item Footer */
		#content .item .footer div {
			padding:1em 1.5em;
		}

		/* On Mobile, less edge margin */
		@media  (max-device-width : 600px)  {
			#content .item-game {
				width:95%;
			}

			#content .item .header {
				padding:0 0.75em;
			}
			#content .item .body {
				padding:0 0.75em;
			}
			#content .item .footer div {
				padding:1em 0.75em;
			}
		}

		
		#metas .node {
			padding-left:24px;
			font-family:'Inconsolata',monospace;
		}
		#metas .key {
			display:inline;
			font-weight:bold;
		}
		
		#content .item span code {
			background:#EEE;/*#FDC;*/
			padding:4px 8px;
			margin:0 4px;
			border-radius:8px;
		}
		
		
		/* FlexText */
		.flextext {
		    position: relative;
		    *zoom: 1;
		}

		textarea,
		.flextext {
		    outline: 0;
		    margin: 0;
		    border: none;
		    padding: 0;
		
		    *padding-bottom: 0 !important;
		}

		.flextext textarea,
		.flextext pre {
		    white-space: pre-wrap;
		    width: 100%;
		    -webkit-box-sizing: border-box;
		    -moz-box-sizing: border-box;
		    box-sizing: border-box;
		
		    *white-space: pre;
		    *word-wrap: break-word;
		}

		.flextext textarea {
		    overflow: hidden;
		    position: absolute;
		    top: 0;
		    left: 0;
		    height: 100%;
		    width: 100%;
		    resize: none;
		
		    /* IE7 box-sizing fudge factor */
		    *height: 94%;
		    *width: 94%;
		}

		.flextext pre {
		    display: block;
		    visibility: hidden;
		}

		textarea,
		.flextext pre {
			/*margin: 0;*/
		    border: 1px solid #000;
		    padding: 4px;
		    background:#EED;
		    /*
		     * Add custom styling here
		     * Ensure that typography, padding, border-width (and optionally min-height) are identical across textarea & pre
		     */
		}
	</style>

	<style>
		/* Chicken Navigation */
		#nav .row {
			margin-left:16px;
			padding:2px;
		}
		#nav .row:hover {
			background:#CCF;
		}
		#nav .slug {
			display:inline;
			font-family:'Inconsolata',monospace;
		}
		#nav .id, #nav .name, #nav .type {
			display:inline;
			position:absolute;
		}
		#nav .id {
			left:256px;
		}
		#nav .name {
			left:360px;
		}
		#nav .type {
			left:960px;
		}
		
		#nav .proxy {
			background:#CFC;
		}
		#nav .link {
			background:#FCC;
		}
		#nav .authored {
			background:#FCF;
		}
	</style>
	
	<?php if ( $mode === M_DEFAULT ) { ?>

<?php	
	echo "<!-- Debug\n";
/*	
	$query = 
		'SELECT % FROM % WHERE'.
			' % in (%)' .
			' AND % = ?' .
			';';
	$args = [
		'id',4,
		'type'
	];
		
	echo _db_BuildQueryString(
		$query,
		'*',CMW_TABLE_SCHEDULE_SUBSCRIPTION,
		'id',4,
		'type'
	);
	echo "\n";
	
	print_r( _db_BuildArgList($args) );
	
	global $NODE_SCHEMA;
	print_r( _db_ParseArgList($args,$NODE_SCHEMA) );
*/	
	
	
	
//	$active_events = schedule_GetActiveIds();
//	$events = schedule_GetByIds( $active_events );	// cacheme
//	
//	$active_parents = [];
//	foreach ( $events as &$event ) {
//		$active_parents[] = $event['parent'];
//	}
//	$active = array_unique(array_merge($active_parents,$active_events));
//	print_r($active);
//	
//	$subscriptions = schedule_GetSubscriptionsByUserIds(699);
//	print_r($subscriptions);
//
//	$mine = array_intersect($active,$subscriptions);
//	print_r($mine);
	
	
	
	
//	$scheduled_events = schedule_GetActiveIds();
//	print_r( $scheduled_events );
//	
//	$schedules = schedule_GetByIds( $scheduled_events );
//	print_r( $schedules );
//	
//	$family = schedule_GetFamilyByIds( [55,69] );
//	print_r( $family );
	echo " -->";
?>
	<?php if ( $this_node['type'] === 'root' ) { ?>
	<div id="content">
		<?php
			$items = node_GetNodesByIds(node_GetPublishedNodeIdsByTypes(['post','game']));
			$author_ids = [];
			foreach($items as $item) {
				$author_ids[] = $item['author'];
			}
			$author_ids = array_unique($author_ids);
			$authors = node_GetNodesByIds($author_ids);
			
			foreach($items as $item) {
				echo '<div class="item item-'.$item['type'].'" id="item-'.$item['id'].'">';
				if ( $item['type'] === 'post' ) {
					echo '<div class="header emoji">';
						if ( !empty($item['author']) && $authors[$item['author']]['slug'] == 'pov' ) {
							// Image Version //
							echo '<img class="avatar" src="//192.168.48.48:8080/logo/mike/Chicken64.png" />';
							// Div Version //
							//echo '<div class="avatar" style="background-image:url(//192.168.48.48:8080/logo/mike/Chicken64.png);"></div>';
						}
						echo '<h1>' . $item['name'] .'</h1>';
						echo '<div class="info">';
						if ( !empty($item['author']) ) { 
							echo "by <span class='author'><a href='/user/".$authors[$item['author']]['slug']."' title='".$authors[$item['author']]['slug']."'>" . $authors[$item['author']]['name'] . "</a></span>. "; 
						}
						echo 'Posted <span class="date" data="'.date(DATE_W3C,$item['time_published']).'" title="'.date('l, F d, Y H:i:s (T)',$item['time_published']).'">'.date('l, F d, Y H:i:s (T)',$item['time_published']).'</span></div>';
//						if ( !empty($item['author']) ) { 
//							echo "<h3>by <a href='/user/".$authors[$item['author']]['slug']."' title='".$authors[$item['author']]['slug']."'>" . $authors[$item['author']]['name'] . "</a></h3>"; 
//						}
					echo "</div>\n";
					echo '<div class="separator"></div>';
					echo '<div class="body format">';
						// TODO: replace all the textarea related code with a function call for generating one. JS and PHP.
						// TODO: Add TAB support (and ESC to de-focus the textbox, since otherwise keyboard can't de-focus)
						// TODO: Emoji Autocompletion
						// TODO: Image Autocompletion (once uploaded)
						// TODO: Jumbomoji support (i.e. my *bigger* custom emoji. :key-wasd: etc)
						// TODO: Jumbomoji Autocompletion
						// TODO: Fix smileys surrounded by \n's (not working if an \n is on either side)
						if ( !empty($item) ) {
							// http://alistapart.com/article/expanding-text-areas-made-elegant
							// https://github.com/alexdunphy/flexText
							echo '<div class="flextext" id="flextext-'.$item['id'].'" style="display:none;">';
								echo '<pre><span id="flextext-span-'.$item['id'].'"></span><br /><br /></pre>';
								echo '<textarea class="edit" id="edit-'.$item['id'].'" oninput="flextext_Update('.$item['id'].');" onpropertychange="flextext_Update('.$item['id'].');" onkeyup="flextext_Update('.$item['id'].');" onchange="flextext_Update('.$item['id'].');">' . $item['body'] . '</textarea>';
							echo '</div>';
							echo '<div class="preview" id="preview-'.$item['id'].'"></div>';
						}
					echo '</div>';
					echo '<div class="footer" onclick="bar_Hide(this);" style="height:8px">';
						echo '<div>';
						echo '<span onclick="item_ShowEdit('.$item['id'].');">PATCH</span>';
						echo ' | ';
						echo '<span onclick="item_Parse('.$item['id'].');item_ShowPreview('.$item['id'].');">PREVIEW</span>';
						echo '</div>';
					echo '</div>';
				}
				else if ( $item['type'] === 'game' ) {
					echo '<div class="header emoji">';
						echo '<h1>' . $item['name'] .'</h1>';
						echo '<div class="info">';
						if ( !empty($item['author']) ) { 
							echo "by <span class='author'><a href='/user/".$authors[$item['author']]['slug']."' title='".$authors[$item['author']]['slug']."'>" . $authors[$item['author']]['name'] . "</a></span>. "; 
						}
						echo 'Submitted <span class="date" data="'.date(DATE_W3C,$item['time_published']).'" title="'.date('l, F d, Y H:i:s (T)',$item['time_published']).'">'.date('l, F d, Y H:i:s (T)',$item['time_published']).'</span>';
						echo '</div>';
					echo "</div>\n";
					echo '<div class="body format">';
						echo "This is a game submission part of the main timeline. Screenshots and other presentable elements go here.";
					echo '</div>';					
				}
				echo '</div>';
			}
		?>
		<!-- <?php print_r($items); ?> -->
		<!-- <?php print_r($author_ids); ?> -->
		<!-- <?php print_r($authors); ?> -->
	</div>
	<?php } else { ?>
	<div id="content">
	<?php
		$item = &$this_node;
		if ( $item['type'] === 'page' ) {
			echo '<div class="item item-'.$item['type'].'" id="item-'.$item['id'].'">';
				echo '<div class="header emoji"><h1>'.$item['name'].'</h1></div>';
				if ( !empty($item['body']) ) { 
					echo '<textarea class="body-edit" rows="24" cols="120" style="display:none;">'.$this_node['body'].'</textarea>';
					echo '<div class="body format"></div>';
				}
			echo '</div>';
		}
		else if ( $item['type'] === 'user' ) {
	?>
			<div class="item">
				<div class="title"><h1><?php echo $this_node['name']; ?></h1><?php if ( $author_node ) { echo "<h3>by <a href='/user/".$author_node['slug']."'>" . $author_node['name'] . "</a></h3>"; } ?></div>
				<?php 
					if ( !empty($this_node['body']) ) { 
						?><textarea class="body-edit" rows="24" cols="120" style="display:none;"><?php echo $this_node['body']; ?></textarea>
						<div class="body format"></div><?php 
					} ?>
				<?php
					if ( $this_node['type'] === 'user' ) {
						echo "<br />";
					?>
	<script type="text/javascript" src="https://www.google.com/jsapi"></script>
    <script type="text/javascript">

      // Load the Visualization API and the piechart package.
      google.load('visualization', '1.0', {'packages':['corechart']});

      // Set a callback to run when the Google Visualization API is loaded.
      google.setOnLoadCallback(drawChart);

      // Callback that creates and populates a data table,
      // instantiates the pie chart, passes in the data and
      // draws it.
      function drawChart() {

        // Create the data table.
        var data = new google.visualization.DataTable();
        data.addColumn('string', 'Topping');
        data.addColumn('number', 'Slices');
        data.addRows([
          ['Mushrooms', 4],
          ['Onions', 3],
          ['Olives', 2],
          ['Zucchini', 1],
          ['Pepperoni', 7]
        ]);

        // Set chart options
        var options = {'title':'How Much Pizza I Ate Last Minute',
                       'width':400,
                       'height':300};

        // Instantiate and draw our chart, passing in some options.
        var chart = new google.visualization.PieChart(document.getElementById('chart_div'));
        chart.draw(data, options);
      }
    </script>
    <div id="chart_div" style="display:inline-block;"></div><img src="<?php 
    	echo ichart_GetPie(400,300,[10,12,15],['ham','hem','hom']);
    ?>" />
    <?php
    echo "<br>";
					
					
					echo '<div id="games" class="emoji"><h3>Games:</h3>';
					$games = node_GetNodesByAuthorIdAndType($this_node['id'],'game');
					foreach( $games as $game ) {
						echo "<a href=\"/user/" . $this_node['slug'] . "/" . $game['slug'] . "\">" . $game['name'] . "</a><br/>"; 
					}
					echo '</div>';
					echo "<br />";
					echo '<div id="metas"><h3>Metadata ('.$this_node['id'].'):</h3>' ;
					$metas = node_GetMetasById( $this_node['id'] );
					function process_meta( $meta ) {
						echo "<div class='node'>";
						foreach( $meta as $key => $value ) {
							if ( is_array($value) ) {
								if ( is_string($key) )
									$key = "\"".$key."\"";
	
								echo "<div class='key'>".$key . ":</div><br/>";
								process_meta($value);
							}
							else {
								if ( is_string($key) )
									$key = "\"".$key."\"";
								
								if ( is_string($value) )
									echo "<div class='key'>".$key . ":</div> \"" . $value . "\"<br />";
								else
									echo "<div class='key'>".$key . ":</div> " . $value . "<br />";
							}
						}
						echo "</div>";
					}
					process_meta($metas);
					
//					print_r($metas);
					echo "</div>";
				}
			?>	
		</div>
	</div>
	<?php } /* type */ ?>
	<?php
		}
	?>
	
	<div id='nav' class='emoji' style="padding:16px;display:none;">
		<?php
			echo "/" . $args_merged . " [".$this_node_id."]<br />\n";
			if ( $args_count >= 1 ) {
				echo "<div class='row'>\n";
				echo "<div class='slug'><a href='../'>../</a></div><br />\n";
				echo "</div>\n";	
			}
			foreach( $nodes as $node ) {
				echo "<div class='row ".$node['type'].($node['author']>0?" authored":"")."'>\n";
				if ( $node['type'] === 'link' ) {
					echo "<div class='slug'><a href='".$node['name']."/'>" . $node['slug'] . "/</a></div> <div class='id'>*".$node['id']."*</div> <div class='type'>(".$node['type'].")</div><br />\n";
				}
				else {
					echo "<div class='slug'><a href='".$node['slug']."/'>" . $node['slug'] . "/</a></div> <div class='id'>[".$node['id']."]</div> <div class='name'>".$node['name']."</div> <div class='type'>(".$node['type'].")</div><br />\n";
				}
				echo "</div>\n";	
			}
		?>
	</div>
	<div>
		<img src="<?php STATIC_URL(); ?>/img/logo/mike/Chicken16.png?crop&w=256&h=128" onclick="document.getElementById('nav').style.display='';">
	</div>
<?php /*
	<div id="debug">
		<h2>Debug S:</h2>
		<?php
			if ( isset($_SESSION) ) {
				print_r($_SESSION);
				echo "<br />";
			}
			echo "Login token is " . (_user_IsLoginTokenValid() ? "valid" : "invalid") . ".";
		?>
		<h2>Debug C:</h2>
		<script>
			document.getElementById('debug').innerHTML += document.cookie;
		</script>
	</div>
*/ ?>
	<?php } else if ( $mode === M_ERROR ) { ?>	
		<div id="content">
			<div class="title"><h1><a href=".">Nope</a></h1></div>
		</div>

	<?php } /* $mode */ ?>	

	<script>
		function UpdateDate( el ) {
			var PostDate = new Date(el.getAttribute('data'));
			var DiffDate = (Date.now() - PostDate);
			
			var DateString = '<span class="date-diff">';
			if ( DiffDate < 0 ) {
				DateString += "in the future";
			}
			else if ( DiffDate < 1000*60*2 ) { 
				DateString += "right now";
			}
			else if ( DiffDate < 1000*60*60 ) {
				DateString += Math.floor(DiffDate/(1000*60)) + " minutes ago";
			}
			else if ( DiffDate < 1000*60*60*2 ) {
				if ( DiffDate < 1000*60*30*3 )
					DateString += "an hour ago";
				else
					DateString += "an hour and a half ago";
			}
			else if ( DiffDate < 1000*60*60*24 ) {
				DateString += Math.floor(DiffDate/(1000*60*60)) + " hours ago";
			}
			else if ( DiffDate < 1000*60*60*24*2 ) {
				if ( DiffDate < 1000*60*60*12*3 )
					DateString += "a day ago";
				else
					DateString += "a day and a half ago";
			}
			else if ( DiffDate < 1000*60*60*24*7*2 ) {				// 2 weeks of days
				DateString += Math.floor(DiffDate/(1000*60*60*24)) + " days ago";
			}
			else if ( DiffDate < 1000*60*60*24*((7*4*3)+7.5) ) {	// 12 weeks (briefly 13)
				DateString += Math.floor(DiffDate/(1000*60*60*24*7)) + " weeks ago";
			}
			else if ( DiffDate < 1000*60*60*24*182*3 ) {
				DateString += Math.floor(DiffDate/(1000*60*60*24*30.5)) + " months ago";
			}
			else if ( DiffDate < 1000*60*60*24*365*2 ) {
				DateString += "a year and a half ago";
			}
			else {
				DateString += Math.floor(DiffDate/(1000*60*60*24*365)) + " years ago";
			}
			DateString += '</span>';
			DateString += '. ';
			DateString += '<span class="date-local">';
			{
				// http://stackoverflow.com/a/20463521
				
//				console.log("toString: " + PostDate.toString());
//				console.log("toLocaleString: " + PostDate.toLocaleString());
//				console.log("toLocaleTimeString: " + PostDate.toLocaleTimeString());

				var Parts = PostDate.toString().split(" ");

				// Pass only if the length is 9, and the GMT slot is in the correct spot.
				if ( (Parts.length == 7) && (Parts[5].indexOf('GMT') != -1) ) {
					var DaysOfWeek = {
						'sun':"Sunday",
						'mon':"Monday",
						'tue':"Tuesday",
						'wed':"Wednesday",
						'thu':"Thursday",
						'fri':"Friday",
						'sat':"Saturday",
					};
					var MonthsOfYear = {
						'jan':"January",
						'feb':"February",
						'mar':"March",
						'apr':"April",
						'may':"May",
						'jun':"June",
						'jul':"July",
						'aug':"August",
						'sep':"September",
						'oct':"October",
						'nov':"November",
						'dec':"December",
					};
					
					// Day of the week //
					if ( DaysOfWeek.hasOwnProperty(Parts[0].toLowerCase()) ) 
						DateString += DaysOfWeek[Parts[0].toLowerCase()] + ", ";
					else
						DateString += Parts[0] + ", ";

					// Month of the year //
					if ( MonthsOfYear.hasOwnProperty(Parts[1].toLowerCase()) ) 
						DateString += MonthsOfYear[Parts[1].toLowerCase()] + " ";
					else
						DateString += Parts[1] + " ";
					
					DateString += Parts[2] + ", ";			// Day //
					DateString += Parts[3] + " ";			// Year //
										
					// 12 hour Timezone (if we can detect it) //
					if ( PostDate.toLocaleTimeString().split(" ").length > 1 ) {
						var TimeParts = Parts[4].split(':');
						var Hour = parseInt(TimeParts[0]);
						var AMPM = 'AM';
						if ( Hour == 0 ) {
							Hour = 12;
						}
						else if ( Hour == 12 ) {
							AMPM = 'PM';
						}
						else if ( Hour > 12 ) {
							Hour -= 12;
							AMPM = 'PM';
						}
						DateString += Hour + ":";
						DateString += TimeParts[1] + " ";
						DateString += AMPM + " ";
					}
					// 24 hour Timezone //
					else {
						var TimeParts = Parts[4].split(':');
						DateString += TimeParts[0] + ":" + TimeParts[1] + " ";
					}
					
					DateString += '<span class="no-mobile" title="'+Parts[5]+'">';	// GMT
					DateString += Parts[6];											// TimeZone
					DateString += '</span>';
				}
				// Can't detect a standard format, so just use toString.
				else {
					DateString += PostDate.toString();
				}
			}
			DateString += '</span>';
			
			el.innerHTML = DateString;
		}
		function UpdateDates( elroot ) {
			if ( typeof elroot == 'undefined' ) {
				elroot = document.documentElement;
			}
			var el = elroot.getElementsByClassName('date');
			for(var idx = 0, len = el.length; idx < len; ++idx) {
				UpdateDate(el[idx]);
			}
		}
		UpdateDates();
		var MinuteClock = setInterval(UpdateDates,1000*60);	// Update clocks every 60 seconds
		
		// Process Emoji on all the following sections //
		var emoji_el = document.getElementsByClassName('emoji');
		for (var idx = 0, len = emoji_el.length; idx < len; ++idx) {
			emoji_el[idx].innerHTML = emojione.shortnameToImage(emoji_el[idx].innerHTML);
		}
		
		var el = document.getElementById('content');
		var original = el.getElementsByClassName('body-edit');
		var preview = el.getElementsByClassName('body');
		for(var idx = 0, len = original.length; idx < len; ++idx) {
			preview[idx].innerHTML = html_Parse(original[idx].innerHTML);
		}
		
		var el = document.getElementById('content');
		var original = el.getElementsByClassName('edit');
		var preview = el.getElementsByClassName('preview');
		for(var idx = 0, len = original.length; idx < len; ++idx) {
			preview[idx].innerHTML = html_Parse(original[idx].innerHTML);
		}
		
		function item_Parse(id) {
			var src = document.getElementById('edit-'+id);
			var dest = document.getElementById('preview-'+id);
			dest.innerHTML = html_Parse(src.value);
		}
		
		function flextext_Update(id) {
			//console.log(id);
			var src = document.getElementById('edit-'+id);
			var dest = document.getElementById('flextext-span-'+id);
			if (document.body.hasOwnProperty('textContent'))
				dest.textContent = src.value;	// Everyone else
			else
				dest.innerText = src.value;		// IE < 9
		}
		
		var AllFlexTexts = document.getElementsByClassName("flextext");
		for ( var idx = 0, len = AllFlexTexts.length; idx < len; ++idx ) {
			var AllSpans = AllFlexTexts[idx].getElementsByTagName("span");
			var AllTextAreas = AllFlexTexts[idx].getElementsByTagName("textarea");
			for ( var idx2 = 0, len2 = AllTextAreas.length; idx2 < len2; ++idx2 ) {
				AllSpans[idx2].innerHTML = AllTextAreas[idx2].value;
			}
		}

//		var el = document.getElementById('content');
//		var original = el.getElementsByClassName('item');
//		for(var idx = 0, len = original.length; idx < len; ++idx) {
//			//console.dir(original[idx]);
//			original[idx].style.maxHeight = original[idx].scrollHeight + "px";
//		}
		
	</script>
</body>
<?php template_GetFooter(); ?>
