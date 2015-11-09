<?php require_once __DIR__."/../../style.php"; ?>

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

h2, h3, h4 {
	margin:0;
}

.info {
	background:#CCC;
	padding:12px;
}


.single-input {
	border:0;
	padding:8px 16px;
	margin:8px;
	border-radius:32px;
	font-size:1em;
	box-shadow: 0 1px 3px rgba(0,0,0,0.2);
	background:#EEE;
}
.single-input:focus {
	background:#FFF;
	color:#000;
}

.submit-button {
	border:2px solid #000;
	padding:8px 24px;
	margin:8px;
	border-radius:32px;
	background:#BBB;
	font-weight:700;
}
.submit-button:hover {
	background:#F84;
	color:#FFF;
	cursor:pointer;
	box-shadow: 0 0 4px rgba(0,0,0,0.3);
}
.submit-button:active {
	background:#48F;
}