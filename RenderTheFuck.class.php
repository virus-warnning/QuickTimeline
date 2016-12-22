<?php
/**
 *
 */
class RenderTheFuck {

	/* 版本字串 */
	private static $version;

	private static $rank = 0;

	/**
	 * 掛載點設定 (由 MediaWiki 觸發)
	 *
	 * @since 0.1.0
	 * @param $parser MediaWiki 的語法處理器
	 */
	public static function onParserFirstCallInit(&$parser) {
		// 取得版本字串
		global $wgExtensionCredits;
		foreach ($wgExtensionCredits['parserhook'] as $ext) {
			if ($ext['name']==='RenderTheFuck') {
				self::$version = $ext['version'];
				break;
			}
		}

		// 設定函數鉤
		$parser->setHook('thefuck', array('RenderTheFuck', 'render'));

		return true;
	}

	/**
	 * 製圖 (由 MediaWiki 觸發)
	 *
	 * @since 0.1.0
	 * @param $in     MediaWiki 寫的語法內文
	 * @param $param  標籤內的參數
	 * @param $parser MediaWiki 的語法處理器
	 * @param $frame  不知道是啥小
	 */
	public static function render($in, $param=array(), $parser=null, $frame=false) {
		if (self::$rank === 0) {
			$parser->getOutput()->addModules(array('ext.d3.core'));
		}

		$svgw = self::getValue($param, 'width', 400);
		$svgh = self::getValue($param, 'height', 300);
		$elid = sprintf('thefuck-%03d', self::$rank++);
		$data = array('a' => 1, 'b' => 2);

		// %s id
		// %d width
		// %d height
		// %s jsonData
		$template = file_get_contents(dirname(__FILE__) . '/template.html');
		$template = preg_replace('/\n\s*/', ' ', $template);
		$template = str_replace('<script', "\n<script", $template);
		return sprintf($template, $elid, $svgw, $svgh, json_encode($data));
	}

	/**
	 * 取值或預設值
	 */
	private static function getValue(&$item, $key, $default) {
		return isset($item[$key]) ? $item[$key] : $default;
	}

}
?>