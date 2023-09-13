<?php
const CONFIG_PATH = "../src/shrub/";
const SHRUB_PATH = "../src/shrub/src/";

include_once __DIR__."/".CONFIG_PATH."config.php";

require_once __DIR__."/".SHRUB_PATH."core/cli_root.php";	// Confirm CLI, Require ROOT
require_once __DIR__."/".SHRUB_PATH."core/db.php";
require_once __DIR__."/".SHRUB_PATH."constants.php";		// For the SH_TABLE constants. run gen.sh if not up-to-date.
require_once __DIR__."/".SHRUB_PATH."global/global.php";
require_once __DIR__."/".SHRUB_PATH."core/core.php";

require_once __DIR__."/".SHRUB_PATH."user/user.php";

$cmd = array_shift($argv);
$file = array_shift($argv);

if ( strlen($file) ) {
	$row = 0;
	$extra_row = 0;
	if ( ($handle = fopen($file, "r")) !== FALSE ) {
	    while ( ($data = fgetcsv($handle, 0)) !== FALSE ) {
	        $num = count($data);

			$data[1] = coreSlugify_Name( $data[1] );
			$data[2] = coreSlugify_Name( $data[2] );
			
			$data[4] = strtolower( $data[4] );
	        
	        userReserved_Add($data[1], $data[4]);
	        $row++;
	        if ( $data[1] !== $data[2] ) {
	        	userReserved_Add($data[2], $data[4]);
	        	$row++;
	        	$extra_row++;
	        }
	        
//	        echo implode($data,' | ')."\n";
	    }
	    fclose($handle);
	}
	echo "Added $row row(s), including $extra_row extra row(s)\n";
}
