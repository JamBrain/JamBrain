<?php



function ShowAdmin() {
	$all_themes = theme_GetIdeas($EVENT_NODE);
	
	$byid_themes = [];

	foreach($all_themes as &$theme) {
		$byid_themes[$theme['id']] = &$theme;
	}
	
	
	// Generate Slugs //
	foreach($all_themes as &$theme) {
		$theme['slug'] = sanitize_Slug($theme['theme']);
	}
	
	// Sort by Slugs+Parent+Id //
	$sorted_themes = [];
	foreach($all_themes as &$theme) {
		$sort_slug = ($theme['parent']>0 ? $byid_themes[$theme['parent']]['slug']:$theme['slug']).(($theme['parent']>0)?str_pad($theme['parent'],8,"0",STR_PAD_LEFT)."-":"").str_pad($theme['id'],8,"0",STR_PAD_LEFT);
		$sorted_themes[$sort_slug] = &$theme;
		$theme['sort_slug'] = $sort_slug;
	}
	ksort($sorted_themes);		
	
	echo "<div id='admin-list'>";
	foreach($sorted_themes as &$theme) {
		$style = "text-align:left;";
		if ( $theme['parent'] )
			$style .= "margin-left:1em;background:#FEA;";

		?>
			<div class='item admin-item' style='<?=$style?>' id='admin-item-<?=$theme['id']?>' title='<?=$theme['sort_slug']?>'>
				<input class='item-check' type="checkbox" id='admin-item-<?=$theme['id']?>' number='<?=$theme['id']?>' onclick="admin_OnCheck()">
					<?=$theme['theme']?>
					<div class="right">(<span><?=$theme['id']?></span>, <span><?=$theme['parent']?></span>)</div>
					<div class="right" onclick="admin_MakeParent(<?=$theme['id']?>)">[Make Parent] &nbsp; </div>
					<div class="right" onclick="admin_DoStrike()">[STRIKE] &nbsp; </div>
				</input>
			</div>
		<?php
	}
	echo "</div>";
	
	?>
	<div style="background:#0BE;position:fixed;bottom:0;right:0;padding:1em;">
		Selected: <span id="admin-selected">0</span> | <span onclick="admin_Deselect()">Deselect All</a>
	</div>
	
	<script>
		function admin_OnCheck() {
			admin_UpdateSelected();
		}
		
		function admin_UpdateSelected() {
			dom_SetText('admin-selected',admin_CountSelected());
		}
		
		function admin_Deselect() {
			el = document.getElementsByClassName("item-check");
			for ( var idx = 0; idx < el.length; idx++ ) {
				el[idx].checked = false;
			}
			admin_UpdateSelected();
		}
		
		function admin_GetSelected() {
			el = document.getElementsByClassName("item-check");
			var Selected = [];
			for ( var idx = 0; idx < el.length; idx++ ) {
				if ( el[idx].checked )
					Selected.push( el[idx] );
			}
			return Selected;
		}
		function admin_CountSelected() {
			el = document.getElementsByClassName("item-check");
			var Count = 0;
			for ( var idx = 0; idx < el.length; idx++ ) {
				if ( el[idx].checked )
					Count++;
			}
			return Count;
		}
		
		function admin_MakeParent(Id) {
			var Selected = admin_GetSelected();
			
			if ( Selected.length === 0 )
				return;
			
			var Ids = [];
			for (var idx = 0; idx < Selected.length; idx++ ) {
				//Ids.push( Number(Selected[idx].id.substring(11)) );
				Ids.push( Number(Selected[idx].getAttribute('number')) );
			}
			
			//console.log(Id,Ids);
			
			//console.log( admin_GetSelected() );
			
			xhr_PostJSON(
				"/api-theme.php",
				serialize({"action":"SETPARENT","parent":Id,"children":Ids}),
				// On success //
				function(response,code) {
					// TODO: Respond to errors //
					console.log("SETPARENT:",response);
					admin_Deselect();
				}
			);
		}
		
		function admin_DoStrike() {
			var Idea = "blah";
			dialog_ConfirmAlert(Idea,"Are you sure you want to remove this, and give user a strike?",function(){
//								xhr_PostJSON(
//									"/api-theme.php",
//									serialize({"action":"IDEA","id":Id,"value":Value}),
//									// On success //
//									function(response,code) {
//										// TODO: Respond to errors //
//										console.log("IDEA*:",response);
//		
//										kill_RemoveRecentTheme(Id);
//										kill_AddRecentTheme(Id,Idea,Value,true);
//		
//										kill_CancelEditTheme();
//										dom_RestartAnimation('kill-theme','effect-accent');
//									}
//								);
			});						
		}
	</script>
<?php
}
