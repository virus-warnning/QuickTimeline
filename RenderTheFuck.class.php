<?php
/**
 * RenderTheFuck extension
 *
 * @since  0.1.0
 * @author Raymond Wu <virus.warnning@gmail.com>
 */
// @codingStandardsIgnoreStart
class RenderTheFuck
// @codingStandardsIgnoreEnd
{

    /* Version string. */
    private static $version;

    /* Indicate how many tags rendered. */
    private static $rank = 0;

    /**
     * Setup hook tag
     *
     * @since 0.1.0
     *
     * @param $parser MediaWiki parser
     */
    public static function onParserFirstCallInit(&$parser)
    {
        // Load version string.
        global $wgExtensionCredits;
        foreach ($wgExtensionCredits['parserhook'] as $ext) {
            if ($ext['name']==='RenderTheFuck') {
                self::$version = $ext['version'];
                break;
            }
        }

        // Setup callback for <thefuck> tag.
        $parser->setHook('thefuck', array('RenderTheFuck', 'render'));

        return true;
    }

    /**
     * Render <thefuck> tag
     *
     * @since 0.1.0
     *
     * @param $in     text in <thefuck> tag
     * @param $param  attributes in <thefuck> tag
     * @param $parser MediaWiki parser
     * @param $frame  never used
     */
    public static function render($in, $param = array(), $parser = null, $frame = false)
    {
        if (self::$rank === 0) {
            $parser->getOutput()->addModules(array('ext.d3.core'));
        }

        $BASE = dirname(__FILE__);
        $AVAILABLE_EXAMPLES = array('timeline');

        // Check input for security concern.
        $svgw = self::getIntValue($param, 'width', 400);
        $svgh = self::getIntValue($param, 'height', 300);
        $elid = sprintf('thefuck-%02d', self::$rank++);

        // Decode and encode the json string to ensure it's well-formated.
        if (isset($param['example']) && in_array($param['example'], $AVAILABLE_EXAMPLES)) {
            $file = sprintf('%s/examples/%s.tfj', $BASE, $param['example']);
            $exampleCode = file_get_contents($file);
            $json = json_encode(json_decode($exampleCode));
        } else {
            $json = json_encode(json_decode($in));
        }

        // Server-side validation.
        if ($json[0] !== '{') {
            $json = json_encode(array(
                'wtf' => 'error',
                'settings' => array(
                    'message' => 'The fuck is not in correct JSON format.'
                )
            ));
        }

        // %s id
        // %d width
        // %d height
        // %s json
        $template = file_get_contents($BASE . '/template.html');
        $output   = sprintf($template, $elid, $svgw, $svgh, $json);

        // Dump source code of example
        if (isset($exampleCode) && strlen($exampleCode)>0) {
            $output .= '<p>Source code of timeline example:</p>';
            $output .= '<pre>' . $exampleCode . '</pre>';
        }

        return array( $output, "markerType" => 'nowiki' );
    }

    /**
     * Get given integer or minimal value from key/value array.
     */
    private static function getIntValue(&$pairs, $key, $min)
    {
        if (isset($pairs[$key])) {
            $given = (int)$pairs[$key];
            if ($given > $min) {
                return $given;
            }
        }
        return $min;
    }
}
