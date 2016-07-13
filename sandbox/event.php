<?php
	header("Content-type: text/plain");
	
	echo "GameConfs.com Parser\n";

	include __DIR__."/simple_html_dom.php";
	
	echo "\nParsing Recent Changes ATOM RSS Feed...\n";
	
    $events = simplexml_load_file('http://www.gameconfs.com/recent.atom');

	foreach ( $events->entry as $entry ) {
		//print_r($entry);
		$html = str_get_html($entry->content);
		//print_r($parsed);
		
		if ( $html ) {
			$data = [];
			$data['name'] = trim($html->find('h2', 0)->plaintext);
			$data['long_name'] = (string)$entry->title;
			$data['id_url'] = (string)$entry->id;
			$data['id'] = substr($data['id_url'], strrpos($data['id_url'], '/') + 1);
			$data['updated'] = (string)$entry->updated;
			$data['published'] = (string)$entry->published;
			
			foreach($html->find('tr') as $tr) {
				//echo $tr->find('td', 0)->plaintext . "\n";
				switch( $tr->find('td', 0)->plaintext ) {
					case "Dates":
						$data['dates'] = trim($tr->find('td', 1)->plaintext);
						break;
					case "Website":
						$data['website'] = trim($tr->find('td', 1)->plaintext);
						break;
					case "Twitter hashtags":
						$data['hashtag'] = trim($tr->find('td', 1)->plaintext);
						break;
					case "Twitter account":
						$data['twitter'] = trim($tr->find('td', 1)->plaintext);
						break;
					case "Location":
						$data['location'] = trim($tr->find('td', 1)->plaintext);
						break;
				}
			}
			print_r($data);

			// Cleanup //
			$html->clear();
		}
		else {
			echo "ERROR\n";
		}
	}
	
	$year = 2015;
	echo "\nParsing ".$year." Chart...\n";
	$chart = [];
	{
		$doc = file_get_html("http://www.gameconfs.com/year/".$year);
		if ($doc) {
			foreach( $doc->find('.event-entry') as $entry ) {
				$data = [];
				$data['name'] = $entry->find('.event-name',0)->plaintext;
				$data['id_url'] = $entry->find('a',0)->href;	// Might be unsafe, but works
				$data['id'] = substr($data['id_url'], strrpos($data['id_url'], '/') + 1);
				$data['start'] = $entry->find('[itemprop=startDate]',0)->content;
				$data['end'] = $entry->find('[itemprop=endDate]',0)->content;
				$data['location'] = $entry->find('.event-location',0)->plaintext;
				$chart[$data['id']] = $data;
			}
			
			// Cleanup //
			$doc->clear();
		}
		else {
			echo "ERROR\n";
		}
		
		print_r($chart);
	}
	
	echo "\nParsing Individual Event...\n";
	
	$idx = 3;
	foreach ( $chart as $item ) {
		echo $item['id']."\n";		
		$event = file_get_html("http://www.gameconfs.com/event/".$item['id']);
		$data = [];
		if ( $event ) {
			foreach ($event->find(".event-entry") as $entry ) {
				if ( $el = $entry->find('[itemprop=name]',0) ) { $data['name'] = trim($el->plaintext); }
				$data['id'] = $item['id'];
				if ( $el = $entry->find('[itemprop=startDate]',0) ) { $data['start'] = trim($el->content); }
				if ( $el = $entry->find('[itemprop=endDate]',0) ) { $data['end'] = trim($el->content); }
				if ( $el = $entry->find('[itemprop=url]',0) ) { $data['url'] = trim($el->href); }
				if ( $el = $entry->find('.event-twitter a',0) ) { $data['twitter'] = trim($el->plaintext); }
				if ( $el = $entry->find('.event-hashtags a',0) ) { $data['hashtag'] = trim($el->plaintext); }
				if ( $el = $entry->find('[itemprop=location]',0) ) { $data['location'] = trim($el->plaintext); }
	
				print_r($data);
			}
		}
		else {
			echo "ERROR\n";
		}
	
		// Artificial limit, to stop us from hammering server //
		if ( !(--$idx) ) {
			break;
		}
	}
?>