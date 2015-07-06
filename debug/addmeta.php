<!DOCTYPE html>
<html>
<head>
	<title>Add Node Meta (<?php echo $_SERVER['REQUEST_METHOD']; ?>)</title>
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
			if ( !isset($_POST['id_a']) ) return;
			if ( !isset($_POST['id_b']) ) return;
			if ( !isset($_POST['type']) ) return;
			if ( !isset($_POST['subtype']) ) return;
			if ( !isset($_POST['data']) ) return;
	
			// TODO: Sanitize //
			$id_a = $_POST['id_a'];
			$id_b = $_POST['id_b'];
			$type = $_POST['type'];
			$subtype = $_POST['subtype'];
			$data = $_POST['data'];

	
			$id = node_AddMeta(
				$id_a,$id_b,
				$type,$subtype,
				$data
			);
	
			echo "Added Meta " . $id . ".<br />";
			echo "<br />";
		}
	}
	main();
?>
	<form method="POST">
		ID_A: <input type="text" name="id_a" value="0" required><br />
		ID_B: <input type="text" name="id_b" value="0" required><br />
		Type: <input type="text" name="type" value="" required><br />
		Subtype: <input type="text" name="subtype" value=""> (omit, and it's considered a top-level property)<br />
		Data:<br /><textarea name="data"></textarea><br />
		<input type="submit" value="Hit Me">
	</form>
</body>
</html>
