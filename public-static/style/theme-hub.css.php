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
	background:#EEE;
	box-shadow: 0 1px 4px rgba(0,0,0,0.3);
}
.extra .title {
	margin-bottom:0.5em;
}
.extra > div {
	margin:0 auto;
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
	background:#AAA;
	border:0;
	padding:10px 26px;
	color:#DDD;

	margin:0.5em;
	border-radius:32px;
	font-weight:700;
    
    outline: none;
}
.submit-button:hover, .submit-button:focus {
	background:#E44;
	border:0;
	padding:10px 26px;
/*	border:2px solid #A22;*/
/*	padding:8px 24px;*/
	color:#FFB;
	
	cursor:pointer;
	box-shadow: 0 0 4px rgba(0,0,0,0.3);
}
.submit-button:active {
	background:#A22;
	border:2px solid #E44;
	padding:8px 24px;
	color:#E44;
	
}

body > .footer {
	padding:1.0em 0;
}

.sg-item {
}
.sg-item-text {
	text-overflow: ellipsis;
	overflow:hidden;
	white-space: nowrap;
}
.sg-item-x {
	position:relative;
	float:right;
	z-index:1;
	
	font-size:0.9em;
	margin-left:1.0em;
	padding:0 0.25em;
	cursor:pointer;
}
.sg-item-x:hover {
	color:#F00;
	text-shadow: 0 0px 6px rgba(255,192,0,0.5);
}
.sg-item-x:active {
	color:#FF0;
}


.alert {
	background:#E87;
	color:#FFD;
	text-align:center;
	padding:0.5em;
}

.alert a {
	font-weight:bold;
	color:#FF8;
	text-decoration:none;
}
.alert a:hover {
	color:#FFF;
	text-decoration:underline;
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
	
	box-shadow:0 0 4px rgba(0,0,0,0.3)
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