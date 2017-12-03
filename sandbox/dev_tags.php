<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head><title>Simple Tag Management UI</title></head><body>

<style>
	div { margin-left: 10px; margin-bottom: 5px }
</style>

<?php # Provide quick access to create & modify platform tags in the database for testing purposes

const CONFIG_PATH = "../src/shrub/";
const SHRUB_PATH = "../src/shrub/src/";

# Use shrub wrapper for db access
include_once __DIR__."/".CONFIG_PATH."config.php";
require_once __DIR__."/".SHRUB_PATH."constants.php";
require_once __DIR__."/".SHRUB_PATH."core/db.php";
require_once __DIR__."/".SHRUB_PATH."core/core.php";
require_once __DIR__."/".SHRUB_PATH."node/node.php";
require_once __DIR__."/".SHRUB_PATH."user/user.php";


$category = "platform";

$defaulttags = [
	"Source Code", "Windows", "Linux", "Html5 (Web)", "macOS", "Android", "Gameboy", "Toaster"
];
$defaultwarnings = [
	"Linux" => "If you used the default Unity export options for Linux, you may want to re-export with the 'Universal' preset to make the game playable by more Linux users.",
	"Toaster" => "Please remember to warn your users to unplug the appliance while inserting and removing games"
];

$randomwarnings = [
	"This platform is dumb and you are dumb.",
	"Remember that there's a 30 percent chance that your system will catch fire when submitting a link for this platform",
	"Statistically speaking, it's unlikely that this will ever be viewed"
];


if($_GET)
{
	if(key_exists("category", $_GET))
	{
		$category = $_GET["category"];
	}
}


# Enumerate existing tags in category.
function LoadTagsForCategory($category)
{
	$simple = node_GetSimpleByType("tag",$category);
	$tagids = [];
	foreach($simple as $s)
	{
		$tagids[] = $s["id"];
	}
	
	# Get complete nodes for the tags.
	if(count($tagids) > 0)
	{
		$nodes = nodeComplete_GetById($tagids);
		return $nodes;
	}
	return [];
}

Function AddNewTag($category, $name, $warning = null)
{
	global $firstuserid;
	if($firstuserid == null)
	{
		echo '<div style="font-color: red">Unable to add tag because there are no users in the system</div><br />';
		return;
	}
	$parent = 1; // For now hardcode root = 1
	$slug = coreSlugify_Name($name);
	$newtag = node_Add( $parent, $firstuserid, "tag", $category, "", $slug, $name, "");

	// Uncertain if this node needs to be published. Probably not.
	
	if($warning != null)
	{
		SetWarning($newtag, $warning);
	}
	echo "<div style=\"font-color: green\">Added tag $newtag with name '$name'</div><br />";
}

function SetWarning($id, $warning)
{
	nodeMeta_AddOrphan($id, 0, SH_SCOPE_PUBLIC, 'tag-warning', $warning);
}

function ClearWarning($id)
{
	nodeMeta_RemoveOrphan($id, 0, SH_SCOPE_PUBLIC, 'tag-warning', "");
}

function RemoveTag($id, $node)
{
	// don't actually delete the node, just revert slug and change subtype to "deleted".
	$slug = "$". $id;
	node_Edit($id, $node["parent"], $node["author"], $node["type"], $node["subtype"], $node["subsubtype"], $slug, $node["name"], $node["body"]);
	node_SetType($id, "tag", "deleted");
}

$nodes = LoadTagsForCategory($category);


# Find the first user in the database
$firstuserid = null;
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

# Process the request that we were given, if any, and maybe reload the nodes to reflect the outcome.

if($_GET)
{
	if(key_exists("createdefault",$_GET))
	{
		$nodebyname = [];
		foreach($nodes as $n)
		{
			$nodebyname[$n["name"]] = $n;
		}
		
		foreach($defaulttags as $tag)
		{
			$warning = null;
			if(key_exists($tag, $defaultwarnings))
			{
				$warning = $defaultwarnings[$tag];
			}
			
			if(!key_exists($tag, $nodebyname))
			{
				AddNewTag($category, $tag, $warning);
			}
		}
		
		$nodes = LoadTagsForCategory($category);
	}

}

if($_POST)
{
	if(key_exists("tagid", $_POST))
	{
		$id = intval($_POST["tagid"]);
		$node = null;
		foreach($nodes as $n)
		{
			if($n["id"] == $id) { $node = $n; break; }
		}
		
		if($node && $id)
		{
			if(key_exists("changename",$_POST))
			{
				$name = $_POST["tagname"];
				$slug = coreSlugify_Name($name);
				node_Edit($id, $node["parent"], $node["author"], $node["type"], $node["subtype"], $node["subsubtype"], $slug, $name, $node["body"]);
			}
			
			if(key_exists("changewarning",$_POST))
			{
				$newwarning = $_POST["tagwarning"];
				SetWarning($id, $newwarning);		
			}
			
			if(key_exists("removewarning",$_POST))
			{
				ClearWarning($id);		
			}
			
			if(key_exists("addwarning",$_POST))
			{
				$index = random_int(1,count($randomwarnings))-1;
				SetWarning($id, $randomwarnings[$index]);		
			}
			
			if(key_exists("delete",$_POST))
			{
				RemoveTag($id, $node);
			}
			
			$nodes = LoadTagsForCategory($category);
		}
	}

	if(key_exists("create",$_POST))
	{
		$name = $_POST["tagname"];
		AddNewTag($category, $name);
		$nodes = LoadTagsForCategory($category);
	}
	
}

$count = count($nodes);
$s = $count==1?"":"s";
echo "<h2>$count Tag$s for subtype '$category'</h2>";


# For each tag node, emit some UI to allow changing things.
$action = "?category=".urlencode($category);

foreach($nodes as $node)
{
	$tagname = $node["name"];
	$tagid = $node["id"];
	$haswarning = key_exists("tag-warning",$node["meta"]);
	if($haswarning)
	{
		$warningtext = $node["meta"]["tag-warning"];
	}
?>
<div style="border:5px; background-color: #EEE">
<h3><a href="http://api.ludumdare.org/vx/node/get/<?=$tagid?>?pretty"><?=$tagid?></a> <?=$tagname?></h3>
<form action="<?=$action?>" method="post">
Tag Name: <input type="text" name="tagname" value="<?=$tagname?>"/> <input type="submit" name="changename" value="Change Name"/><br />
<?php
	if($haswarning)
	{

?>
Warning Text: <input style="width: 600px" type="text" name="tagwarning" value="<?=$warningtext?>"/> <input type="submit" name="changewarning" value="Change Warning"/> <input type="submit" name="removewarning" value="Remove Warning"/><br />
<?php
	} else {
?>
<input type="submit" name="addwarning" value="Add Warning Text"/><br />
<?php
	}
?>
<input type="submit" name="delete" value="Delete Tag"/>
<input type="hidden" name="tagid" value="<?=$tagid?>"/>
</form>
</div>
<?php
}

?>

<div style="border:5px; background-color: #EEE">
<h3><a href="<?=$action?>&createdefault">Create Default Tags</a></h3>
Create a set of default tags, if they do not already exist.
</div>


<div style="border:5px; background-color: #EEE">
<h3>Create new Tag</h3>
<form action="<?=$action?>" method="post">
Tag Name: <input type="text" name="tagname" value=""/><br />
<input type="submit" name="create" value="Create Tag"/>
</form>
</div>

</body></html>