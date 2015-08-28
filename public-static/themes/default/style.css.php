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
strong, h1, h2, h3, h4, h5, h6 {
	font-weight:700;
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
	
	-webkit-transition: font-size 1s;
	transition: font-size 1s;
}
.is-mobile { display:none; }
.is-tablet { display:none; }
.is-normal { display:inline-block; }
.is-hires { display:none; }

/* High Resolution Display */
@media (min-width : 1600px)  {
	body {
		font-size: 30rem;
	}
	.is-normal { display:none; }
	.is-hires { display:inline-block; }
}
/* Tablet */
@media (min-device-width : 601px) AND (max-device-width : 800px)  {
	body {
		font-size: 17rem;
	}
	.no-tablet { display:none; }
	.is-normal { display:none; }
	.is-tablet { display:inline-block; }
}
/* Mobile */
@media (max-device-width : 600px)  {
	body {
		font-size: 14rem;
	}
	.no-tablet { display:none; }
	.no-mobile { display:none; }
	.is-normal { display:none; }
	.is-mobile { display:inline-block; }
}

body > .footer {
	text-align:center;
	color:rgba(0,0,0,0.5);
	font-size:0.6em;
	padding:4px;
}
