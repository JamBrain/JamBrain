<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head><title>Simple Event Management UI</title></head><body>

<style>
	div { margin-left: 10px; margin-bottom: 5px }
</style>

<?php # Provide quick access to create & modify events in the database for testing purposes

const CONFIG_PATH = "../src/shrub/";
const SHRUB_PATH = "../src/shrub/src/";

# Use shrub wrapper for db access
include_once __DIR__."/".CONFIG_PATH."config.php";
require_once __DIR__."/".SHRUB_PATH."constants.php";
require_once __DIR__."/".SHRUB_PATH."core/db.php";
require_once __DIR__."/".SHRUB_PATH."node/node.php";
require_once __DIR__."/".SHRUB_PATH."user/user.php";


# Identify existing events
# function nodeFeed_GetByMethod( $methods, $node_ids = null, $types = null, $subtypes = null, $subsubtypes = null, $score_op = null, $limit = 20, $offset = 0 ) {
function loadEvents()
{
	global $events, $eventcount, $suggestname;
	
	$events = db_QueryFetch(
			"SELECT
				n.id, n.name, n.slug, 
				".DB_FIELD_DATE('n.modified', 'modified')."
			FROM
				".SH_TABLE_PREFIX.SH_TABLE_NODE." AS n
			WHERE n.type = 'event'
			ORDER BY n.id
			LIMIT 100
			;"
		);
	
	//$events = nodeFeed_GetByMethod( ["all"], null, ["event"], null, null, null, 100, 0);
	$eventcount = count($events);
	$suggestname = "Testumdare " . ($eventcount+1);  
}
loadEvents();
//print_r($events);

# Suggest event start/stop times
$starttime = time();
$endtime = $starttime + 48*60*60;
$suggeststart = gmdate("Y-m-d\TH:i:s\Z", $starttime);
$suggestend = gmdate("Y-m-d\TH:i:s\Z", $endtime);



# Find the first user in the database
$firstuserid = "<NO USERS>";
$firstusername = "Add a user first";
if($userlist = nodeFeed_GetByMethod( ["all", "reverse"], null, ["user"], null, null, null, 1, 0))
{
	if(count($userlist) > 0)
	{
		$firstusernode = node_GetById($userlist[0]["id"]);
		//print("<br />");
		//print_r($firstusernode);
		$firstuserid = $firstusernode["id"];
		$firstusername = $firstusernode["name"];
	}
}

# Get root node
$rootnode = nodeComplete_GetById(1);
$featured = $rootnode["meta"]["featured"];
//print("<br />");
//print_r($rootnode);

# Act on any requests
echo http_build_query($_POST);

if($_POST)
{
	$cmd = $_POST["command"];
	print("<br />$cmd");
	switch($cmd) {
	case "Add Event":
		print("<br />Adding Event<br />");
		
		$cmdname = $_POST["eventName"];
		$cmdparent = intval($_POST["eventRoot"]);
		$cmdauthor = intval($_POST["eventAuthor"]);
		$cmdcount = intval($_POST["eventCount"]);
		$cmdstart = $_POST["eventStart"];
		$cmdend = $_POST["eventEnd"];
		$cmdcantheme = intval($_POST["canTheme"]);
		$cmdthememode= intval($_POST["themeMode"]);
		if($cmdcount === $eventcount) // only act on POST if conditions are as we expect.
		{
			// Create event node.
			# function node_Add( $parent, $author, $type, $subtype, $subsubtype, $slug, $name, $body ) {
			$newevent = node_Add( $cmdparent, $cmdauthor, "event", "", "", null, $cmdname, "");
			print_r($newevent);	    
			
			// Add metadata
			nodeMeta_AddByNode($newevent, SH_NODE_META_PUBLIC, 'can-create', 'item/game');

			nodeMeta_AddByNode($newevent, SH_NODE_META_PUBLIC, 'event-start', $cmdstart);
			nodeMeta_AddByNode($newevent, SH_NODE_META_PUBLIC, 'event-end', $cmdend);

			nodeMeta_AddByNode($newevent, SH_NODE_META_PUBLIC, 'can-theme', $cmdcantheme);
			nodeMeta_AddByNode($newevent, SH_NODE_META_PUBLIC, 'theme-mode', $cmdthememode);
			
			// Make featured
			nodeMeta_AddByNode(1, SH_NODE_META_PUBLIC, 'featured', "$newevent");
			
			// Reload event list
			loadEvents();
		}
		break;


	}
}
if($_GET)
{
	if(key_exists("cmd",$_GET))
	{
		$cmd = $_GET["cmd"];
		
		if($cmd == "setstate" && key_exists("state",$_GET))
		{	
			$event_nodeid = intval($featured);
			$state = $_GET["state"];
			switch($state)
			{
				case 1: // Theme Suggestion
					nodeMeta_AddByNode($event_nodeid, SH_NODE_META_PUBLIC, 'theme-mode', 1);
					break;
				case 2: // Theme Slaughter
					nodeMeta_AddByNode($event_nodeid, SH_NODE_META_PUBLIC, 'theme-mode', 2);
					break;
				case 3: // Theme Voting
				case 4: // Theme Final Voting
					nodeMeta_AddByNode($event_nodeid, SH_NODE_META_PUBLIC, 'theme-mode', 4);
					break;
				case 5: // Compo Running
					nodeMeta_AddByNode($event_nodeid, SH_NODE_META_PUBLIC, 'theme-mode', 5);
					break;
				case 6: // Voting
					nodeMeta_AddByNode($event_nodeid, SH_NODE_META_PUBLIC, 'theme-mode', 6);
					break;
				case 7: // Closed
					nodeMeta_AddByNode($event_nodeid, SH_NODE_META_PUBLIC, 'theme-mode', 8);					
					break;
			
			}
			
			if($state<3)
			{
				nodeMeta_AddByNode($event_nodeid, SH_NODE_META_PUBLIC, 'theme-page-mode-1', 0);
				nodeMeta_AddByNode($event_nodeid, SH_NODE_META_PUBLIC, 'theme-page-mode-2', 0);
				nodeMeta_AddByNode($event_nodeid, SH_NODE_META_PUBLIC, 'theme-page-mode-3', 0);
				nodeMeta_AddByNode($event_nodeid, SH_NODE_META_PUBLIC, 'theme-page-mode-4', 0);
			} 
			else if($state == 3)
			{
				nodeMeta_AddByNode($event_nodeid, SH_NODE_META_PUBLIC, 'theme-page-mode-1', 1);
				nodeMeta_AddByNode($event_nodeid, SH_NODE_META_PUBLIC, 'theme-page-mode-2', 1);
				nodeMeta_AddByNode($event_nodeid, SH_NODE_META_PUBLIC, 'theme-page-mode-3', 1);
				nodeMeta_AddByNode($event_nodeid, SH_NODE_META_PUBLIC, 'theme-page-mode-4', 0);
			}
			else if($state == 4)
			{
				nodeMeta_AddByNode($event_nodeid, SH_NODE_META_PUBLIC, 'theme-page-mode-1', 2);
				nodeMeta_AddByNode($event_nodeid, SH_NODE_META_PUBLIC, 'theme-page-mode-2', 2);
				nodeMeta_AddByNode($event_nodeid, SH_NODE_META_PUBLIC, 'theme-page-mode-3', 2);
				nodeMeta_AddByNode($event_nodeid, SH_NODE_META_PUBLIC, 'theme-page-mode-4', 1);
			}
			else
			{
				nodeMeta_AddByNode($event_nodeid, SH_NODE_META_PUBLIC, 'theme-page-mode-1', 2);
				nodeMeta_AddByNode($event_nodeid, SH_NODE_META_PUBLIC, 'theme-page-mode-2', 2);
				nodeMeta_AddByNode($event_nodeid, SH_NODE_META_PUBLIC, 'theme-page-mode-3', 2);
				nodeMeta_AddByNode($event_nodeid, SH_NODE_META_PUBLIC, 'theme-page-mode-4', 2);
			}
			
			nodeMeta_AddByNode($event_nodeid, SH_NODE_META_PUBLIC, 'can-theme', 1);
			nodeMeta_AddByNode($event_nodeid, SH_NODE_META_PUBLIC, 'can-publish', $state < 6 ? 1 : 0); 
			nodeMeta_AddByNode($event_nodeid, SH_NODE_META_PUBLIC, 'can-grade', $state == 6 ? 1 : 0);
			nodeMeta_AddByNode($event_nodeid, SH_NODE_META_PUBLIC, 'event-finished', $state == 7 ? 1 : 0);


			// Since this is a website, invalidating the node cache should work for the API's cache.
			nodeCache_InvalidateById($event_nodeid);
			
		}
	
	}

}


# spit out existing events and configuration options
echo "<h1>Existing Events</h1>";
foreach($events as &$event)
{
	$id = $event["id"];
	$name = $event["name"];
	$slug = $event["slug"];
	// Naive url generation assumes root node parent
	$url = "http://ludumdare.org/$slug";

    // Load metadata
	$metas = nodeMeta_ParseByNode($id);

	echo "<div>";
	echo "Node $id - <b>$name</b> <a href=\"$url\">slug '$slug'</a>";
	echo "<div>";
	foreach($metas as $scope => $metavalues)
	{
		foreach($metavalues as $key => $value)
		{
			echo "Scope $scope - '$key' => '$value'<br />";
		}
	}
	echo "</div></div>";
}


?>

<h1 id="eventMode">Set Current Event Mode</h1>
Featured node <?=$featured?> - 
<a href="?cmd=setstate&state=1#eventMode">Theme Suggestion</a> - 
<a href="?cmd=setstate&state=2#eventMode">Theme Slaughter</a> - 
<a href="?cmd=setstate&state=3#eventMode">Theme Voting</a> - 
<a href="?cmd=setstate&state=4#eventMode">Theme Final Voting</a> - 
<a href="?cmd=setstate&state=5#eventMode">Compo Running</a> - 
<a href="?cmd=setstate&state=6#eventMode">Voting</a> - 
<a href="?cmd=setstate&state=7#eventMode">Compo Closed</a>



<h1>Create Event</h1>
<form action="#" method="post">
Event Name: <input type="text" name="eventName" value="<?=$suggestname?>"/><br />
Event Author: <input type="text" name="eventAuthor" value="<?=$firstuserid?>"/> (<?=$firstuserid?> =&gt; <?=$firstusername?>)<br />
Event Root ID: <input type="text" name="eventRoot" value="1"/><br />
Event Start Time: <input type="text" name="eventStart" value="<?=$suggeststart?>"/> (Default: Now)<br />
Event End Time: <input type="text" name="eventEnd" value="<?=$suggestend?>"/> (Default: Now+48h)<br />
can-theme: <input type="text" name="canTheme" value="1"/><br />
theme-mode: <input type="text" name="themeMode" value="1"/><br />

<input type="hidden" name="eventCount" value="<?=$eventcount?>"/>
<input type="submit" name="command" value="Add Event"/>
</form>
</body></html>