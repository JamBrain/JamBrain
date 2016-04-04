<?php

function ShowSlaughter( $logged_in ) {
	if ( $logged_in && $GLOBALS['EVENT_MODE_DIFF'] > 0 ) {	// Confirm the round is still on
?>
	<div class="action" id="action-kill">
		<div class="title big">Would this be a good Theme?</div>
		<div class="kill-group" id="kill-theme-border" onclick="OpenLink()" title="Click to search Google for this">
			<div class="bigger" id="kill-theme">?</div>
		</div>
		<div class="kill-buttons">
			<button id="kill-good" class="middle big green_button" onclick='kill_VoteIdea(1)' title='Good'>YES ✓</button>
			<button id="kill-bad" class="middle big red_button" onclick='kill_VoteIdea(0)' title='Bad'>NO ✕</button>
			<button id="kill-cancel" class="middle normal edit-only-inline" onclick='kill_CancelEditTheme()' title='Cancel Edit'>Cancel</button>
			
			<div class="title">If inappropriate or offensive, <a href="javascript:void(0)" onclick='kill_FlagIdea()'>click here to Flag ⚑</a></div>

			<?php /*<div id="kill-star" class="bigger" onclick='' title='Star It'>★</div>*/ ?>
			<?php /*<div id="kill-love" class="bigger" onclick='' title='Love It'>❤</div>*/ ?>
		</div>
		
		<div class="action" id="action-recent">
			<div class="title big">Recent Themes</div>
			<div class="" id="kill"></div>
		</div>
		
		<script>
			function OpenLink() {
				window.open("http://google.com/search?q="+escapeAttributeGoogle(dom_GetText('kill-theme')));
			}
			
			function SetSlaughterTheme(value) {
				dom_SetText('kill-theme',value);
			}
			
			var _LAST_SLAUGHTER_RESPONSE = null;
			function GetSlaughterTheme(accent) {
				xhr_GetJSON(
					"/api-theme.php?action=RANDOM&debug",
					// On success //
					function(response,code) {
						_LAST_SLAUGHTER_RESPONSE = response;
						SetSlaughterTheme(response.theme);
						if ( accent )
							dom_RestartAnimation('kill-theme','effect-accent');
					}
				);
			}
			GetSlaughterTheme(); // Call it!! //
			
			var _SELECTED_SLAUGHTER_THEME = null;
			function kill_EditTheme(Id,Theme) {
				if ( _SELECTED_SLAUGHTER_THEME === Id ) {
					kill_CancelEditTheme();
					return;
				}
				
				dom_ToggleClass('action-kill','edit',true);
				SetSlaughterTheme(Theme);
				
				if ( _SELECTED_SLAUGHTER_THEME ) {
					dom_ToggleClass("kill-item-"+_SELECTED_SLAUGHTER_THEME,'selected',false);
				}
				_SELECTED_SLAUGHTER_THEME = Id;
				dom_ToggleClass("kill-item-"+_SELECTED_SLAUGHTER_THEME,'selected',true);
			}
			function kill_CancelEditTheme() {
				dom_ToggleClass('action-kill','edit',false);
				SetSlaughterTheme(_LAST_SLAUGHTER_RESPONSE.theme);
				
				if ( _SELECTED_SLAUGHTER_THEME ) {
					dom_ToggleClass("kill-item-"+_SELECTED_SLAUGHTER_THEME,'selected',false);
				}
				_SELECTED_SLAUGHTER_THEME = null;
			}

			function kill_AddRecentTheme( Id, Idea, value, accent ) {
				var Theme = escapeString(Idea);
				var ThemeAttr = escapeAttribute(Idea);

				var kill_root = document.getElementById('kill');
				
				var node = document.createElement('div');
				node.setAttribute("class",'kill-item item'+((accent===true)?" effect-accent":""));
				node.setAttribute("id","kill-item-"+Id);
				node.addEventListener('click',function(){
					kill_EditTheme(Id,Idea);
				});

//				node.innerHTML = 
//					"<div class='sg-item-x' onclick='kill_RemoveTheme("+Id+",\""+(ThemeAttr)+"\")'>❤</div>";
				switch( value ) {
				case 1:
					node.innerHTML += "<div class='item-left item-good' title='Good'>✓</div>";
					break;
				case 0:
					node.innerHTML += "<div class='item-left item-bad' title='Bad'>✕</div>";
					break;
				case -1:
					node.innerHTML += "<div class='item-left item-flag' title='Flag'>⚑</div>";
					break;
				};
				node.innerHTML +=
					"<div class='kill-item-text item-text' theme_id="+Id+" title='"+(Theme)+"'>"+(Theme)+"</div>";
				
				kill_root.insertBefore( node, kill_root.childNodes[0] );
			}
			function kill_RemoveRecentTheme(id) {
				document.getElementById('kill-item-'+id).remove();
			}
			function kill_RemoveRecentThemes() {
				var Themes = document.getElementsByClassName('kill-item');
				//console.log(Themes);
				
				for ( var idx = 10; idx < Themes.length; idx++ ) {
					Themes[idx].remove();
				}
			}
			
			var _SLAUGHTER_VOTE_ACTIVE = false;
			function kill_ReactivateVote(delay) {
				window.setTimeout(
					function(){
						_SLAUGHTER_VOTE_ACTIVE = false;
					},
					delay?delay:300
				);
			}
			function kill_VoteIdea(Value) {
				if ( _SLAUGHTER_VOTE_ACTIVE )
					return;
				_SLAUGHTER_VOTE_ACTIVE = true;
				
				// Edit Mode //
				if ( _SELECTED_SLAUGHTER_THEME ) {
					var Id = _SELECTED_SLAUGHTER_THEME;
					var Idea = dom_GetText('kill-theme');
					Value = Number(Value);
					
					xhr_PostJSON(
						"/api-theme.php?debug",
						serialize({"action":"IDEA","id":Id,"value":Value}),
						// On success //
						function(response,code) {
							console.log("IDEA*:",response);
							
							if ( response.id > 0 ) {
								kill_RemoveRecentTheme(Id);
								kill_AddRecentTheme(Id,Idea,Value,true);
								kill_RemoveRecentThemes();
	
								kill_CancelEditTheme();
	
								dom_RestartAnimation('kill-theme','effect-accent');
							}
							else {
								dialog_Alert("Unable to Edit vote","Try refreshing your browser");
							}
							
							kill_ReactivateVote();
						}
					);
				}
				else {
					var Id = _LAST_SLAUGHTER_RESPONSE.id;
					var Idea = _LAST_SLAUGHTER_RESPONSE.theme;
					Value = Number(Value);
	
					xhr_PostJSON(
						"/api-theme.php?debug",
						serialize({"action":"IDEA","id":Id,"value":Value}),
						// On success //
						function(response,code) {
							// TODO: Respond to errors //
	
							if ( response.id > 0 ) {
								console.log("IDEA:",response);
								kill_AddRecentTheme(Id,Idea,Value,true);
								kill_RemoveRecentThemes();
								
								GetSlaughterTheme(true);
							}
							else {
								dialog_Alert("Unable to Submit vote","Try refreshing your browser");
							}
							
							kill_ReactivateVote();
						}
					);
				}
			}
			function kill_FlagIdea() {
				if ( _SLAUGHTER_VOTE_ACTIVE )
					return;
				_SLAUGHTER_VOTE_ACTIVE = true;

				// Edit Mode //
				if ( _SELECTED_SLAUGHTER_THEME ) {
					var Id = _SELECTED_SLAUGHTER_THEME;
					var Idea = dom_GetText('kill-theme');
					var Value = -1;
					
					dialog_ConfirmAlert(Idea,"Are you sure you want to Flag this as inappropriate?",function(){
						xhr_PostJSON(
							"/api-theme.php?debug",
							serialize({"action":"IDEA","id":Id,"value":Value}),
							// On success //
							function(response,code) {
								console.log("IDEA*:",response);

								if ( response.id > 0 ) {
									kill_RemoveRecentTheme(Id);
									kill_AddRecentTheme(Id,Idea,Value,true);
									kill_RemoveRecentThemes();
	
									kill_CancelEditTheme();
									dom_RestartAnimation('kill-theme','effect-accent');
								}
								else {
									dialog_Alert("Unable to Edit vote","Try refreshing your browser");
								}
							}
						);
					});
					kill_ReactivateVote(1000);
				}
				else {
					var Id = _LAST_SLAUGHTER_RESPONSE.id;
					var Idea = _LAST_SLAUGHTER_RESPONSE.theme;
					var Value = -1;
	
					dialog_ConfirmAlert(Idea,"Are you sure you want to Flag this as inappropriate?",function(){
						xhr_PostJSON(
							"/api-theme.php?debug",
							serialize({"action":"IDEA","id":Id,"value":Value}),
							// On success //
							function(response,code) {
								console.log("IDEA:",response);

								if ( response.id > 0 ) {
									kill_AddRecentTheme(Id,Idea,Value,true);
									kill_RemoveRecentThemes();
									
									GetSlaughterTheme(true);
								}
								else {
									dialog_Alert("Unable to Submit vote","Try refreshing your browser");
								}
							}
						);
					});
					kill_ReactivateVote(1000);
				}
			}
			
			function kill_GetRecentVotes() {
				xhr_PostJSON(
					"/api-theme.php?debug",
					serialize({"action":"GETIDEAS"}),
					// On success //
					function(response,code) {
						console.log("GETIDEAS:",response);

						if ( response.ideas ) {
							for ( var idx = response.ideas.length-1; idx >= 0; idx-- ) {
								var idea = response.ideas[idx];
								kill_AddRecentTheme(idea.id,idea.idea,idea.value);
							}
						}
						else {
							// Unable to get your ideas //
						}
					}
				);
			}
			kill_GetRecentVotes();
		</script>
	</div>
<?php 
	}
}
