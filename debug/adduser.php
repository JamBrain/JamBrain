<!DOCTYPE html>
<html>
<head>
	<title>Add User (<?php echo $_SERVER['REQUEST_METHOD']; ?>)</title>
</head>
<body>
<?php
	require_once __DIR__ . "/../../core/node.php";
	require_once __DIR__ . "/../../core/internal/validate.php";
	
	// A better solution to autocomplete: http://stackoverflow.com/a/218453
	
	function main() {
		if ($_SERVER['REQUEST_METHOD'] === 'POST') {
			print_r($_POST);
			echo "<br />";
			
			// Required Fields in the POST data //			
			if ( !isset($_POST['_type']) ) return;
			if ( !isset($_POST['_subtype']) ) return;
			if ( !isset($_POST['_name']) ) return;
			if ( !isset($_POST['_mail']) ) return;
			if ( !isset($_POST['_password']) ) return;
			if ( !isset($_POST['_publish']) ) return;
	
			// Node Type //
			$type = sanitize_NodeType($_POST['_type']);
			if ( empty($type) ) return;	

			$subtype = sanitize_NodeType($_POST['_subtype']);
	
			// Name/Title //
			$name = $_POST['_name'];	// TODO: Sanitize
			
			// Slug //
			if ( empty($_POST['_slug']) )
				$slug = $_POST['_name'];
			else
				$slug = $_POST['_slug'];
			$slug = sanitize_Slug($slug);
			if ( empty($slug) ) return;
			
			// TODO: Confirm slug is legal
				
			// Body //
			$body = $_POST['_body'];	// TODO: Sanitize
			
			// Do we publish? //
			$publish = mb_strtolower($_POST['_publish']) == "true";
			
			// Email //
			$mail = sanitize_Email($_POST['_mail']);
			if ( empty($mail) ) return;

			// Password //
			$password = $_POST['_password'];
			if ( empty($password) ) return;

	
			$id = node_Add(
				$type,$subtype,$slug,$name,$body,
				0,2,
				$publish
			);
			
			node_AddUser($id,$mail,$password);
	
			echo "Added " . $id . ".<br />";
			echo "<br />";
		}
	}
	main();
?>
	<form method="POST" autocomplete="off">
		<input type="hidden" name="_type" value="user">
		<input type="hidden" name="_subtype" value="">
		Name: <input type="text" name="_name" value="" required><br />
		Username (slug): <input type="text" name="_slug" value=""> (if omitted, will try a sanitized Name)<br />
		E-Mail: <input type="text" name="_mail" value="" required><br />
		Password: <input type="text" name="_password" value="" required><br />
		<br />
		Body:<br /><textarea name="_body"></textarea><br />
		Confirm: <select name="_publish" required>
			<option value="true">*YES*</option>
			<option value="false">no</option>
		</select><br />
		<br />
		<input type="submit" value="Hit Me">
	</form>
</body>
</html>
