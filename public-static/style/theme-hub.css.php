<?php require_once __DIR__."/../../style.php"; ?>

body {
	color:#444;
	background:#BBB;
}

/* Header */
.header { 
	text-align:center;
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
	padding:1.0em 2.0em;
	text-align:center;
}

.body .headline {
	margin-bottom:2.0em;
}
.body .action {
	margin-top:1.0em;
}

.extra {
	padding:1.0em;
	background:#CCC;
	box-shadow: 0 0px 3px rgba(0,0,0,0.2);
}
.extra .title {
	margin-bottom:0.5em;
}
.extra > div {
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
	box-shadow: 0 1px 4px rgba(0,0,0,0.2);
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
	
	padding:8px 24px;
}

body > .footer {
	padding:1.0em 0;
}

.sg-item {
}
.sg-item-x {
	float:right;
	margin-left:1.0em;
	padding:0 0.25em;
	text-shadow: 0 0px 2px rgba(0,0,0,0.3);
	cursor:pointer;
}
.sg-item-x:hover {
	color:#F00;
}
.sg-item-x:active {
	color:#FF0;
}

/* Can't Select This */
.submit-button, .sg-item-x {
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
}

/* Normal and HiRes */
.body {
	position:relative;
	
	overflow:hidden;
	text-align:center;
	white-space:nowrap;
}
.body > div {
	display:inline-block;
	vertical-align:top;
}
.body .main {
}
.body .extra {
	min-width:12em;
	max-width:30%;
	text-align:left;
	margin:1em 0;
}

/* Tablet and Mobile */
@media <?= MOBILE_AND_TABLET_QUERY ?> {
	.body > div {
		display:block;
	}
	.body .main {
	}
	.body .extra {
		max-width:none;
		font-size:1.4em;
		margin:0;
	}
}