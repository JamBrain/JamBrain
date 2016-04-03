<?php

function ShowStats() { 
?>
	<div class="stats" id="stats">
		<div class="title bigger caps space">Statistics</div>
		<div id="stats-tab-0" class="tab big hidden" onclick="stats_ShowPage(0);">Suggestions</div>
		<div id="stats-tab-1" class="tab big hidden" onclick="stats_ShowPage(1);">Slaughter</div>
		<div id="stats-tab-2" class="tab big hidden" onclick="stats_ShowPage(2);">Voting</div>
		<div id="stats-tab-3" class="tab big hidden" onclick="stats_ShowPage(3);">Final Voting</div>
		
		<div id="stats-page-0" class="page hidden">
			<div id="stats-0-top" class="title hidden">
				<div>Themes suggested: <span class="bold" id="stats-idea-count"></span></div>
				<div>By number of users: <span class="bold" id="stats-users-with-ideas"></span></div>
				<br />
				<div class="big title">Total since Ludum Dare 34</div>
				<div>Themes suggested: <span class="bold" id="stats-total-idea-count"></span></div>
			</div>
			<div id="stats-0-graphs" class="title hidden">
				<div class="big title">Graphs</div>
				<div id="graph-ideas-over-time" class="hidden hide-on-mobile" style="width:600px;height:300px;margin:0 auto;"></div>
			</div>
		</div>
		<div id="stats-page-1" class="page hidden">
			<div id="stats-1-top" class="title hidden">
				<div>Unique Themes: <span class="bold" id="stats-optimized-count"></span></div>
				<div>Users who have slaughtered: <span class="bold" id="stats-users-that-kill"></span></div>
			</div>
			<div id="stats-1-graphs" class="title hidden">
				<div class="big title">Graphs</div>
				<div id="graph-my-votes" class="hidden" style="width:300px;height:300px;display:inline-block;"></div>
				<div id="graph-votes" class="hidden" style="width:300px;height:300px;display:inline-block;"></div>
				<div id="graph-hourly" class="hidden hide-on-mobile" style="width:600px;height:300px;margin:0 auto;"></div>
				<div id="graph-total-kills" class="hidden hide-on-mobile" style="width:600px;height:300px;margin:0 auto;"></div>
			</div>
		</div>
		<div id="stats-page-2" class="page hidden">
			<div class="title big">Coming Soon.</div>
		</div>
		<div id="stats-page-3" class="page hidden">
			<div class="title big">Coming Soon.</div>
		</div>

		<div class="small">Statistics updated every 10 minutes</div>
	</div>
		
	<script>
<?php
		global $EVENT_MODE;
		// Show Statistics Tabs //
		if ( $EVENT_MODE >= 3 ) { // HACK! Disable stats until I fix them //
			echo 'dom_ToggleClass("stats-tab-0","hidden",false);';
			echo 'dom_ToggleClass("stats-tab-1","hidden",false);';
		}
		if ( $EVENT_MODE >= 3 )
			echo 'dom_ToggleClass("stats-tab-2","hidden",false);';
		if ( $EVENT_MODE >= 4 )
			echo 'dom_ToggleClass("stats-tab-3","hidden",false);';
?>			
		
		var ActiveStatsPage = -1;
		function stats_ShowPage(num,keep_history) {
			if ( ActiveStatsPage === Number(num) ) {
				return;
			}
			
			if ( ActiveStatsPage >= 0 ) {
				dom_ToggleClass("stats-page-"+ActiveStatsPage,"hidden",true);
				dom_ToggleClass("stats-tab-"+ActiveStatsPage,"active",false);
			}
			
			ActiveStatsPage = Number(num);
			
			dom_ToggleClass("stats-page-"+ActiveStatsPage,"hidden",false);
			dom_ToggleClass("stats-tab-"+ActiveStatsPage,"active",true);
		}
		stats_ShowPage(0,true);
		
		google.load("visualization", "1", {packages:["corechart"]});
		google.setOnLoadCallback(DrawStatsCharts);
		

		
		function DrawStatsCharts() {
			var NumberFormat = new google.visualization.NumberFormat(
				{groupingSymbol:',',fractionDigits:0}
			);
			var IdeasChart_el = document.getElementById('graph-ideas-over-time');
			var IdeasChart = new google.visualization.ColumnChart(IdeasChart_el); 

			var MyVotesChart_el = document.getElementById('graph-my-votes');
			var MyVotesChart = new google.visualization.PieChart(MyVotesChart_el);
			var VotesChart_el = document.getElementById('graph-votes');
			var VotesChart = new google.visualization.PieChart(VotesChart_el);
			var HourlyChart_el = document.getElementById('graph-hourly');
			var HourlyChart = new google.visualization.AreaChart(HourlyChart_el);
			var TotalKillsChart_el = document.getElementById('graph-total-kills');
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
					
					if ( response.idea_count ) {
						document.getElementById('stats-idea-count').innerHTML = addCommas(response.idea_count);
						document.getElementById('stats-users-with-ideas').innerHTML = addCommas(response.users_with_ideas);
						document.getElementById('stats-total-idea-count').innerHTML = addCommas(response.total_idea_count);

						document.getElementById('stats-0-top').classList.remove('hidden');
					}
					if ( response.optimized_count ) {
						document.getElementById('stats-optimized-count').innerHTML = addCommas(response.optimized_count);
						document.getElementById('stats-users-that-kill').innerHTML = addCommas(response.users_that_kill);

						document.getElementById('stats-1-top').classList.remove('hidden');
					}

//					if ( response.kill_counts ) { // temporary
//						document.getElementById('stats-0-graphs').classList.remove('hidden');
//
//						var Stats = response.kill_counts;
//						var Options = BarChartOptions;
//						var Data = new google.visualization.DataTable();
//						Data.addColumn('string', 'Count');
//						Data.addColumn('number', 'Users');
//						
//						Data.addRows(Stats);
//						NumberFormat.format(Data,1);
//	
//						Options.title = 'Total ideas over time';
//						IdeasChart_el.classList.remove('hidden');
//						IdeasChart.draw(Data,Options);
//					}
					
					if ( response.my_kill_stats ) {
						document.getElementById('stats-1-graphs').classList.remove('hidden');

						var Stats = response.my_kill_stats;
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
	
					if ( response.all_kill_stats ) {
						document.getElementById('stats-1-graphs').classList.remove('hidden');

						var Stats = response.all_kill_stats;
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
					
					if ( response.kills_per_hour ) {
						document.getElementById('stats-1-graphs').classList.remove('hidden');

						var Stats = response.kills_per_hour;
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
					
					if ( response.average_kill_counts ) {
						document.getElementById('stats-1-graphs').classList.remove('hidden');

						var Stats = response.average_kill_counts;
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
