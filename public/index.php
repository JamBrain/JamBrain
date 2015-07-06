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
	<div id='message' style="padding:16px;">
		:D :grin: :ca: :se: :football: :poop: :house:
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
		#nav .slug, #nav .id, #nav .name {
			display:inline;
		}
		#nav .slug {
			font-family: monospace;
		}
		#nav .id {
			position:absolute;
			left:256px;
		}
		#nav .name {
			position:absolute;
			left:320px;
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
	</style>

	<?php if ( $mode === M_DEFAULT ) { ?>	
	<div id="content">
		<div class="title"><h1><?php echo $this_node['name']; ?></h1><?php if ( $author_node ) { echo "<h3>by <a href='/user/".$author_node['slug']."'>" . $author_node['name'] . "</a></h3>"; } ?></div>
		<?php if ( !empty($this_node['body']) ) { ?><div class="body"><?php echo $this_node['body']; ?></div><?php } ?>
		<?php
			if ( $this_node['type'] === 'user' ) {
				echo '<div id="games"><h3>Games:</h3>';
				$games = node_GetNodesByAuthorIdAndType($this_node['id'],'game');
				foreach( $games as $game ) {
					echo "<a href=\"/user/" . $this_node['slug'] . "/" . $game['slug'] . "\">" . $game['name'] . "</a><br/>"; 
				}
				echo '</div>';
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
				echo "<div class='row'>\n";
				echo "<div class='slug'><a href='".$node['slug']."/'>" . $node['slug'] . "/</a></div> <div class='id'>[".$node['id']."]</div> <div class='name'>".$node['name']."</div><br />\n";
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
