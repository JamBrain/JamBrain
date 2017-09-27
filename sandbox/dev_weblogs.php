<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head><title>Quick access to web logs</title></head><body>

<?php

$commands = [
	"sudo tail -n50 /var/log/apache2/error.log",
	"sudo tail -n50 /var/log/apache2/other_vhosts_access.log"
];


foreach($commands as $command)
{
	$htmlcommand = htmlspecialchars($command);
	echo "<h1>$htmlcommand</h1>\n";

	$results = null;
	exec($command, $results);
	echo("<pre>\n".implode("\n",$results)."\n</pre>\n");
}


?>

</body></html>
