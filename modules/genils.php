<?php
/**
 * Generate inline style into javascript variable.
 */
$items = ['timeline'];

foreach ($items as $i) {
	$file = sprintf('%s.min.css', $i);
	$body = file_get_contents($file);
	$body = str_replace('.render-the-fuck>', '', $body);
	$jsv  = sprintf('THE_FUCK_STYLES["%s"]="%s";', $i, $body);

	$file = sprintf('styles.%s.js', $i);
	file_put_contents($file, $jsv);
}
?>