<?php

require dirname(__FILE__).'/common.php';

$param = isset($_POST['param']) ? $_POST['param'] : '';

if (empty($param)) {
	apimessage(1, 'checkfile参数错误', $data);
}

//http://appcdn.fanyi.baidu.com/zhdict/mp3/pin3.mp3


$param = explode('|', $param);
$rdata = array();
foreach ($param as $pinyin) {
        $pinyin = trim($pinyin);
        if (!preg_match('/[a-zA-Z0-9]/i', $pinyin)) {
            continue;
        }
        $rdata[] = $pinyin;
	if (!file_exists(APP_ROOT."/data/audio/{$pinyin}.mp3")) {
		//$cmd = "cd ".APP_ROOT."/data/audio/ && wget https://ss".rand(0,3).".bdstatic.com/9_QWbzqaKgAFnsKb8IqW0jdnxx1xbK/zhdict/mp3/{$pinyin}.mp3";
		$cmd = "cd ".APP_ROOT."/data/audio/ && wget --no-check-certificate https://appcdn.fanyi.baidu.com/zhdict/mp3/{$pinyin}.mp3";
		$msgline = exec($cmd, $out_arr, $out_var);
		if ($out_var !== 0) {
			appendlog("cmd={$cmd} exec fail");
			apimessage(1, '生成音频文件失败', array());
		}
	}
}

apimessage(0, 'succ', $rdata);
