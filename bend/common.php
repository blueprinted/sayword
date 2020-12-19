<?php
header('content-type:text/html;charset=utf-8');

//通用常量
define('APP_ROOT', dirname(__FILE__));
define('TPL_FILEEXT', 'html');//tpl suffix
define('PRODUCT_MODEL', false);//产品模式[1:产品模式,0:开发模式]

date_default_timezone_set('PRC');
if(PHP_VERSION < '5.3.0'){
	set_magic_quotes_runtime(0);//later 5.3.0, discard
}

if(PRODUCT_MODEL){
	error_reporting(E_ERROR | E_WARNING | E_PARSE | E_CORE_ERROR);
	ini_set('display_errors', 'Off');
} else {
	error_reporting(E_ALL ^ E_NOTICE);
	ini_set('display_errors', 'On');
}
ob_start();

require APP_ROOT.'/includes/func.common.php';

//处理REQUEST_URI
if(!isset($_SERVER['REQUEST_URI'])) {  
	$_SERVER['REQUEST_URI'] = $_SERVER['PHP_SELF'];
	if(isset($_SERVER['QUERY_STRING'])) $_SERVER['REQUEST_URI'] .= '?'.$_SERVER['QUERY_STRING'];
}
