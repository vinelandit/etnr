<?php 
	// replace {NOW} placeholders in static index.html file with current timestamp to force reload
	$str = file_get_contents('./index.html');
	print str_replace('{NOW}',time(),$str);
?>