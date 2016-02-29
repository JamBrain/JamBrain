<?php
require_once __DIR__."/../../api.php"; 	// Included by action.php

if ( basename(__FILE__) == basename($_SERVER["SCRIPT_FILENAME"]) ) {
	json_EmitError();
}

json_Emit(["whoop" => 22]);
