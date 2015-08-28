<?php require_once __DIR__."/../../../style.php"; ?>
/* Styles */
html {
	/* REMs to Pixels */
	font-size:1px;
	
	/* Lato - Our standard font (Google Fonts) */
	/* Helvetica - Apple */
	/* Roboto - Android */
	/* Arial Nova - Win10 */
	/* Segoe UI - WinVista+ */
	/* Ubuntu Light - Ubuntu */
	font-family: "Lato", "Helvetica Neue", "Roboto", "Arial Nova", "Segoe UI", "Ubuntu Light", sans-serif;
	
	/* Weight (400 is Normal, 300 is Light/Book) */
	font-weight:300;
}

body {
	margin:0;
	color:#333;
}
img, a {
	border:none;
	outline:none;
}
p {
	line-height:1.5;
}


/* Normal */
body {
	font-size: 21px; font-size: 21rem;
}
/* Tablet */
@media  (max-device-width : 800px)  {
	body {
		font-size: 17rem;
	}
	.no-tablet {
		display:none;
	}
}
/* Mobile */
@media  (max-device-width : 600px)  {
	body {
		font-size: 14rem;
	}
	.no-mobile {
		display:none;
	}
}

body > .footer {
	text-align:center;
	color:rgba(0,0,0,0.5);
	font-size:0.6em;
	padding:4px;
}
