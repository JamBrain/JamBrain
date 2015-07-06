<?php 
require_once __DIR__ . "/../web.php";
require_once __DIR__ . "/../core/tables.php";
require_once __DIR__ . "/../core/node.php";
require_once __DIR__ . "/../core/internal/validate.php";
require_once __DIR__ . "/../core/internal/emoji.php";
require_once __DIR__ . "/../core/post.php";

user_StartSession();

// Modes //
const M_DEFAULT = 1;	// Default State //
const M_ERROR = -255;	// Other Error //

$mode = M_DEFAULT;


$args = util_ParseActionURL();
$args_count = count($args);

// Sanitize Input
foreach( $args as $arg ) {
	$arg = sanitize_Slug($arg);
}

$args_merged = implode('/',$args);


$paths = [ CMW_NODE_ROOT ];
foreach( $args as $key => $slug ) {
	$id = node_GetNodeIdByParentIdAndSlug($paths[$key],$slug);
	if ( !empty($id) ) {
		$paths[] = $id;
	}
}
$paths_count = count($paths);
$this_id = &$paths[$paths_count-1];

$nodes = node_GetNodesByParentId( $this_id );
$nodes_count = count($nodes);

//print_r($nodes);

//template_SetTheme("embed");

?>
<?php template_GetHeader(); ?>
<body>
	<div id='message' style="padding:16px;">
		:D :grin: :ca: :se: :football: :poop: :house:
	</div>
	
	<style>
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
	</style>
	
	<div id='nav' style="padding:16px;">
		<?php
			echo "/" . $args_merged . " [".$this_id."]<br />\n";
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
	<script>
		emojione.ascii = true;
	
		// Process Emoji on all the following sections //
		var Section = [
			'nav','message'
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
