<?php
require_once __DIR__."/../web.php";
require_once __DIR__."/../core/config.php";
require_once __DIR__."/../legacy-config.php";
require_once __DIR__."/../core/legacy_user.php";

require_once __DIR__."/../core/theme.php";
require_once __DIR__."/../core/internal/sanitize.php";

config_Load();

$EVENT_NAME = "Ludum Dare 34";
$EVENT_MODE = 2;
$EVENT_NODE = 100;
$EVENT_DATE = new DateTime("2015-12-12T02:00:00Z");

if ( isset($_GET['beta']) ) {
	$EVENT_MODE = 3;
	$CONFIG['theme-alert'] = '<b>BETA TEST</b> • Vote data will be <b>DELETED</b> • Report bugs <a href="http://ludumdare.com/compo/">HERE</a>';
}

define('HTML_TITLE',$EVENT_NAME." - Theme Hub");
const HTML_CSS_INCLUDE = [ "/style/theme-hub.css.php" ];
const HTML_USE_CORE = true;
const HTML_SHOW_FOOTER = true;
const HTML_USE_GOOGLE = true;

// Extract Id from Cookie
if ( isset($_COOKIE['lusha']) ) {
	$cookie_id = legacy_GetUserFromCookie();	
}
else {
	$cookie_id = 0;
}

$admin = false;
if ( isset($_GET['admin']) ) {
	if ( defined('LEGACY_DEBUG') || $cookie_id === 19 ) {
		$admin = true;
	}
}

// ** Modes ** //
const THEME_MODE_NAMES = [
	"Inactive",						// no event scheduled
	"Theme Suggestion Round",		// weeks -5 to -2 (AKA: Ideas)
	"Theme Slaughter Round",		// weeks -2 to -1
	"Theme Voting Round",			// week -1 to day -2
	"Final Round Theme Voting",		// day -2 to start -30 minutes
	"Theme Announcement",			// start
	"Coming Soon"					// week +3 (next event scheduled)
];

const THEME_MODE_SHORTNAMES = [
	"Inactive",
	"Suggestion",
	"Slaughter",
	"Voting",
	"Final Voting",
	"Announcement",
	"Coming Soon"
];

// HACK, don't hardcode me! //
const THEME_MODE_TIMES = [
	0,
	(2*7*24*60*60) - ((24+21)*60*60),
	(1*7*24*60*60) - (18*60*60),
	(2*24*60*60),
	(30*60),
	0,
	0,
];

const THEME_MODE_SHOW_TIMES = [
	false,
	true,
	true,
	true,
	true,
	false,
	false,
];

const THEME_VOTE_START_TIMES = [
	(5*24*60*60) - (12*60*60),
	(5*24*60*60) - (24*60*60),
	(4*24*60*60) - (12*60*60),
	(4*24*60*60) - (24*60*60),
];

const THEME_VOTE_END_TIMES = [
	(4*24*60*60) - (18*60*60),
	(4*24*60*60) - (24*60*60),
	(3*24*60*60) - (12*60*60),
	(3*24*60*60) - (24*60*60),
];

$THEME_VOTE_START_DATE = [];
$THEME_VOTE_START_DIFF = [];
$THEME_VOTE_END_DATE = [];
$THEME_VOTE_END_DIFF = [];


// Date Hack //
$EVENT_MODE_DATE = $EVENT_DATE->getTimestamp() - THEME_MODE_TIMES[$EVENT_MODE];
$EVENT_MODE_DIFF = $EVENT_MODE_DATE - time();

$EVENT_VOTE_ACTIVE = 3;
for( $idx = 0; $idx < count(THEME_VOTE_START_TIMES); $idx++ ) {
	$THEME_VOTE_START_DATE[$idx] = $EVENT_DATE->getTimestamp() - THEME_VOTE_START_TIMES[$idx];
	$THEME_VOTE_START_DIFF[$idx] = $THEME_VOTE_START_DATE[$idx] - time();
	$THEME_VOTE_END_DATE[$idx] = $EVENT_DATE->getTimestamp() - THEME_VOTE_END_TIMES[$idx];
	$THEME_VOTE_END_DIFF[$idx] = $THEME_VOTE_END_DATE[$idx] - time();
	
	if ( $THEME_VOTE_START_DIFF[$idx] <= 0 ) {
		$EVENT_VOTE_ACTIVE = $idx;
	}
}

function ShowHeader() {
	global $EVENT_NAME, $EVENT_MODE, $EVENT_DATE;
	if ( isset($EVENT_NAME) ) {
		echo "<div class='event bigger big-space'>Event: <strong class='caps inv' id='event-name'>".$EVENT_NAME."</strong></div>";

		echo "<div class='mode small caps'>";
		$theme_mode_count = count(THEME_MODE_SHORTNAMES);
		for ( $idx = 1; $idx < $theme_mode_count-1; $idx++ ) {
			if ($idx !== 1)
				echo " | ";
			if ($idx === $EVENT_MODE)
				echo "<strong>".strtoupper(THEME_MODE_SHORTNAMES[$idx])."</strong>";
			else
				echo strtoupper(THEME_MODE_SHORTNAMES[$idx]);
		}
		echo "</div>";
		
		echo "<div class='date normal inv caps' id='event-date' title=\"".$EVENT_DATE->format("G:i")." on ".$EVENT_DATE->format("l F jS, Y ")."(UTC)\">Starts at ".
			"<strong id='ev-time' original='".$EVENT_DATE->format("G:i")."'></strong> on ".
			"<span id='ev-day' original='".$EVENT_DATE->format("l")."'></span> ".
			"<strong id='ev-date' original='".$EVENT_DATE->format("F jS, Y")."'></strong> ".
			"(<span id='ev-zone' original='UTC'></span>)</strong></div>";
?>
		<script>
			var EventDate = new Date("<?=$EVENT_DATE->format(DateTime::W3C)?>");

			dom_SetText( 'ev-time', getLocaleTime(EventDate) );
			dom_SetText( 'ev-day', getLocaleDay(EventDate) );
			dom_SetText( 'ev-date', getLocaleDate(EventDate) );
			dom_SetText( 'ev-zone', getLocaleTimeZone(EventDate) );
		</script>
<?php
	}
}

function ShowHeadline() {
	global $EVENT_MODE;

	$UTCDate = date(DATE_RFC850,$GLOBALS['EVENT_MODE_DATE']);
?>
	<div class='headline'>
		<div class='title bigger caps space inv soft-shadow'><strong><?=THEME_MODE_NAMES[$EVENT_MODE]?></strong></div>
<?php
	if ( THEME_MODE_SHOW_TIMES[$EVENT_MODE] ) {
?>
		<div class='clock' id='headline-clock'>Round ends in <span id='headline-time' title="<?=$UTCDate?>"></span></div>
		<script>
			var _SERVER_TIME_DIFF = <?=$GLOBALS['EVENT_MODE_DIFF']?>;
			var _LOCAL_TIME = Date.now();
			
			function UpdateRoundClock() {
				var LocalTimeDiff = Date.now() - _LOCAL_TIME;
				var TotalTimeDiff = _SERVER_TIME_DIFF - Math.ceil(LocalTimeDiff*0.001);
				if (TotalTimeDiff > 0) {
					dom_SetText('headline-time',getCountdownInWeeks(TotalTimeDiff,3,true));
					if ( TotalTimeDiff <= (24*60*60) )
						time_CallNextSecond(UpdateRoundClock);
					else
						time_CallNextMinute(UpdateRoundClock);
				}
				else {
					dom_SetText('headline-clock',"Round has ended. The next Round will begin soon.");
				}
			}
			UpdateRoundClock();
		</script>
<?php
	}
?>
	</div>
<?php
}

function ShowLogin() {
	$LOGIN_URL = LEGACY_LOGIN_URL;
	if ( isset($_GET['beta']) ) {
		if ( strpos($LOGIN_URL,"?") === false )
			$LOGIN_URL .= "?beta";
		else
			$LOGIN_URL .= "&beta";
	}
?>
	<div class="action" id="action-login">
		<a class="no-style" href="<?=$LOGIN_URL?>"><button type="button" class="login-button">Login</button></a>
	</div>	
<?php
}
function ShowLogout() {
?>
	<div class="action" id="action-logout">
		<button type="button" class="login-button" onclick="DoLogout(true)">Logout</button>
	</div>	
<?php
}
function ShowInactive() { ?>
	<div class='headline no-margin'>
		<div class="title bigger"><strong>BE RIGHT BACK!</strong></div>
		<div>We're just fixing things. Give us a moment. Fixy fixy!</div>
		<br />
		<div id="twitter-widget">
			<a class="twitter-timeline" data-dnt="true" href="https://twitter.com/ludumdare" data-widget-id="665760712757657600">Tweets by @ludumdare</a>
			<script>!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?'http':'https';if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src=p+"://platform.twitter.com/widgets.js";fjs.parentNode.insertBefore(js,fjs);}}(document,"script","twitter-wjs");</script>
      	</div>
	</div><?php
}


function ShowComingSoon() {
	
}
function ShowSubmitIdea() { 
	if ( $GLOBALS['EVENT_MODE_DIFF'] > 0 ) {	// Confirm the round is still on
?>
	<div class="action" id="action-idea">
		<div class="title bigger">Suggest a Theme</div>
		<div class="form">
			<input type="text" class="single-input" id="input-idea" placeholder="Your suggestion" maxlength="64" />
			<button type="button" class="submit-button" onclick="SubmitIdeaForm();">Submit</button>
		</div>
		<div class="footnote small">You have <strong><span id="sg-count">?</span></strong> suggestion(s) left</div>
		<script>
			document.getElementById("input-idea").addEventListener("keydown", function(e) {
				if (!e) { var e = window.event; }
				if (e.keyCode == 13) { /*e.preventDefault();*/ SubmitIdeaForm(); }
			}, false);
		</script>
	</div>
<?php
	}
}
function ShowStats() { 
?>
	<div class="stats" id="stats">
		<div class="title bigger caps space">Slaughter Statistics</div>
		<div>
			<div id="stats-total" class="title hidden">
				<div>Themes: <span class="bold" id="stats-total-all"></span> (<span id="stats-total-raw"></span> with duplicates)</div>
				<div>Users who Suggested Themes: <span class="bold" id="stats-users-with-ideas"></span></div>
				<div>Users who Slaughtered Themes: <span class="bold" id="stats-users-that-kill"></span></div>
			</div>
			<div id="stats-my-votes" class="hidden" style="width:300px;height:300px;display:inline-block;"></div>
			<div id="stats-votes" class="hidden" style="width:300px;height:300px;display:inline-block;"></div>
			<div id="stats-hourly" class="hidden hide-on-mobile" style="width:600px;height:300px;margin:0 auto;"></div>
			<div id="stats-total-kills" class="hidden hide-on-mobile" style="width:600px;height:300px;margin:0 auto;"></div>
		</div>
		<div class="small">Statistics updated every 10 minutes</div>
		<?php /*<div class="normal">Last Updated: <strong>blahblah</strong></div>*/ ?>		
	</div>
		
	<script>
		google.load("visualization", "1", {packages:["corechart"]});
		google.setOnLoadCallback(DrawStatsCharts);
		
		function DrawStatsCharts() {
			var NumberFormat = new google.visualization.NumberFormat(
				{groupingSymbol:',',fractionDigits:0}
			);
			var MyVotesChart_el = document.getElementById('stats-my-votes');
			var MyVotesChart = new google.visualization.PieChart(MyVotesChart_el);
			var VotesChart_el = document.getElementById('stats-votes');
			var VotesChart = new google.visualization.PieChart(VotesChart_el);
			var HourlyChart_el = document.getElementById('stats-hourly');
			var HourlyChart = new google.visualization.AreaChart(HourlyChart_el);
			var TotalKillsChart_el = document.getElementById('stats-total-kills');
			var TotalKillsChart = new google.visualization.ColumnChart(TotalKillsChart_el);
			
			var PieChartOptions = {
				'titleTextStyle': {
					'bold':false
				},
				'pieSliceTextStyle': {
					'bold':true
				},
				'backgroundColor': { fill:'transparent' },
				'chartArea': {'width':'100%', 'height':'80%'},
				'legend':'bottom',
				'fontName':'Lato',
				'fontSize':20,
				'is3D':true,
				'colors':['#6D6','#D66','666'],
			};
			
			var AreaChartOptions = {
				'titleTextStyle': {
					'bold':false
				},
				'backgroundColor': { 'fill':'transparent' },
				'chartArea': {'width':'80%', 'height':'70%','left':'18%','top':'15%'},
				'hAxis': { 'textPosition':'none' },
				'legend':'bottom',
				'fontName':'Lato',
				'fontSize':20,
				'colors':['#88F','#8F8','#F88','888'],
			};

			var BarChartOptions = {
				'titleTextStyle': {
					'bold':false
				},
				'backgroundColor': { 'fill':'transparent' },
				'chartArea': {'width':'80%', 'height':'80%','left':'18%','top':'15%'},
				'legend':'none',
				'fontName':'Lato',
				'fontSize':20,
				'vAxis': {
					'viewWindow':{
						max:50,
						min:0
					}
            	},
            	'hAxis': { 'textPosition':'none' },
			};
			
			xhr_PostJSON(
				"/api-theme.php?debug",
				serialize({"action":"GETIDEASTATS"}),
				// On success //
				function(response,code) {
					console.log("GETIDEASTATS:",response);
					
					if ( response.count ) {
						document.getElementById('stats-total-all').innerHTML = addCommas(response.count);
						document.getElementById('stats-total-raw').innerHTML = addCommas(response.count_with_duplicates);
						document.getElementById('stats-users-with-ideas').innerHTML = addCommas(response.users_with_ideas);
						document.getElementById('stats-users-that-kill').innerHTML = addCommas(response.users_that_kill);

						document.getElementById('stats-total').classList.remove('hidden');
					}
					
					if ( response.mystats ) {
						var Stats = response.mystats;
						var Options = PieChartOptions;
						var StatsSum = 0;
						var Data = new google.visualization.DataTable();
						Data.addColumn('string', 'Answer');
						Data.addColumn('number', 'Votes');
						
						if ( Stats[1] ) { StatsSum+=Stats[1];Data.addRow(['Yes',Stats[1]]); }
						if ( Stats[0] ) { StatsSum+=Stats[0];Data.addRow(['No',Stats[0]]); }
						if ( Stats[-1] ) { StatsSum+=Stats[-1];Data.addRow(['Flag',Stats[-1]]); }
						NumberFormat.format(Data,1);
						
						Options.title = 'My votes: '+addCommas(StatsSum);
						MyVotesChart_el.classList.remove('hidden');
						MyVotesChart.draw(Data,Options);
					}
	
					if ( response.stats ) {
						var Stats = response.stats;
						var Options = PieChartOptions;
						var StatsSum = 0;
						var Data = new google.visualization.DataTable();
						Data.addColumn('string', 'Answer');
						Data.addColumn('number', 'Votes');
						
						if ( Stats[1] ) { StatsSum+=Stats[1];Data.addRow(['Yes',Stats[1]]); }
						if ( Stats[0] ) { StatsSum+=Stats[0];Data.addRow(['No',Stats[0]]); }
						if ( Stats[-1] ) { StatsSum+=Stats[-1];Data.addRow(['Flag',Stats[-1]]); }
						NumberFormat.format(Data,1);
						
						Options.title = 'All votes: '+addCommas(StatsSum);
						Options.colors = ['#4C4','#C44','444'];
						VotesChart_el.classList.remove('hidden');
						VotesChart.draw(Data,Options);
					}
					
					if ( response.hourly ) {
						var Stats = response.hourly;
						var Options = AreaChartOptions;
						var Data = new google.visualization.DataTable();
						Data.addColumn('string', 'Hour');
						Data.addColumn('number', 'Total');
						Data.addColumn('number', 'Yes');
						Data.addColumn('number', 'No');
						Data.addColumn('number', 'Flag');
						Stats.forEach(function(currentValue,index,array){
							var timestamp = new Date(currentValue.timestamp);
							timestamp.setHours(timestamp.getHours(),0,0,0);
							Data.addRow([
								getLocaleMonthDay(timestamp) + " " + getLocaleTime(timestamp),
								currentValue.total,
								currentValue.count['1'] ? currentValue.count['1'] : 0,
								currentValue.count['0'] ? currentValue.count['0'] : 0,
								currentValue.count['-1'] ? currentValue.count['-1'] : 0,
							]);
						});
						NumberFormat.format(Data,1);
						NumberFormat.format(Data,2);
						NumberFormat.format(Data,3);
						NumberFormat.format(Data,4);
	
						Options.title = 'All votes by hour';
						HourlyChart_el.classList.remove('hidden');
						HourlyChart.draw(Data,Options);
					}
					
					if ( response.kill_counts ) {
						var Stats = response.kill_counts;
						var Options = BarChartOptions;
						var Data = new google.visualization.DataTable();
						Data.addColumn('string', 'Count');
						Data.addColumn('number', 'Users');
						
						Data.addRows(Stats);
						NumberFormat.format(Data,1);
	
						Options.title = 'Total users by average number of votes';
						TotalKillsChart_el.classList.remove('hidden');
						TotalKillsChart.draw(Data,Options);
					}
				}
			);
		}
	</script>
<?php 
} 
function ShowMyIdeas() { 
?>
	<div class="sg" id="extra-sg">
		<div class="title big caps space">My Suggestions</div>
		<div id="sg"></div>
	</div>
<?php 
} 
function ShowMyLikes() { 
?>
	<div class="sg-like" id="extra-sg-like">
		<br />
		<div class="title big caps space">Suggestions I Like</div>
		<div id="sg-like"></div>
	</div>
<?php 
}
function ShowSlaughter() {
	if ( $GLOBALS['EVENT_MODE_DIFF'] > 0 ) {	// Confirm the round is still on
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
				window.open("http://google.com/search?q="+escapeAttribute(dom_GetText('kill-theme')));
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
function ShowVoting() {
	if ( $GLOBALS['EVENT_MODE_DIFF'] > 0 ) {	// Confirm the round is still on
?>
	<div class="action" id="action-vote">
		<div id="vote-tab-0" class="tab big" onclick="vote_ShowPage(0);">Round 1</div>
		<div id="vote-tab-1" class="tab big" onclick="vote_ShowPage(1);">Round 2</div>
		<div id="vote-tab-2" class="tab big" onclick="vote_ShowPage(2);">Round 3</div>
		<div id="vote-tab-3" class="tab big" onclick="vote_ShowPage(3);">Round 4</div>
		
		<div id="vote-page-0" class="page hidden">
			<div id="vote-page-when-0" class="title"></div>
			<div id="vote-page-list-0" class="list"></div>
		</div>
		<div id="vote-page-1" class="page hidden">
			<div id="vote-page-when-1" class="title"></div>
			<div id="vote-page-list-1" class="list"></div>
		</div>
		<div id="vote-page-2" class="page hidden">
			<div id="vote-page-when-2" class="title"></div>
			<div id="vote-page-list-2" class="list"></div>
		</div>
		<div id="vote-page-3" class="page hidden">
			<div id="vote-page-when-3" class="title"></div>
			<div id="vote-page-list-3" class="list"></div>
		</div>
	</div>
	<script>
		function vote_AddItem(page,id,text) {
			id = Number(id);
			
			var node = document.createElement('div');
			node.setAttribute("class",'item');
			node.setAttribute("id","vote-item-"+id);

			node.innerHTML = 
				"<button class='middle button normal yes_button' onclick='vote_SetVote("+id+",1);'>✓</button>"+
				"<button class='middle button normal dunno_button' onclick='vote_SetVote("+id+",0);'>?</button>"+
				"<button class='middle button normal no_button' onclick='vote_SetVote("+id+",-1);'>✕</button>"+
				"<div class='middle label'>"+text+"</div>";
			
			document.getElementById('vote-page-list-'+page).appendChild( node );
		}
		function vote_AddResult(page,id,text,data) {
			console.log(page,id,text,data);
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
//					else {
//						dialog_Alert("Unable to Vote","Try refreshing your browser");
//					}
				}
			);
			vote_ReactivateVote();
		}
		
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
		
		xhr_PostJSON(
			"/api-theme.php",
			serialize({"action":"GET_VOTING_LIST"}),
			// On success //
			function(response,code) {
				console.log("GET_VOTING_LIST:",response);
				
				// Populate Choices //
				for( var idx = 0; idx < response.themes.length; idx++ ) {
					var Theme = response.themes[idx];
					if ( VoteRoundStart[Theme.page] <= 0 ) {
						vote_AddItem(Theme.page,Theme.id,Theme.theme);
					}
					else if ( VoteRoundEnd[Theme.page] <= 0 ) {
						vote_AddResult(Theme.page,Theme.id,Theme.theme,[0,0,0]);
					}
				}
				
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

		var ActivePage = <?=$GLOBALS['EVENT_VOTE_ACTIVE'];?>;
		function vote_ShowPage(num) {
			dom_ToggleClass("vote-page-"+ActivePage,"hidden",true);
			dom_ToggleClass("vote-tab-"+ActivePage,"active",false);
			
			ActivePage = num;
			
			dom_ToggleClass("vote-page-"+ActivePage,"hidden",false);
			dom_ToggleClass("vote-tab-"+ActivePage,"active",true);
		}
		vote_ShowPage(ActivePage);
	</script>
<?php
	}
}
?>
<?php template_GetHeader(); ?>
<div class="invisible" id="dialog-back" onclick='dialog_Close();'>
	<div id="dialog" onclick="event.stopPropagation();">
		<div class="title big" id="dialog-title">Title</div>
		<div class="body">
			<div><img id="dialog-img" src="<?=CMW_STATIC_URL?>/external/emojione/assets/png/26A0.png?v=1.2.4" width=64 height=64"></div>
			<div id="dialog-text">Text</div>
		</div>
		<a href="#" id="dialog-focusfirst"></a>
		<div class="buttons hidden" id="dialog-yes_no">
			<button id="dialog-yes" class="normal focusable" onclick='dialog_DoAction();'>Yes</button>
			<button id="dialog-no" class="normal focusable" onclick='dialog_Close();'>No</button>
		</div>
		<div id="dialog-ok_only" class="buttons hidden">
			<button id="dialog-ok" class="normal focusable" onclick='dialog_Close();'>OK</button>
		</div>
		<a href="#" id="dialog-focuslast"></a>
	</div>
</div>
<div class="header"><?php
	ShowHeader();
?>
</div>
<?php
	if ( !empty($CONFIG['theme-alert']) ) {
		echo "<div class='alert'>",$CONFIG['theme-alert'],"</div>";
	}
	if ( isset($GLOBALS['ERROR']) ) {
		echo "<div class='alert'>",$GLOBALS['ERROR'],"</div>";
	}
?>
<script>
	function DoLogout( reload ) {
		xhr_PostJSON(
			"/api-legacy.php",
			serialize({"action":"LOGOUT"}),
			// On success //
			function(response,code) {
				console.log(response);
				if ( reload ) {
					location.reload();
				}
			}
		);			
	}
	
<?php
	if ( ($cookie_id === 0) && isset($GLOBALS['ERROR']) ) {
		echo "DoLogout();";
	}
?>
	
	function sg_AddIdea(Id,Idea,accent) {
		Id = Number(Id);
		Idea = escapeString(Idea);
		IdeaAttr = escapeAttribute(Idea);
		
		var sg_root = document.getElementById('sg');
		
		var node = document.createElement('div');
		node.setAttribute("class",'sg-item item'+((accent===true)?" effect-accent":""));
		node.setAttribute("id","sg-item-"+Id);
<?php 	if ( $EVENT_MODE === 1 && ($GLOBALS['EVENT_MODE_DIFF'] > 0) ) {	?>
			node.innerHTML = 
				"<div class='sg-item-x' onclick='sg_RemoveIdea("+Id+",\""+(IdeaAttr)+"\")'>✕</div>" +
				"<div class='sg-item-text item-text' title='"+(Idea)+"'>"+(Idea)+"</div>";
<?php	} else { ?>
			node.innerHTML = 
				"<div class='sg-item-text item-text' title='"+(Idea)+"'>"+(Idea)+"</div>";
<?php	} ?>
		sg_root.insertBefore( node, sg_root.childNodes[0] );
		//sg_root.appendChild( node );
		
		document.getElementById('extra').classList.remove("hidden");
	}

	function sg_RemoveIdea(Id,Idea) {
		Id = Number(Id);
		dialog_ConfirmAlert(Idea,"Are you sure you want to delete this?",function(){
			xhr_PostJSON(
				"/api-theme.php",
				serialize({"action":"REMOVE","id":Id}),
				// On success //
				function(response,code) {
					console.log("REMOVE:",response);
					
					if ( response.id > 0 ) {
						var el = document.getElementById('sg-item-'+response.id);
						if ( el ) {
							el.remove();
						}
						sg_UpdateCount(response.count,true);
					}
					else {
						// Invalid Response //	
					}
				}
			);
		});
	}
	
	function sg_UpdateCount(count,effect) {
		var el = document.getElementById('sg-count');
		var Total = 3 - count;
		if ( el && Number(el.innerHTML) !== Total ) {
			el.innerHTML = Total;
			if ( effect === true ) {
				dom_RestartAnimation('sg-count','effect-accent');
			}
		}
	}
		
	function SubmitIdeaForm() {
		var elm = document.getElementById('input-idea');
		var Idea = elm.value.trim();
		
		if ( Idea === "" )
			return;

		elm.value = "";

		xhr_PostJSON(
			"/api-theme.php",
			serialize({"action":"ADD","idea":Idea}),
			// On success //
			function(response,code) {
				console.log("ADD:",response);
				
				sg_UpdateCount(response.count,true);
				
				// Success //
				if ( response.id > 0 ) {
					sg_AddIdea(response.id,response.idea,true);
				}
				// Failure //
				else if ( response.count === 3 ) {
					elm.value = Idea;	// Restore
					dialog_Alert("No Suggestions Left","");
				}
				else {
					dialog_Alert("Other Error",JSON.stringify(response));
				}
			}
		);

		elm.focus();
	}
	
	function dialog_ConfirmAlert(title,message,func /*,outside_close*/) {
		if ( dialog_IsActive() )
			return;
		
		dialog_SetAction(func);
		dom_SetText("dialog-title",title);
		dom_SetText("dialog-text",message);
		
		dom_ToggleClass("dialog-yes_no","hidden",false);
		dom_ToggleClass("dialog-ok_only","hidden",true);
		
		dom_SetClasses("dialog","red_dialog effect-zoomin");
		dom_SetClasses("dialog-back","effect-fadein");

		dom_SetFocus("dialog-no");
	}
	function dialog_Alert(title,message /*,outside_close*/) {
		if ( dialog_IsActive() )
			return;
		
		dom_SetText("dialog-title",title);
		dom_SetText("dialog-text",message);

		dom_ToggleClass("dialog-yes_no","hidden",true);
		dom_ToggleClass("dialog-ok_only","hidden",false);
		
		dom_SetClasses("dialog","blue_dialog effect-zoomin");
		dom_SetClasses("dialog-back","effect-fadein");
		
		dom_SetFocus("dialog-ok");
	}
	var _dialog_action;
	function dialog_SetAction(func) {
		_dialog_action = func;
	}
	function dialog_DoAction() {
		_dialog_action();		
		dialog_Close();
	}
	function dialog_IsActive() {
		return dom_HasClass("dialog-back","effect-fadein");
	}
	function dialog_Close() {
		dom_RemoveClass("dialog","effect-zoomin");
		dom_AddClass("dialog","effect-zoomout");
		dom_SetClasses("dialog-back","effect-fadeout");
	}
	
	window.onload = function() {
		// Dialog //
		var Focusable = document.getElementsByClassName("focusable");
		
		// NOTE: If you tab in from the title bar, the last element will be selected
		document.getElementById("dialog-focusfirst").addEventListener("focus",function(event){
			for ( var idx = Focusable.length-1; idx >= 0; idx-- ) {
				if ( Focusable[idx].offsetParent !== null ) {
					event.preventDefault();
					event.stopPropagation();
					Focusable[idx].focus()
					break;
				}
			}
		});
		document.getElementById("dialog-focuslast").addEventListener("focus",function(event){
			for ( var idx = 0; idx < Focusable.length; idx++ ) {
				if ( Focusable[idx].offsetParent !== null ) {
					event.preventDefault();
					event.stopPropagation();
					Focusable[idx].focus()
					break;
				}
			}
		});
		// For browsers that do otherwise //
		window.addEventListener("focus",function(event){
			for ( var idx = Focusable.length-1; idx >= 0; idx-- ) {
				if ( Focusable[idx].offsetParent !== null ) {
					event.preventDefault();
					event.stopPropagation();
					Focusable[idx].focus()
					break;
				}
			}
		});
		
		window.addEventListener("keydown",function(event){
			if ( dialog_IsActive() ) {
				if ( event.keyCode == 27 ) {
					// TODO: Confirm that we are in a mode where pushing ESC is allowed
					event.preventDefault();
					event.stopPropagation();
					dialog_Close();
				}
			}
			else {
				<?php if ( $EVENT_MODE === 2 ) { ?>
					if ( event.keyCode == 37 ) {
						document.getElementById('kill-good').focus();
					}
					else if ( event.keyCode == 39 ) {
						document.getElementById('kill-bad').focus();
					}
				<?php } ?>
			}
		});

		
		
		<?php
		if ( $CONFIG['active'] && $cookie_id && !$admin ) {
		?>
			xhr_PostJSON(
				"/api-theme.php?debug",
				serialize({"action":"GETMY"}),
				// On success //
				function(response,code) {
					console.log("GETMY:",response);
					if ( response.hasOwnProperty('ideas') ) {
						response.ideas.forEach(function(response) {
							sg_AddIdea(response.id,response.theme);
						});
						
						sg_UpdateCount(response.count);
					}
					else {
						sg_UpdateCount("ERROR",true);
					}
				}
			);
		<?php
		}
	?>
	}
</script>
<div class="body">
	<div class="main">
		<?php
			if ( $CONFIG['active'] ) {
				if ( $admin && $cookie_id ) {
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
				else {
					ShowHeadline();
					
					if ( $cookie_id ) {
						switch( $EVENT_MODE ) {
						case 0:	// Inactive //
							break;
						case 1:	// Theme Suggestions //
							ShowSubmitIdea();
							break;
						case 2: // Theme Slaughter //
							ShowSlaughter();
							break;
						case 3: // Theme Voting //
							ShowVoting();
							break;
						case 4: // Final Voting //
							break;
						case 5: // Announcement //
							break;
						case 6: // Post Announcement //
							break;
						case 7: // Coming Soon //
							break;
						};
					}
				}
					
				if ( $cookie_id ) {
					if ( $EVENT_MODE !== 5 )	// Announcement //
						ShowLogout();
				}
				else {
					if ( $EVENT_MODE !== 5 )	// Announcement //
						ShowLogin();
				}
			}
			else {
				ShowInactive();
			}
		?>
	</div>
	<?php
	if ( $CONFIG['active'] ) {
		if ( $cookie_id && !$admin ) {
			echo "<div id='extra' class='hidden'>";
				ShowMyIdeas();
				//ShowMyLikes();
			echo "</div>";
		}
		
		ShowStats();
	}
	?>
</div>
<?php template_GetFooter();
