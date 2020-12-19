<?php
header('content-type:text/html;charset=utf-8');

//通用常量
define('APP_ROOT', dirname(__FILE__));
define('APP_LOG', APP_ROOT."/log");
define('TPL_FILEEXT', 'html');//tpl suffix
define('ENVIRONMENT', 'development'); // development / dev / test / product

date_default_timezone_set('PRC');
if(PHP_VERSION < '5.3.0'){
	set_magic_quotes_runtime(0);//later 5.3.0, discard
}

if (ENVIRONMENT == 'product') {
    error_reporting(E_ALL & ~E_NOTICE & ~E_DEPRECATED);
    ini_set("display_errors", "On");
} else {
    error_reporting(E_ALL);
    ini_set("display_errors", "On");
}
ob_start();

require APP_ROOT . '/includes/func.common.php';
require APP_ROOT . '/vendor/autoload.php';
require APP_ROOT . '/includes/func.log.php';

//处理REQUEST_URI
if(!isset($_SERVER['REQUEST_URI'])) {  
	$_SERVER['REQUEST_URI'] = $_SERVER['PHP_SELF'];
	if(isset($_SERVER['QUERY_STRING'])) $_SERVER['REQUEST_URI'] .= '?'.$_SERVER['QUERY_STRING'];
}

function format_echo($msg)
{
    echo eval(APP_MSG_HEAD) . $msg . APP_BR;
    return true;
}
/**
 * 用于注册register_shutdown_function的shutdown回调函数
 * 主要用于发送脚本运行情况，在线调试等信息
 */
function shutDownHandler()
{
    //处理脚本PHP错误
    $error = error_get_last();
    if (is_null($error)) {
        return false;
    }

    $errorTypeArr = array (
        E_ERROR              => 'E_ERROR',
        E_WARNING            => 'E_WARNING',
        E_PARSE              => 'E_PARSE',
        E_NOTICE             => 'E_NOTICE',
        E_CORE_ERROR         => 'E_CORE_ERROR',
        E_CORE_WARNING       => 'E_CORE_WARNING',
        E_COMPILE_ERROR      => 'E_COMPILE_ERROR',
        E_COMPILE_WARNING    => 'E_COMPILE_WARNING',
        E_USER_ERROR         => 'E_USER_ERROR',
        E_USER_WARNING       => 'E_USER_WARNING',
        E_USER_NOTICE        => 'E_USER_NOTICE',
        E_STRICT             => 'E_STRICT',
        E_RECOVERABLE_ERROR  => 'E_RECOVERABLE_ERROR',
        E_DEPRECATED         => 'E_DEPRECATED',
        E_USER_DEPRECATED    => 'E_USER_DEPRECATED',
    );
    if (empty($error) || !array_key_exists($error['type'], $errorTypeArr)) {
        // This error code is not included in error_reporting
        format_echo("This error code is not included in error_reporting:" . json_encode($error));
        return false;
    }
    $errorType = $errorTypeArr[$error['type']];
    $errstr = strip_tags($error['message']);
    $myerror = "$errstr <br>File：{$error['file']} <br>Line：{$error['line']}";
    $myerror = 'Type：<strong>['.$errorType.']</strong><br>' . $myerror;
    appendlog('php_error[' . $errorType . '] ' . $myerror, 'warning');
    return true;
}
//注册shutdown函数
register_shutdown_function('shutDownHandler');

/**
 * 记录日志
 */
function appendlog($logMsg, $logLevel = 'warning', $channel = "sayword", $context = array(), $extra = null)
{
    return monolog_appendlog((isset($_SERVER['REQUEST_URI']) ? "URI={$_SERVER['REQUEST_URI']}" : 'URI=_null_') . ' ' . $logMsg, $logLevel, $channel, $context, $extra);
}
