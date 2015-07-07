<!DOCTYPE html>
<html>
<head>
	<title>Check User (<?php echo $_SERVER['REQUEST_METHOD']; ?>)</title>
</head>
<body>
<?php
	require_once __DIR__ . "/../../core/node.php";
	require_once __DIR__ . "/../../core/internal/validate.php";
	
	// A better solution to autocomplete: http://stackoverflow.com/a/218453
	
	// TODO: Passwords should be pre-hashed, yet POST should allow submission of 
	//	unhashed passwords (server side extra hash). At least, initially (may disable this later).
	
	// TODO: Include time with hash, and use it to hash. Give a window of 2-5 minutes for valid time
	//	hashes. This is to prevent people from using an extracted hash without knowing the true
	//	password, as ideally the true password is never transmitted.
	//	EDIT: No, this doesn't work. Time only works if encoding/decoding, not hashing.
	
	function main() {
		if ($_SERVER['REQUEST_METHOD'] === 'POST') {
			print_r($_POST);
			echo "<br />";
			
			// Required Fields in the POST data //			
			if ( !isset($_POST['login']) ) return;
			if ( !isset($_POST['password']) ) return;
			//if ( !isset($_POST['hashed_password']) ) return;
			
			// Password //
			$password = $_POST['password'];
			if ( empty($password) ) return;

			$login = $_POST['login'];
			// Can Login 3 ways:
			// - Username (slug)
			// - Email
			// - UID
			
			$mail = sanitize_Email($login);
			$uid = sanitize_Id($login);
			$slug = sanitize_Slug($login);
			
			$hash = "";
			
			if ( !empty($mail) ) {
				echo "By Mail<br />";
				$hash = user_GetHashByMail($mail);
			}
			else if ( !empty($uid) ) {
				echo "By UID<br />";
				$hash = user_GetHashById($uid);
			}
			else if ( !empty($slug) ) {
				echo "By Slug<br />";
				
				$id = node_GetNodeIdByParentIdAndSlug(CMW_NODE_USER, $slug);
				if ( $id > 0 ) {
					$hash = user_GetHashById($id);
				}
			}
			else {	
				echo "Bad Login Method<br />";
			}
			echo "Verify: " . (user_VerifyPassword($password,$hash) ? "Success!" : "failed") . "<br />";
	
			echo "<br />";
		}
	}
	main();
?>
	<form method="POST" autocomplete="off">
		Login: <input type="text" name="login" value="" required><br />
		Password: <input type="text" name="password" value="" required><br />
		<br />
		<input type="submit" value="Hit Me">
	</form>
</body>
</html>
