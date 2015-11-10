<?php require_once __DIR__."/../../style.php"; ?>

.noselect {
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
}

.caps {
	font-variant: small-caps;
}

.small {
	font-size:0.7em;
}
.normal {
	font-size:1.0em;
}
.big {
	font-size:1.4em;
}
.bigger {
	font-size:1.8em;
}

body {
	color:#444;
	background:#BBB;
}

/* Header */
.header { 
	text-align:center;

	background:#BBB;
	padding:0.5em 0;
}

/* Invented Color */
.header .inv {
	color:#FFF;
}

.header .event {
}
.header .mode { 
	margin:0.3em 0;
}
.header .date {
	margin:0.3em 0;
}

/* Body */
.body {
	background:#DDD;
}

.body .main {
	background:#DDD;
	padding:1em 0;
	text-align:center;
}

.body .headline {
	margin-bottom:2.0em;
}
.body .action {
	margin-top:1.0em;
}

.body .side {
/*	padding-right:5%;*/
	/*hack*/
	height:200px;
	
	float:right;
	width:20%;
}

h1, h2, h3, h4, h5, h6 {
	margin:0;
	font-variant: small-caps;
}

.extra {
	padding:0.5em;
}
.extra .title {
	margin-bottom:0.5em;
}
.extra > div {
/*	width:20em;*/
	margin:0 auto;
}
.extra > div > div > div {
	text-overflow: ellipsis;
	overflow:hidden;
	white-space: nowrap;
}

.action .title {
	margin:0.5em 0;
}
.action .form {
}
.action .form > div, .form > input, .form > button {
    display:inline;
	vertical-align:middle;
}
.action .footnote {
	margin-top:1.0em;
}

.single-input {
	border:0;
	padding:12px 20px;
	margin:0 0.5em;
	border-radius:40px;
	font-size:1em;
	box-shadow: 0 1px 3px rgba(0,0,0,0.2);
	background:#EEE;
	
	outline: none;
}
.single-input:focus {
	background:#FFF;
	color:#000;
}

.submit-button {
	background:#BBB;
	border:2px solid #888;
	color:#444;

	padding:8px 24px;
	margin:0.5em;
	border-radius:32px;
	font-weight:700;
	
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    
    outline: none;
}
.submit-button:hover, .submit-button:focus {
	background:#F84;
	border:2px solid #A42;
	color:#420;
	
	cursor:pointer;
	box-shadow: 0 0 4px rgba(0,0,0,0.3);
}
.submit-button:active {
	background:#A42;
	border:2px solid #F84;
	color:#F84;

/*	background:#48F;*/
/*	border:6px solid #000;*/
	
	padding:8px 24px;
}

body > .footer {
	padding:1.0em 0;
}


/* Normal and HiRes */
.body {
	overflow:hidden;
}
.body .main {
	float:left;
	width:65%;
	padding-left:2.5%;
	padding-right:2.5%;
}
.body .extra {
	float:left;
	width:25%;
	padding-left:2.5%;
	padding-right:2.5%;
}

/* Tablet and Mobile */
@media (max-width : 800px) {
	.body .main {
		float:none;
		width:auto;
	}
	.body .extra {
		float:none;
		width:auto;
		background:#CCC;
	}
}