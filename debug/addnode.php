<!DOCTYPE html>
<html>
<head>
	<title>Add Node (<?php echo $_SERVER['REQUEST_METHOD']; ?>)</title>
</head>
<body>
<?php
	require_once __DIR__ . "/../../core/node.php";
	require_once __DIR__ . "/../../core/internal/validate.php";
	
	function main() {
		if ($_SERVER['REQUEST_METHOD'] === 'POST') {
			print_r($_POST);
			echo "<br />";
			
			// Required Fields in the POST data //			
			if ( !isset($_POST['type']) ) return;
			if ( !isset($_POST['name']) ) return;
			if ( !isset($_POST['author']) ) return;
			if ( !isset($_POST['parent']) ) return;
			if ( !isset($_POST['publish']) ) return;
	
			// Node Type //
			$type = sanitize_NodeType($_POST['type']);
			if ( empty($type) ) return;	
	
			// Name/Title //
			$name = $_POST['name'];	// TODO: Sanitize
			
			// Slug //
			if ( empty($_POST['slug']) )
				$slug = $_POST['name'];
			else
				$slug = $_POST['slug'];
			$slug = sanitize_Slug($slug);
			if ( empty($slug) ) return;
				
			// Body //
			$body = $_POST['body'];	// TODO: Sanitize

			// Relationships //
			$author = intval($_POST['author']);
			$parent = intval($_POST['parent']);
			
			// Do we publish? //
			$publish = mb_strtolower($_POST['publish']) == "true";

	
			$id = node_Add(
				$type,$slug,$name,$body,
				$author,$parent,
				$publish
			);
	
			echo "Added " . $id . ".<br />";
			echo "<br />";
		}
	}
	main();
?>
	<form method="POST">
		Type: 
		<select name="type" required>
			<option value="post">Post</option>
			<option value="comment">Comment</option>
			<option value="game">Game</option>
			<option value="event">Event</option>
			<option value="group">Group</option>
			<option value="redirect">Redirect</option>
			<!--<option value="null">Null</option>-->
		</select><br />
		Name: <input type="text" name="name" value="" required><br />
		Slug: <input type="text" name="slug" value=""> (omit, and we'll generate one from Name)<br />
		Body:<br /><textarea name="body"></textarea><br />
		Author Id: <input type="text" name="author" value="0" required> (who created the item)<br />
		Parent Id: 
		<input list="parent" name="parent" value="0" required />
		<datalist id="parent">
			<option value="1">1 (root)</option>
			<option value="2">2 (user)</option>
		</datalist> (I belong to this node (owner?))<br />
		Published: 
		<select name="publish" required>
			<option value="false">no</option>
			<option value="true">*YES*</option>
		</select><br />
		<br />
		<input type="submit" value="Hit Me">
	</form>
</body>
</html>
