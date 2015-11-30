<?php require_once __DIR__."/../../style.php"; ?>

<?php
const COL_DEEP = 0;
const COL_BASE = 1;
const COL_LIGHT = 2;
const COL_BRIGHT = 3;

const COL_MUTE = 4;
const COL_MUTE_LIGHT = 5;
const COL_MUTE_BRIGHT = 6;
//const COL_??? = 7;

const PAL_RED = [
	"#622",		// Deep Color //
	"#C44",		// Base Color //
	"#F88",		// Light Base Color //
	"#FFF",		// Bright Color //
	"#E55",		// Mute Base //
	"#FAA",		// Mute Light //
	"#FDD",		// Mute Bright //
];

const PAL_GREEN = [
	"#262",		// Deep Color //
	"#4C4",		// Base Color //
	"#8F8",		// Light Base Color //
	"#FFF",		// Bright Color //
	"#5E5",		// Mute Base //
	"#AFA",		// Mute Light //
	"#DFD",		// Mute Bright //
];

const PAL_BLUE = [
	"#226",		// Deep Color //
	"#44C",		// Base Color //
	"#88F",		// Light Base Color //
	"#FFF",		// Bright Color //
	"#55E",		// Mute Base //
	"#AAF",		// Mute Light //
	"#DDF",		// Mute Bright //
];

const PAL_YELLOW = [
	"#662",		// Deep Color //
	"#CC4",		// Base Color //
	"#FF8",		// Light Base Color //
	"#FFF",		// Bright Color //
	"#EE5",		// Mute Base //
	"#FFA",		// Mute Light //
	"#FFD",		// Mute Bright //
];


const BEZIER_NORMAL = 			"cubic-bezier(0.5,-1.0,0.1,2.0)";
const BEZIER_NO_DIP = 			"cubic-bezier(0.5, 0.0,0.1,2.0)";
const BEZIER_NO_POP = 			"cubic-bezier(0.5,-1.0,0.1,1.0)";
const BEZIER_NO_DIP_NO_POP =	"cubic-bezier(0.5, 0.0,0.1,1.0)";

const BEZIER_BIG_DIP = 			"cubic-bezier(0.5,-1.0,0.1,3.0)";
const BEZIER_NO_DIP_BIG_POP = 	"cubic-bezier(0.5, 0.0,0.1,3.0)";

?>


body {
	color:#444;
	background:#BBB;
}

/* Header */
.header { 
	text-align:center;
	padding:0.5em 0;
	
	color:#FD0;
/*	background:-webkit-linear-gradient(to bottom, #d53 0%,#d83 80%,#eb5 95%,#ed5 100%);*/
/*	background:linear-gradient(to bottom, #d53 0%,#d83 80%,#eb5 95%,#ed5 100%);*/
	background:-webkit-linear-gradient(to bottom, #d53 0%,#d83 80%);
	background:linear-gradient(to bottom, #d53 0%,#d83 80%);
	text-shadow:0 1px 2px rgba(128,0,0,0.5);
	border-bottom:2px solid #EB5;
}

/* Invented Color */
.inv {
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
body > .body {
	background:#DDD;
}

body > .body .main {
	padding:1.0em 2.0em;
	text-align:center;
}

body > .body .headline {
	margin-bottom:2.0em;
}

.action {
	margin-top:2.0em;
}
.gap {
	margin-top:2.0em !important;
}

.extra {
	padding:1.0em 0;
	color:#630;
	background: -webkit-linear-gradient(to bottom,#FEC 35%,#FDA 100%);
	background: linear-gradient(to bottom,#FEC 35%,#FDA 100%);
	box-shadow: 0 2px 6px rgba(0,0,0,0.2);
}
.extra .title {
	margin-bottom:0.5em;
	padding:0 1.0em;
}
.extra > div {
	margin:0 auto;
}


.action .title {
	margin:0.5em 0;
}
.action .form {
}
.action .form > div, .action .form > input, .action .form > button {
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
	box-shadow: 0 1px 6px rgba(0,0,0,0.2);
	background:#EEE;
	
	outline: none;
}
.single-input:focus {
	background:#FFF;
	color:#000;
}

.submit-button {
	background:#AAA;
	color:#DDD;
}

button {
	background:#AAA;
	color:#DDD;

	border:0;
	padding:12px 28px;
	cursor:pointer;

	margin:0.5em;
	border-radius:2.0em;
	font-weight:700;
    outline: none;

    transition: transform 0.2s <?=BEZIER_NO_DIP_BIG_POP?>;
}
button:hover {
	transform: scale(1.25);
}
button:focus {
	background:#666;
	color:#FFF;
	
	padding:10px 26px;
	/*border:2px dotted #FFF;*/
	border:2px solid #FFF;
}
button:active {
	background:#FFF;
	color:#666;
	/*transform: scale(1.5);*/
}

.submit-button:focus {
	background:<?=PAL_BLUE[COL_MUTE]?>;
	color:<?=PAL_BLUE[COL_BRIGHT]?>;
}
.submit-button:active {
	background:<?=PAL_BLUE[COL_BRIGHT]?>;
	color:<?=PAL_BLUE[COL_MUTE]?>;
	box-shadow: 0 0px 6px <?=PAL_BLUE[COL_MUTE]?>;
}

.login-button:focus {
	background:<?=PAL_RED[COL_MUTE]?>;
	color:<?=PAL_RED[COL_BRIGHT]?>;
}
.login-button:active {
	background:<?=PAL_RED[COL_BRIGHT]?>;
	color:<?=PAL_RED[COL_MUTE]?>;
	box-shadow: 0 0px 6px <?=PAL_RED[COL_MUTE]?>;
}

body > .footer {
	padding:1.0em 0;
}

.item-text {
	text-overflow: ellipsis;
	overflow:hidden;
	white-space:nowrap;
}

.item {
	padding:0.125em;
}
.sg-item {
	padding:0.125em 1.0em;
}
.sg-item-text {
	padding:0 0.25em;
}
.sg-item-x {
	position:relative;
	float:right;
	z-index:1;
	
	line-height:1.0em;
	margin-left:1.0em;
	padding:0 0.25em;
	cursor:pointer;
	
	transition: transform 0.2s <?=BEZIER_NO_DIP_BIG_POP?>;
}
.sg-item-x:hover {
	color:#F00;
	transform: scale(1.25);
}
.sg-item-x:active {
	color:#FFF;
	/*transform: scale(1.5);*/
	text-shadow: 0 0px 6px #F00;
}

#sg-count {
	padding:0.25em;
}

a {
	color: #D53;
}
a:focus, a:active {
	color: #FFF;
}

.alert {
	background:<?=PAL_RED[COL_BASE]?>;
	color:<?=PAL_RED[COL_MUTE_LIGHT]?>;
	text-align:center;
	padding:0.5em;
}

.alert a {
	font-weight:700;
	color:<?=PAL_YELLOW[COL_LIGHT]?>;
}
.alert a:focus {
	color:<?=PAL_RED[COL_BRIGHT]?>;
}

/* Can't Select This */
button, .sg-item-x {
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
}

#dialog-back {
	background:rgba(64,48,48,0.7);
	
	position:fixed;
	left:0;
	right:0;
	top:0;
	bottom:0;
	
	z-index:999;
	
	display:-webkit-flex;
	display:flex;
	justify-content:center;
	align-items:center;
}


.effect-fadein {
    -webkit-animation: fadein 0.4s;
       -moz-animation: fadein 0.4s;
        -ms-animation: fadein 0.4s;
            animation: fadein 0.4s;
}
@keyframes fadein {
    from { opacity: 0; }
    to   { opacity: 1; }
}
@-ms-keyframes fadein {
    from { opacity: 0; }
    to   { opacity: 1; }
}
@-moz-keyframes fadein {
    from { opacity: 0; }
    to   { opacity: 1; }
}
@-webkit-keyframes fadein {
    from { opacity: 0; }
    to   { opacity: 1; }
}

.effect-fadeout {
    -webkit-animation: fadeout 0.4s;
       -moz-animation: fadeout 0.4s;
        -ms-animation: fadeout 0.4s;
            animation: fadeout 0.4s;
	visibility:hidden;
}
@keyframes fadeout {
    from { opacity: 1; visibility:visible; }
    to   { opacity: 0; visibility:hidden; }
}
@-ms-keyframes fadeout {
    from { opacity: 1; visibility:visible; }
    to   { opacity: 0; visibility:hidden; }
}
@-moz-keyframes fadeout {
    from { opacity: 1; visibility:visible; }
    to   { opacity: 0; visibility:hidden; }
}
@-webkit-keyframes fadeout {
    from { opacity: 1; visibility:visible; }
    to   { opacity: 0; visibility:hidden; }
}


.effect-zoomin {
    -webkit-animation: zoomin 0.3s;
       -moz-animation: zoomin 0.3s;
        -ms-animation: zoomin 0.3s;
    		animation: zoomin 0.3s;

	-webkit-animation-timing-function: <?=BEZIER_NO_DIP?>;
	   -moz-animation-timing-function: <?=BEZIER_NO_DIP?>;
	    -ms-animation-timing-function: <?=BEZIER_NO_DIP?>;
			animation-timing-function: <?=BEZIER_NO_DIP?>;
}
@keyframes zoomin {
    from { transform: scale(0); }
    to   { transform: scale(1); }
}
@-ms-keyframes zoomin {
    from { transform: scale(0); }
    to   { transform: scale(1); }
}
@-moz-keyframes zoomin {
    from { transform: scale(0); }
    to   { transform: scale(1); }
}
@-webkit-keyframes zoomin {
    from { transform: scale(0); }
    to   { transform: scale(1); }
}

.effect-zoomout {
    -webkit-animation: zoomout 0.3s;
       -moz-animation: zoomout 0.3s;
        -ms-animation: zoomout 0.3s;
    		animation: zoomout 0.3s;

	-webkit-animation-timing-function: <?=BEZIER_NO_DIP_NO_POP?>;
	   -moz-animation-timing-function: <?=BEZIER_NO_DIP_NO_POP?>;
	    -ms-animation-timing-function: <?=BEZIER_NO_DIP_NO_POP?>;
			animation-timing-function: <?=BEZIER_NO_DIP_NO_POP?>;
}
@keyframes zoomout {
    from { transform: scale(1); }
    to   { transform: scale(0); visibility:hidden; }
}
@-ms-keyframes zoomout {
    from { transform: scale(1); }
    to   { transform: scale(0); visibility:hidden; }
}
@-moz-keyframes zoomout {
    from { transform: scale(1); }
    to   { transform: scale(0); visibility:hidden; }
}
@-webkit-keyframes zoomout {
    from { transform: scale(1); }
    to   { transform: scale(0); visibility:hidden; }
}

.effect-accent {
	background:rgba(255,0,0,0.0);

    -webkit-animation: accent 0.8s;
       -moz-animation: accent 0.8s;
        -ms-animation: accent 0.8s;
    		animation: accent 0.8s;
}
@keyframes accent {
    from { background:rgba(255,0,0,0.5); }
    to   { background:rgba(255,0,0,0.0); }
}
@-ms-keyframes accent {
    from { background:rgba(255,0,0,0.5); }
    to   { background:rgba(255,0,0,0.0); }
}
@-moz-keyframes accent {
    from { background:rgba(255,0,0,0.5); }
    to   { background:rgba(255,0,0,0.0); }
}
@-webkit-keyframes accent {
    from { background:rgba(255,0,0,0.5); }
    to   { background:rgba(255,0,0,0.0); }
}


#kill {
	text-align:left;
}

#kill .selected {
	background:<?=PAL_RED[COL_LIGHT]?>;
}
#kill .selected:hover {
	background:<?=PAL_RED[COL_MUTE_LIGHT]?>;
}

.kill-group {
	border-radius:4px;
	max-width:24em;
	cursor:pointer;
}
#kill-theme {
	padding:0.5em;
}

.kill-item {
	cursor:pointer;
	max-width:24em;
}
.kill-item:hover {
	background:<?=PAL_YELLOW[COL_LIGHT]?>;
}

.kill-group {
	color:#630;
	background: -webkit-linear-gradient(to bottom,#FFF 35%,#EEE 100%);
	background: linear-gradient(to bottom,#FFF 35%,#EEE 100%);
	box-shadow: 0 2px 6px rgba(0,0,0,0.2);
}

.edit .kill-group {
	background: -webkit-linear-gradient(to bottom,#FBA 35%,#E87 100%);
	background: linear-gradient(to bottom,#FBA 35%,#E87 100%);
}

/* If the parent has an EDIT class, then show */
.edit .edit-only {
	display:block;
}
.edit .edit-only-inline {
	display:inline-block;
}
.edit-only, .edit-only-inline {
	display:none;
}


.item-left {
	width:1.5em;
	line-height:1em;
	float:left;
}
.item-right {

}

.item-good {
}
.item-bad {
}
.item-flag {
}


.admin-item:hover {
	background:#F66 !important;
}

#dialog {
	text-align:center;
	/*pointer-events:none;*/
	
	overflow:hidden;
	max-width:20em;
	
	z-index:1000;
	
	border-radius:1.0em;
	box-shadow:0 2px 6px rgba(0,0,0,0.3);
}
#dialog .title {
	font-weight:700;
	
	padding:0.5em 1.0em;
	text-overflow:ellipsis;
	overflow:hidden;
}
#dialog .body {
	padding:0.5em 2.0em;
}
#dialog .body > div {
	margin:0.5em 0;
}
#dialog .buttons {
	padding:0.5em 2.0em;
}

/* Red */
.red_dialog {
	background:<?=PAL_RED[COL_BASE]?>;
}
.red_dialog .title {
	color:<?=PAL_RED[COL_BRIGHT]?>;
}
.red_dialog .body {
	color:<?=PAL_RED[COL_DEEP]?>;
	background:<?=PAL_RED[COL_LIGHT]?>;
}
.red_dialog .buttons {
	color:<?=PAL_RED[COL_DEEP]?>;
}
.red_dialog button, .red_button {
	background:<?=PAL_RED[COL_MUTE]?>;
	color:<?=PAL_RED[COL_MUTE_BRIGHT]?>;
}
.red_dialog button:focus, .red_button:focus {
	background:<?=PAL_RED[COL_MUTE_LIGHT]?>;
	color:<?=PAL_RED[COL_BRIGHT]?>;
}
.red_dialog button:active, .red_button:active {
	background:<?=PAL_RED[COL_BRIGHT]?>;
	color:<?=PAL_RED[COL_MUTE_LIGHT]?>;
	box-shadow: 0 0px 6px <?=PAL_RED[COL_MUTE_LIGHT]?>;
}

.red_button {
	background:<?=PAL_RED[COL_BASE]?>;
	color:<?=PAL_RED[COL_LIGHT]?>;
}
.red_button:focus {
	background:<?=PAL_RED[COL_MUTE]?>;
	color:<?=PAL_RED[COL_BRIGHT]?>;
}
.red_button:active {
	background:<?=PAL_RED[COL_BRIGHT]?>;
	color:<?=PAL_RED[COL_MUTE]?>;
	box-shadow: 0 0px 6px <?=PAL_RED[COL_MUTE]?>;
}

/* Green */
.green_dialog {
	background:<?=PAL_GREEN[COL_BASE]?>;
}
.green_dialog .title {
	color:<?=PAL_GREEN[COL_BRIGHT]?>;
}
.green_dialog .body {
	color:<?=PAL_GREEN[COL_DEEP]?>;
	background:<?=PAL_GREEN[COL_LIGHT]?>;
}
.green_dialog .buttons {
	color:<?=PAL_GREEN[COL_DEEP]?>;
}
.green_dialog button {
	background:<?=PAL_GREEN[COL_MUTE]?>;
	color:<?=PAL_GREEN[COL_MUTE_BRIGHT]?>;
}
.green_dialog button:focus {
	background:<?=PAL_GREEN[COL_MUTE_LIGHT]?>;
	color:<?=PAL_GREEN[COL_BRIGHT]?>;
}
.green_dialog button:active {
	background:<?=PAL_GREEN[COL_BRIGHT]?>;
	color:<?=PAL_GREEN[COL_MUTE_LIGHT]?>;
	box-shadow: 0 0px 6px <?=PAL_GREEN[COL_MUTE_LIGHT]?>;
}

.green_button {
	background:<?=PAL_GREEN[COL_BASE]?>;
	color:<?=PAL_GREEN[COL_LIGHT]?>;
}
.green_button:focus {
	background:<?=PAL_GREEN[COL_MUTE]?>;
	color:<?=PAL_GREEN[COL_BRIGHT]?>;
}
.green_button:active {
	background:<?=PAL_GREEN[COL_BRIGHT]?>;
	color:<?=PAL_GREEN[COL_MUTE]?>;
	box-shadow: 0 0px 6px <?=PAL_GREEN[COL_MUTE]?>;
}


/* Blue */
.blue_dialog {
	background:<?=PAL_BLUE[COL_BASE]?>;
}
.blue_dialog .title {
	color:<?=PAL_BLUE[COL_BRIGHT]?>;
}
.blue_dialog .body {
	color:<?=PAL_BLUE[COL_DEEP]?>;
	background:<?=PAL_BLUE[COL_LIGHT]?>;
}
.blue_dialog .buttons {
	color:<?=PAL_BLUE[COL_DEEP]?>;
}
.blue_dialog button, .blue_button {
	background:<?=PAL_BLUE[COL_MUTE]?>;
	color:<?=PAL_BLUE[COL_MUTE_BRIGHT]?>;
}
.blue_dialog button:focus, .blue_button:focus {
	background:<?=PAL_BLUE[COL_MUTE_LIGHT]?>;
	color:<?=PAL_BLUE[COL_BRIGHT]?>;
}
.blue_dialog button:active, .blue_button:active {
	background:<?=PAL_BLUE[COL_BRIGHT]?>;
	color:<?=PAL_BLUE[COL_MUTE_LIGHT]?>;
	box-shadow: 0 0px 6px <?=PAL_BLUE[COL_MUTE_LIGHT]?>;
}


/* Yellow */
.yellow_dialog {
	background:<?=PAL_YELLOW[COL_BASE]?>;
}
.yellow_dialog .title {
	color:<?=PAL_YELLOW[COL_BRIGHT]?>;
}
.yellow_dialog .body {
	color:<?=PAL_YELLOW[COL_DEEP]?>;
	background:<?=PAL_YELLOW[COL_LIGHT]?>;
}
.yellow_dialog .buttons {
	color:<?=PAL_YELLOW[COL_DEEP]?>;
}
.yellow_dialog button {
	background:<?=PAL_YELLOW[COL_MUTE]?>;
	color:<?=PAL_YELLOW[COL_MUTE_BRIGHT]?>;
}
.yellow_dialog button:focus {
	background:<?=PAL_YELLOW[COL_MUTE_LIGHT]?>;
	color:<?=PAL_YELLOW[COL_BRIGHT]?>;
}
.yellow_dialog button:active {
	background:<?=PAL_YELLOW[COL_BRIGHT]?>;
	color:<?=PAL_YELLOW[COL_MUTE_LIGHT]?>;
	box-shadow: 0 0px 6px <?=PAL_YELLOW[COL_MUTE_LIGHT]?>;
}

.yellow_button {
	background:<?=PAL_YELLOW[COL_BASE]?>;
	color:<?=PAL_YELLOW[COL_LIGHT]?>;
}
.yellow_button:focus {
	background:<?=PAL_YELLOW[COL_MUTE]?>;
	color:<?=PAL_YELLOW[COL_BRIGHT]?>;
}
.yellow_button:active {
	background:<?=PAL_YELLOW[COL_BRIGHT]?>;
	color:<?=PAL_YELLOW[COL_MUTE]?>;
	box-shadow: 0 0px 6px <?=PAL_YELLOW[COL_MUTE]?>;
}


#dialog-focusfirst a, #dialog-focuslast a, .no-style {
	border-bottom:0 !important;
}

.space {
	letter-spacing:0.05em;
}
.big-space {
	letter-spacing:0.2em;
}

.soft-shadow, a:focus {
	text-shadow:0 1px 6px rgba(0,0,0,0.2);
}
.shadow {
	text-shadow:0 1px 2px rgba(0,0,0,0.2);
}


/* Normal and HiRes */
body > .body {
	position:relative;
	
	overflow:hidden;
	text-align:center;
	
	/*box-shadow:0 0 4px rgba(0,0,0,0.3);*/
	border-bottom:2px solid rgba(0,0,0,0.3);
	border-top:2px solid rgba(255,255,255,0.5);
}
body > .body > div {
	display:inline-block;
	vertical-align:top;
}
body > .body .main {
}
body > .body .extra {
	min-width:12em;
	max-width:30%;
	text-align:left;
	margin:1em 0;
	border-radius:2px;
}

/* Tablet and Mobile */
@media <?= MOBILE_AND_TABLET_QUERY ?> {
	body > .body > div {
		display:block;
	}
	body > .body .main {
	}
	body > .body .extra {
		max-width:none;
		font-size:1.4em;
		margin:0;
		border-radius:0;
	}
}