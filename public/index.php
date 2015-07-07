<?php 
require_once __DIR__ . "/../web.php";
require_once __DIR__ . "/../core/tables.php";
require_once __DIR__ . "/../core/node.php";
require_once __DIR__ . "/../core/internal/validate.php";
require_once __DIR__ . "/../core/internal/emoji.php";
require_once __DIR__ . "/../core/post.php";

user_StartSession();
//template_SetTheme("embed");

// Modes //
const M_DEFAULT = 1;	// Default State //
const M_ERROR = -255;	// Other Error //

$mode = M_DEFAULT;


$args = util_ParseActionURL();
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
			height:48px;

			/*position:fixed;*/
			left:0;
			top:0;
			z-index:1000;
			
			/* shadow */
			border-bottom:1px solid #000;/*rgba(96,96,96,0.2);*/
		}
		#ldbar-inner {
			color:#fff;
			background:/*#765*/ rgba(96,96,96,1.0);
			
			line-height:47px;
			
			position:relative;
			width:100%;
		}
		/* Padding in the main document */
		#ldbar-pad {			
			width:100%;
			height:49px; /* plus shadow */
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
			font-family:monospace;
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
			font-family:monospace;
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

	</style>
	
	<div id='ldbar' class='noselect'>
		<div id='ldbar-outer' style='position:fixed;'>
			<div id='ldbar-inner'>
				<div class='leftnav'>
					<div id='ldbar-logo' class='cell'><img src="<?php STATIC_URL(); ?>/logo/ludumdare/2009/LudumDareLogo80W.png" height="30" /></div>
				</div>
				<div class='rightnav'>
					<div class='cell size32'><img src="<?php STATIC_URL(); ?>/logo/mike/chicken64W.png" width="32" height="32" style="mix-blend-mode:screen" /></div>
					<div id='ldbar-notifications' class='cell' >5</div>
					<div id='ldbar-toggle' class='cell' onclick='toggleLDBar();' title='Toggle Sticky Bar'>[x]</div>
				</div>
			</div>
		</div>
		<div id='ldbar-pad'></div>
	</div>
	
	<script>
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
		
	</script>
	
	<!-- *************** -->
	
	<div id='message' style="padding:16px;">
		:D :ca: :football: :se: :house: :grin:
	</div>
	
	<style>
		body {
			background: #EEE;
		}
		#nav .row {
			margin-left:16px;
			padding:2px;
		}
		#nav .row:hover {
			background:#DDF;
		}
		#nav .slug {
			display:inline;
			font-family:monospace;
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
			background:#DFD;
		}
		#nav .link {
			background:#FDD;
		}
		#nav .authored {
			background:#FCF;
		}
		
		#content {
			margin:16px;
			padding:8px;
			border:2px solid #000;
			background:#FFF;
		}
		
		#content h1, #content h3 {
			margin:0;
		}
		#content .body {
			margin-top:12px;
		}
		
		#metas .node {
			padding-left:24px;
			font-family:monospace;
		}
		#metas .key {
			display:inline;
			font-weight:bold;
		}
	</style>

	<?php if ( $mode === M_DEFAULT ) { ?>	
	<div id="content">
		<div class="title"><h1><?php echo $this_node['name']; ?></h1><?php if ( $author_node ) { echo "<h3>by <a href='/user/".$author_node['slug']."'>" . $author_node['name'] . "</a></h3>"; } ?></div>
		<?php if ( !empty($this_node['body']) ) { ?><div class="body"><?php echo $this_node['body']; ?></div><?php } ?>
		<?php
			if ( $this_node['type'] === 'user' ) {
				echo "<br />";
				echo '<div id="games"><h3>Games:</h3>';
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
				
//				print_r($metas);
				echo "</div>";
			}
		?>	
	</div>
	
	<div id='nav' style="padding:16px;">
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

	<?php } else if ( $mode === M_ERROR ) { ?>	
		<div id="content">
			<div class="title"><h1><a href=".">Nope</a></h1></div>
		</div>

	<?php } /* $mode */ ?>	

	<script>
		emojione.ascii = true;
	
		// Process Emoji on all the following sections //
		var Section = [
			'nav','message','content'
		];
		for(var Key in Section) {
			var el = document.getElementById(Section[Key]);
			if ( el ) {
				el.innerHTML = emojione.toImage(el.innerHTML);
			}
		}
	</script>
</body>
<?php template_GetFooter(); ?>
