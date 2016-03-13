<?php

function ShowStats() { 
?>
	<div class="stats" id="stats">
		<div class="title bigger caps space">Statistics</div>
		<div id="stats-tab-0" class="tab big" onclick="stats_ShowPage(0);">Suggestion</div>
		<div id="stats-tab-1" class="tab big" onclick="stats_ShowPage(1);">Slaughter</div>
		<div id="stats-tab-2" class="tab big" onclick="stats_ShowPage(2);">Voting</div>
		<div id="stats-tab-3" class="tab big" onclick="stats_ShowPage(3);">Final Voting</div>
		
		<div id="stats-page-0" class="page hidden">
			<div class="title big">Coming Soon.</div>
		</div>
		<div id="stats-page-1" class="page hidden">
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
		<div id="stats-page-2" class="page hidden">
			<div class="title big">Coming Soon.</div>
		</div>
		<div id="stats-page-3" class="page hidden">
			<div class="title big">Coming Soon.</div>
		</div>

		<div class="small">Statistics updated every 10 minutes</div>
	</div>
		
	<script>
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
		stats_ShowPage(3,true);	
		
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
