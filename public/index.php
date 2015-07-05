<?php 
require_once __DIR__ . "/../web.php";
require_once __DIR__ . "/../core/internal/validate.php";
require_once __DIR__ . "/../core/internal/emoji.php";
require_once __DIR__ . "/../core/post.php";

user_StartSession();

//template_SetTheme("embed");

?>
<?php template_GetHeader(); ?>
<body>
	<div id='message' style="padding:16px;">
		<strong>TODO:</strong> Insert Ludum Dare here. :D :grin: :ca: :se: :football:
	</div>
</body>
<script>
	emojione.ascii = true;
	
	var elm = document.getElementById('message');
	elm.innerHTML = emojione.toImage(emojione.toShort(elm.innerHTML + ' 💩 :house:'));
</script>
<?php template_GetFooter(); ?>
