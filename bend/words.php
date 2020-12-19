<?php

require dirname(__FILE__).'/common.php';
require dirname(__FILE__).'/vendor/autoload.php';

use Overtrue\Pinyin\Pinyin;

$message = isset($_POST['message']) ? $_POST['message'] : '';

if (empty($message)) {
	apimessage(1, '不能提交空内容', $data);
}

$pinyin = new Pinyin();

$data = $pinyin->convert($message, PINYIN_ASCII);

apimessage(0, 'succ', $data);

