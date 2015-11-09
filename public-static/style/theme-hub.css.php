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

body {
	color:#444;
	background:#DDD;
}

/* Header */
.header { 
	text-align:center;
	margin:0 0 1.0em 0;
}

.header .title { 
	font-size:2.4em;
	font-weight:700;
}
.header .event {
	color:#FFF;
	font-size:1.2em;
}
.header .mode { 
	font-size:0.6em;
	margin:0.3em 0;
}


.header .page {
	background:#BBB;
	padding:0.5em 0;
}

/* Body */
.body {
}

.body .main {
/*	padding-left:5%;*/
	text-align:center;
}

.body .side {
/*	padding-right:5%;*/
	/*hack*/
	height:200px;
	
	float:right;
	width:20%;
}

.body .big {
	font-size:1.4em;
}
.body .bigger {
	font-size:1.8em;
}

h1, h2, h3, h4, h5, h6 {
	margin:0;
	font-variant: small-caps;
}


.info {
	background:#CCC;
	padding:12px;
}


.form {
}
.form > div, .form > input, .form > button {
    display:inline;
	vertical-align:middle;
}

.single-input {
	border:0;
	padding:12px 20px;
	margin:8px;
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
	margin:8px;
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