/*
words = [
    {key:'word1', 'src':'static/audio/1_xiu1.mp3', audio:null},
	{key:'word2', 'src':'static/audio/2_bing4.mp3', audio:null},
	{key:'word3', 'src':'static/audio/3_fei1.mp3', audio:null},
	{key:'word4', 'src':'static/audio/4_lang3.mp3', audio:null},
	{key:'word5', 'src':'static/audio/5_miao3.mp3', audio:null},
	{key:'word6', 'src':'static/audio/6_xin1.mp3', audio:null},
	{key:'word7', 'src':'static/audio/7_quan2.mp3', audio:null},
	{key:'word8', 'src':'static/audio/8_miao3.mp3', audio:null},
	{key:'word9', 'src':'static/audio/9_peng2.mp3', audio:null},
	{key:'word10', 'src':'static/audio/10_ying1.mp3', audio:null},
	{key:'word11', 'src':'static/audio/11_liu2.mp3', audio:null},
	{key:'word12', 'src':'static/audio/12_xiang3.mp3', audio:null},
	{key:'word13', 'src':'static/audio/13_huo4.mp3', audio:null},
	{key:'word14', 'src':'static/audio/14_tai2.mp3', audio:null}
];

words = [
    {key:'word1', 'src':'static/audio/gong1.mp3', audio:null, timer:null},
	{key:'word2', 'src':'static/audio/xi3.mp3', audio:null, timer:null},
	{key:'word3', 'src':'static/audio/fa1.mp3', audio:null, timer:null},
	{key:'word4', 'src':'static/audio/cai2.mp3', audio:null, timer:null},
	{key:'word5', 'src':'static/audio/xin1.mp3', audio:null, timer:null},
	{key:'word6', 'src':'static/audio/nian2.mp3', audio:null, timer:null},
	{key:'word7', 'src':'static/audio/wan4.mp3', audio:null, timer:null},
	{key:'word8', 'src':'static/audio/shi4.mp3', audio:null, timer:null},
	{key:'word9', 'src':'static/audio/ru2.mp3', audio:null, timer:null},
	{key:'word10', 'src':'static/audio/yi4.mp3', audio:null, timer:null}
];
*/

var playStatus = 0;
var pausedIndex = 0;
/*
game = new Phaser.Game(640, clientHeight, Phaser.AUTO, $('#gamer')[0], {
	preload: preload,
	create: create,
	update: update,
	render: render
}, true);
*/

function preload() {
	game.load.bitmapFont('showg', 'static/c/fonts/showg.png', 'static/c/fonts/showg.xml');
	game.load.spritesheet('button', 'static/i/flixel-button.png', 80, 20);
	for (var idx =0; idx < words.length; idx++) {
		game.load.audio(words[idx].key, words[idx].src);
	}
}

function create() {
	for (var idx =0; idx < words.length; idx++) {
		words[idx].audio = game.add.audio(words[idx].key);
	}
	makeButton('play', 100, 220, readStart);
	makeButton('pause', 100, 280, readPause);
	makeButton('stop', 100, 340, readStop);
}

function update() {
}

function render() {
}

function makeButton(name, x, y, func) {
    var button = game.add.button(x, y, 'button', func, this, 0, 1, 2);
    button.name = name;
    button.scale.set(2, 1.8);
    button.smoothed = true;
    var text = game.add.bitmapText(x, y + 10, 'showg', name, 12);
    text.x += (button.width / 2) - (text.textWidth / 2);
}

function readStart() {
	if (playStatus == 1 || words.length < 1) {
		return false;
	}
	var statrid = null;
	if (playStatus == 2) {
		statrid = pausedIndex;
	} else {
		statrid = 0;
	}
	var inverval = 0;
	var spaceTime = 100;
	var order = function (idx, timeout) {
		words[idx].timer = setTimeout(function(){
			words[idx].audio.play();
			timeout = words[idx].audio.totalDuration*1000+spaceTime;	
			++idx<words.length && order(idx, timeout);
			idx>=words.length && (playStatus=0);
		}, timeout);
	}
	playStatus = 1;
	order(statrid, 0);
}
function readStop() {
	var inverval = 10;
	var stop = function () {
		for (var idx =0; idx < words.length; idx++) {
			if(words[idx].audio.isPlaying) {
				words[idx].audio.stop();
				playStatus = 0;
				if(idx < words.length - 1) {
					clearTimeout(words[idx+1].timer);
				}
				break;
			}
		}
		if(playStatus == 1) {
			setTimeout(stop, inverval);
		}
	}
	stop();
}
function readPause() {
	var inverval = 10;
	var paused = function () {
		for (var idx =0; idx < words.length; idx++) {
			if(words[idx].audio.isPlaying) {
				words[idx].audio.stop();
				playStatus = 2;
				pausedIndex = idx;
				if(idx < words.length - 1) {
					clearTimeout(words[idx+1].timer);
				}
				break;
			}
		}
		if(playStatus == 1) {
			setTimeout(paused, inverval);
		}
	}
	paused();
}
