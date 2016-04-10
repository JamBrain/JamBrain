<?php
	// NOTE: use 'del' style to cross out rounds that have ended //
	// NOTE: be sure to hidden/un-hidden the "sorted by popularity" text when you score a round //

function ShowVoting( $logged_in ) {
	//if ( $GLOBALS['EVENT_MODE_DIFF'] > 0 ) 
	{	// Confirm the round is still on
?>
	<div class="action" id="action-vote">
		<div id="vote-tab-0" class="tab big" onclick="vote_ShowPage(0);">Round 1</div>
		<div id="vote-tab-1" class="tab big" onclick="vote_ShowPage(1);">Round 2</div>
		<div id="vote-tab-2" class="tab big" onclick="vote_ShowPage(2);">Round 3</div>
		<div id="vote-tab-3" class="tab big" onclick="vote_ShowPage(3);">Round 4</div>
		
		<div id="vote-page-0" class="page hidden">
			<div id="vote-page-when-0" class="title"></div>
			<div class="info bold hidden">Sorted by popularity.</div>
			<div id="vote-page-list-0" class="list"></div>
		</div>
		<div id="vote-page-1" class="page hidden">
			<div id="vote-page-when-1" class="title"></div>
			<div class="info bold hidden">Sorted by popularity.</div>
			<div id="vote-page-list-1" class="list"></div>
		</div>
		<div id="vote-page-2" class="page hidden">
			<div id="vote-page-when-2" class="title"></div>
			<div class="info bold hidden">Sorted by popularity.</div>
			<div id="vote-page-list-2" class="list"></div>
		</div>
		<div id="vote-page-3" class="page hidden">
			<div id="vote-page-when-3" class="title"></div>
			<div class="info bold hidden">Sorted by popularity.</div>
			<div id="vote-page-list-3" class="list"></div>
		</div>
	</div>
	<div class="tip"><strong>NOTE:</strong> Votes are sent automatically. When the color changes, they've been accepted.</div>
	<div class="tip hidden"><strong>TIP:</strong> You can use the arrow keys and space bar to vote using the keyboard.</div>
	<script>
		var VoteRoundStart = [
			<?=$GLOBALS['THEME_VOTE_START_DIFF'][0]?>,
			<?=$GLOBALS['THEME_VOTE_START_DIFF'][1]?>,
			<?=$GLOBALS['THEME_VOTE_START_DIFF'][2]?>,
			<?=$GLOBALS['THEME_VOTE_START_DIFF'][3]?>,
		];
		var VoteRoundEnd = [
			<?=$GLOBALS['THEME_VOTE_END_DIFF'][0]?>,
			<?=$GLOBALS['THEME_VOTE_END_DIFF'][1]?>,
			<?=$GLOBALS['THEME_VOTE_END_DIFF'][2]?>,
			<?=$GLOBALS['THEME_VOTE_END_DIFF'][3]?>,
		];

		function vote_AddItem(page,id,text,data) {
			id = Number(id);
			
			var node = document.createElement('div');
			node.setAttribute("class",'item');
			node.setAttribute("id","vote-item-"+id);
			node.setAttribute("raw_id",""+id);
			node.setAttribute("raw_value",text);

			<?php
			if ( $logged_in ) {
			?>
				if ( VoteRoundEnd[page] > 0 ) {
					node.innerHTML = 
						"<span>"+
							"<button class='middle button small yes_button' onclick='vote_SetVote("+id+",1);'>✓</button>"+
							"<button class='middle button small dunno_button' onclick='vote_SetVote("+id+",0);'>?</button>"+
							"<button class='middle button small no_button' onclick='vote_SetVote("+id+",-1);'>✕</button>"+
						"</span>"+
						"<span class='middle label normal'>"+text+"</span>"+
						"<sup class='hidden' id='vote-item-sup-"+id+"'></sup>"+
						"<span class='middle small myidea hidden' id='vote-myidea-"+id+"'>MY IDEA</span>";
				}
				else {
					node.innerHTML = 
						"<span class='middle label normal'>"+text+"</span>"+
						"<sup class='hidden' id='vote-item-sup-"+id+"'></sup>";
//					if ( data && data['score'] !== null ) {
//						node.innerHTML +=
//							"<span class='right'>"+data['score']+"</span>";
//					}
				}
			<?php
			}
			else {
			?>
				node.innerHTML = 
					"<span class='middle label normal'>"+text+"</span>";
			<?php
			}
			?>
			
			document.getElementById('vote-page-list-'+page).appendChild( node );
		}
		
		function vote_UpdateVote(id,value) {
			dom_ToggleClass('vote-item-'+id,'green_selected',false);
			dom_ToggleClass('vote-item-'+id,'yellow_selected',false);
			dom_ToggleClass('vote-item-'+id,'red_selected',false);
			if (value === 1) {
				dom_ToggleClass('vote-item-'+id,'green_selected',true);
			}
			else if (value === 0) {
				dom_ToggleClass('vote-item-'+id,'yellow_selected',true);
			}
			else if (value === -1) {
				dom_ToggleClass('vote-item-'+id,'red_selected',true);
			}
		}
		
		
		var _VOTE_ACTIVE = false;
		function vote_ReactivateVote(delay) {
			window.setTimeout(
				function(){
					_VOTE_ACTIVE = false;
				},
				delay?delay:300
			);
		}
		
		function vote_SetVote(id,value) {
			if ( _VOTE_ACTIVE )
				return;
			_VOTE_ACTIVE = true;
			
			xhr_PostJSON(
				"/api-theme.php",
				serialize({"action":"VOTE",'id':id,'value':value}),
				// On success //
				function(response,code) {
					console.log("VOTE:",response);
					
					// Success //
					if ( response.id > 0 ) {
						vote_UpdateVote(id,value);
					}
					else if ( response.id !== 0 ) {
						dialog_Alert("Unable to Vote","Try refreshing your browser");
					}
				}
			);
			vote_ReactivateVote();
		}
		
		xhr_PostJSON(
			"/api-theme.php",
			serialize({"action":"GET_VOTING_LIST"}),
			// On success //
			function(response,code) {
				console.log("GET_VOTING_LIST:",response);
				
				// Populate Choices //
				for( var idx = 0; idx < response.themes.length; idx++ ) {
					var Theme = response.themes[idx];
					
					if ( VoteRoundEnd[Theme.page] <= 0 ) {
						vote_AddItem(Theme.page,Theme.id,Theme.theme,
							Theme.data ? Theme.data : null
						);
					}
					else if ( VoteRoundStart[Theme.page] <= 0 ) {
						vote_AddItem(Theme.page,Theme.id,Theme.theme);
					}
				}
				
				// Mark which choices were prior themes //
				theme_GetHistory(function(HashTable) {
					//console.log("Theme Hashes:",HashTable);
					
					var item = document.getElementsByClassName("item");
					
					for ( var idx = 0; idx < item.length; idx++ ) {
						var Hash = theme_MakeHash(""+item[idx].attributes.raw_value.value);
						//console.log(idx,item[idx].attributes,Hash);
						if ( HashTable[Hash] ) {
							//var el = document.getElementById("vote-item-sup-"+item[idx].attributes.raw_id.value);
							var el = "vote-item-sup-"+item[idx].attributes.raw_id.value;
							dom_RemoveClass(el,"hidden");
							dom_SetAttribute(el,"title","This theme was previously used by "+HashTable[Hash].name);
							dom_SetText(el,HashTable[Hash].shorthand);
							//console.log(idx, item[idx].attributes.raw_id, item[idx].attributes.raw_value);
						}
					}
				});
				
				// Update Choices with my selections //
				xhr_PostJSON(
					"/api-theme.php",
					serialize({"action":"GETVOTES"}),
					// On success //
					function(response,code) {
						console.log("GETVOTES:",response);
						
						// Determine success //
						if ( response.votes ) {
							// Refresh Display //
							for ( var idx = 0; idx < response.votes.length; idx++ ) {
								var Vote = response.votes[idx];
								vote_UpdateVote(Vote.id,Vote.value);
							}
						}
					}
				);
				
			}
		);		
		
		function UpdateVoteRoundClocks() {
			var LocalTimeDiff = Date.now() - _LOCAL_TIME;
			
			for ( var idx = 0; idx < 4; idx++ ) {
				var StartDiff = VoteRoundStart[idx] - Math.ceil(LocalTimeDiff*0.001);
				var EndDiff = VoteRoundEnd[idx] - Math.ceil(LocalTimeDiff*0.001);
				
				if ( StartDiff > 0 ) {
					dom_SetText('vote-page-when-'+idx,"Voting starts in "+getCountdownInWeeks(StartDiff,3,true));
				}
				else if ( EndDiff > 0 ) {
					dom_SetText('vote-page-when-'+idx,"Voting ends in "+getCountdownInWeeks(EndDiff,3,true));
				}
				else {
					dom_SetText('vote-page-when-'+idx,"This voting round has ended.");
				}
			}
			
			time_CallNextSecond(UpdateVoteRoundClocks);
		}
		UpdateVoteRoundClocks();

		var DefaultPage = <?=$GLOBALS['EVENT_VOTE_ACTIVE'];?>;
		var ActivePage = -1;
		function vote_ShowPage(num,keep_history) {
			//console.log(ActivePage,num);
			if ( ActivePage === Number(num) ) {
				return;
			}
			
			if ( ActivePage >= 0 ) {
				dom_ToggleClass("vote-page-"+ActivePage,"hidden",true);
				dom_ToggleClass("vote-tab-"+ActivePage,"active",false);
			}
			
			ActivePage = Number(num);
			
			dom_ToggleClass("vote-page-"+ActivePage,"hidden",false);
			dom_ToggleClass("vote-tab-"+ActivePage,"active",true);
			
			if ( !keep_history ) {
				window.history.replaceState({},null,"?<?=isset($GLOBALS['DO_BETA'])?'beta&':''?>page="+(ActivePage+1));
			}
		}
		vote_ShowPage(DefaultPage,true);
	</script>
<?php
	}
}
function ShowFinalVoting( $logged_in ) {
	if ( $GLOBALS['EVENT_MODE_DIFF'] > 0 ) {	// Confirm the round is still on
?>
	<div class="action" id="action-fvote">
		<div id="fvote-page" class="page">
			<div id="fvote-page-when" class="title"></div>
			<div id="fvote-page-list" class="list"></div>
		</div>
	</div>
	<script>
		var VoteRoundStart = <?=$GLOBALS['FINAL_VOTE_START_DIFF']?>;
		var VoteRoundEnd = <?=$GLOBALS['FINAL_VOTE_END_DIFF']?>;

		function fvote_AddItem(page,id,text,data) {
			id = Number(id);
			
			var node = document.createElement('div');
			node.setAttribute("class",'item');
			node.setAttribute("id","fvote-item-"+id);

			<?php
			if ( $logged_in ) {
			?>
				if ( VoteRoundEnd > 0 ) {
					node.innerHTML = 
						"<span>"+
							"<button class='middle button small yes_button' onclick='fvote_SetVote("+id+",1);'>✓</button>"+
							"<button class='middle button small dunno_button' onclick='fvote_SetVote("+id+",0);'>?</button>"+
							"<button class='middle button small no_button' onclick='fvote_SetVote("+id+",-1);'>✕</button>"+
						"</span>"+
						"<span class='middle label normal'>"+text+"</span>"+
						"<span class='middle small myidea hidden' id='fvote-myidea-"+id+"'>MY IDEA</span>";
				}
				else {
					node.innerHTML = 
						"<span class='middle label normal'>"+text+"</span>";
//					if ( data && data['score'] !== null ) {
//						node.innerHTML +=
//							"<span class='right'>"+data['score']+"</span>";
//					}
				}
			<?php
			}
			else {
			?>
				node.innerHTML = 
					"<span class='middle label normal'>"+text+"</span>";
			<?php
			}
			?>
			
			document.getElementById('fvote-page-list').appendChild( node );
		}
		
		function fvote_UpdateVote(id,value) {
			dom_ToggleClass('fvote-item-'+id,'green_selected',false);
			dom_ToggleClass('fvote-item-'+id,'yellow_selected',false);
			dom_ToggleClass('fvote-item-'+id,'red_selected',false);
			if (value === 1) {
				dom_ToggleClass('fvote-item-'+id,'green_selected',true);
			}
			else if (value === 0) {
				dom_ToggleClass('fvote-item-'+id,'yellow_selected',true);
			}
			else if (value === -1) {
				dom_ToggleClass('fvote-item-'+id,'red_selected',true);
			}
		}
		
		
		var _VOTE_ACTIVE = false;
		function fvote_ReactivateVote(delay) {
			window.setTimeout(
				function(){
					_VOTE_ACTIVE = false;
				},
				delay?delay:300
			);
		}
		
		function fvote_SetVote(id,value) {
			if ( _VOTE_ACTIVE )
				return;
			_VOTE_ACTIVE = true;
			
			xhr_PostJSON(
				"/api-theme.php",
				serialize({"action":"FVOTE",'id':id,'value':value}),
				// On success //
				function(response,code) {
					console.log("FVOTE:",response);
					
					// Success //
					if ( response.id > 0 ) {
						fvote_UpdateVote(id,value);
					}
					else if ( response.id !== 0 ) {
						dialog_Alert("Unable to Vote","Try refreshing your browser");
					}
				}
			);
			fvote_ReactivateVote();
		}
		
		xhr_PostJSON(
			"/api-theme.php",
			serialize({"action":"GET_FVOTING_LIST"}),
			// On success //
			function(response,code) {
				console.log("GET_FVOTING_LIST:",response);
				
				// Populate Choices //
				for( var idx = 0; idx < response.themes.length; idx++ ) {
					var Theme = response.themes[idx];
					
					if ( VoteRoundEnd <= 0 ) {
						fvote_AddItem(Theme.page,Theme.id,Theme.theme,
							Theme.data ? Theme.data : null
						);
					}
					else if ( VoteRoundStart <= 0 ) {
						fvote_AddItem(Theme.page,Theme.id,Theme.theme);
					}
				}
				
				// Update Choices with my selections //
				xhr_PostJSON(
					"/api-theme.php",
					serialize({"action":"GETFVOTES"}),
					// On success //
					function(response,code) {
						console.log("GETFVOTES:",response);
						
						// Determine success //
						if ( response.votes ) {
							// Refresh Display //
							for ( var idx = 0; idx < response.votes.length; idx++ ) {
								var Vote = response.votes[idx];
								fvote_UpdateVote(Vote.id,Vote.value);
							}
						}
					}
				);
				
			}
		);
		
		function fvote_UpdateRoundClocks() {
			var LocalTimeDiff = Date.now() - _LOCAL_TIME;
			
			var StartDiff = VoteRoundStart - Math.ceil(LocalTimeDiff*0.001);
			var EndDiff = VoteRoundEnd - Math.ceil(LocalTimeDiff*0.001);
			
			if ( StartDiff > 0 ) {
				dom_SetText('fvote-page-when',"Voting starts in "+getCountdownInWeeks(StartDiff,3,true));
			}
			else if ( EndDiff > 0 ) {
				dom_SetText('fvote-page-when',"Voting ends in "+getCountdownInWeeks(EndDiff,3,true));
			}
			else {
				dom_SetText('fvote-page-when',"This voting round has ended.");
			}
			
			time_CallNextSecond(fvote_UpdateRoundClocks);
		}
		fvote_UpdateRoundClocks();
	</script>
<?php
	}
}
