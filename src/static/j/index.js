'use strict';
var touchSupport = 'ontouchend' in document;
var cssAnimations = false;
var animEndEventNames = {
	'WebkitAnimation' : 'webkitAnimationEnd',
	'OAnimation' : 'oAnimationEnd',
	'msAnimation' : 'MSAnimationEnd',
	'animation' : 'animationend'
};
var animEndEventName = null;

$(function(){
	/*animation end event name*/
	animEndEventName = animEndEventNames[Modernizr.prefixed('animation')];
	/*support css animations*/
	cssAnimations = Modernizr.cssanimations;
	$('#loader').hide();
	$('#gamer').show();
	resize();
	$(window).resize(function(){resize()});
	init_form();
	$('.textarea-words').bind('input propertychange', function(){
		tiper('textarea change..', {
			timeout: 1.25,
			before: function(){
				$('input[name="message"]').data({value:$('input[name="message"]').val()}).val(' ');
			},
			callback: function() {
				$('input[name="message"]').val($('input[name="message"]').data('value'));
			}
		});
		if($(this).val().length > 0) {
			if(/^[a-zA-Z\d\|]+$/i.test($(this).val())) {
				words = [];
				var pinyins = $(this).val().split('|');	
				$.ajax({
					type: 'post',	
					dataType: 'json',
					url: 'bend/checkfile.php',
					data: 'param='+$(this).val(),
					success: function(resp) {
console.log(resp, resp.status);
						if(resp.status == 0) {
						for (var idx=0; idx<resp.data.length; idx++) {
							words.push({key:'word'+idx, 'src':'bend/data/audio/'+resp.data[idx]+'.mp3', audio:null, timer:null});
						}
						try{game.destroy()}catch(e){}
                                                game = new Phaser.Game(640, clientHeight,
Phaser.AUTO, $('#gamer')[0], {
                                                        preload: preload,
                                                        create: create,
                                                        update: update,
                                                        render: render
                                                }, true);
return;
						}
							tiper(resp.message, {
                                                                timeout: 2,
                                                                before: function(){
                                                $('input[name="message"]').data({value:$('input[name="message"]').val()}).val(' ');
                                                                },
                                                                callback: function() {
                                                                        $('input[name="message"]').val($('input[name="message"]').data('value'));
                                                                }
                                                        });
					},
					error: function(xhr, errmsg) {
						tiper(errmsg, {
							timeout: 2,
							before: function(){
								$('input[name="message"]').data({value:$('input[name="message"]').val()}).val(' ');
							},
							callback: function() {
								$('input[name="message"]').val($('input[name="message"]').data('value'));
							}
						});
					},
					complete: function() {}
				});
			}
			
			//https:
			
		}
	});
});
function resize() {
	$('#message-button>span').css({
		width: $(window).width()*0.8*0.16+'px',
		height: $(window).height()*0.188*0.38+'px',
		display: 'table-cell',
	});
}
function init_form() {
	$('#msgform').ajaxForm({
		dataType:'json',
		beforeSubmit:function(){
			if($.trim($('input[name="message"]').val()) === '') {
				$('#msgform').addClass('error shake').on(animEndEventName, function() {
					$(this).off(animEndEventName).removeClass('shake');
				});
				inOut('#msgform', 3, '', function(){$('#msgform').addClass('error')});
				return false;
			}
			$('input[name="message"]').removeClass('error shake');
			$('#message-button').attr('disabled', true);
		},
		complete:function(XMLHttpRequest, status) {
			$('#message-button').attr('disabled', false);
		},
		success:function(resp){
console.log(resp,resp.status);
			if(resp.status == 0) {//succ
				//$('input[name="message"]').val('');
				$('.textarea-words').val(resp.data.join('|')).trigger('input');
			} else {
				tiper(resp.message, {
					timeout: 2,
					before: function(){
						$('input[name="message"]').data({value:$('input[name="message"]').val()}).val(' ');
					},
					callback: function() {
						$('input[name="message"]').val($('input[name="message"]').data('value'));
					}
				});
			}
		},
		error:function() {
			tiper('\u8bf7\u6c42\u5f02\u5e38', {
				timeout: 1.25,
				before: function() {
					$('input[name="message"]').data({value:$('input[name="message"]').val()}).val(' ');
				},
				callback: function() {
					$('input[name="message"]').val($('input[name="message"]').data('value'));
				}
			});/*请求异常*/
		}
	});
}

/**	功能 指定的元素出现交替效果
 *	@param id String 出现交替效果的元素id 必须
 *	@param count Integer 交替的次数(一进一出计为1次) 可选 缺省为3次
 *	@param before function 前置函数 元素交替效果之前执行的函数 可选 缺省为""
 *	@param callback function 回调函数 元素交替效果结束执行的函数 可选 缺省为""
 *	@param outtime Integer 交替in时间(单位:ms) 可选 缺省为200
 *	@param intime Integer 交替out时间(单位:ms) 可选 缺省为200
 *	@return void
 */
function inOut(id,count,before,callback,intime,outtime){
	var id = typeof id == 'undefined' ? null : (id.substr(0,1)=='#'?id:('#'+id));
	var count = typeof count == 'undefined' ? 3 : count;
	var intime = typeof intime == 'undefined' ? 250 : intime;
	var outtime = typeof outtime == 'undefined' ? 250 : outtime;
	if(!id || $(id).size() < 1) return;
	var counter = 0;
	var infun = function(){
		counter++;
		$(id).removeClass('error').addClass('error');
		setTimeout(outfun, intime);
	};
	var outfun = function(){
		$(id).removeClass('error');
		if(counter>=count){
			if(callback){
				if(typeof callback == 'function'){
					callback();
				}else{
					try{eval("callback()");}catch(e){}
				}
			}
			return;
		}
		setTimeout(infun, outtime);
	};
	var begining = function(){
		if(before){
			if(typeof before == 'function'){
				before();
			}else{
				try{eval("before()");}catch(e){}
			}
		}
		infun();
	};
	begining();
}

var TIPER_ST;
function tiper(msg, options) {
	var options = options || {};
	var defaults = {timeout:0,before:function(){},callback:function(){}}
	options = $.extend(defaults, options);
	var close = function() {
		if(typeof options.callback == 'function'){options.callback()}
		try{clearTimeout(TIPER_ST)}catch(e){}
		$('#tiper').hide().remove();
	};
	var show = function() {
		if(typeof options.before == 'function'){options.before()}
		$('<div id="tiper"><span>'+msg+'</span></div>').css({
			width: $('#msgform .message-input-wrap').width()+'px',
			height: $('#msgform .message-input-wrap').height()+'px',
			display: 'block',
			textAlign: 'left',
			fontSize: '0.8rem',
			position: 'absolute',
			left: 0,
			top: 0,
		}).unbind('click').click(function(){
			close()
		}).appendTo('#msgform');
		$('#tiper>span').css({
			width: $('#tiper').width()*96/100+'px',
			height: $('#tiper').height()+'px',
			display: 'table-cell',
			paddingLeft: $('#tiper').width()*4/100+'px',
			verticalAlign: 'middle',
			color: 'red'
		});
		if(options.timeout > 0) {
			TIPER_ST = setTimeout(function(){close()}, 1000*options.timeout);
		}
	}
	if($('#tiper').size() > 0) {
		close();
	}
	show();
}

var JSLOADED = [];
var evalscripts = [];
function $id(id) {
	return document.getElementById(id) ? document.getElementById(id) : null;
}
function isUndefined(val) {
	return typeof val == 'undefined' ? true : false;
}
function hash(string, length) {
	var length = length ? length : 32;
	var start = 0;
	var i = 0;
	var result = '';
	var filllen = length - string.length % length;
	for(i = 0; i < filllen; i++){
		string += "0";
	}
	while(start < string.length) {
		result = stringxor(result, string.substr(start, length));
		start += length;
	}
	return result;
}

function stringxor(s1, s2) {
	var s = '';
	var hash = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
	var max = Math.max(s1.length, s2.length);
	for(var i=0; i<max; i++) {
		var k = s1.charCodeAt(i) ^ s2.charCodeAt(i);
		s += hash.charAt(k % 52);
	}
	return s;
}
/**  add javascript
 *  @param src String
 *  @param text String
 *	@param callback function
 *  @param reload Int 0/1
 *  @param targetid String possible value{htmlhead,htmlbody,...}
 *  @param charset String
 *  @return void
 */
function appendscript(src, text, callback, reload, targetid, charset) {
	var src = isUndefined(src) ? '' : src;
	var text = isUndefined(text) ? '' : text;
	var callback = isUndefined(callback) ? '' : callback;
	var targetid = (isUndefined(targetid) || targetid == '' || targetid == null) ? 'htmlhead' : targetid;
	var reload = isUndefined(reload) ? 0 : (parseInt(reload) == 1 ? 1 : 0);
	var charset = isUndefined(charset) ? '' : charset;
	var id = hash(src + text);
	if(!src && !text) return;
	if(targetid != 'htmlhead' && targetid != 'htmlbody' && !$id(targetid)) return;
	if(!reload && in_array(id, evalscripts)) return;
	if(reload && $id(id)) {
		$id(id).parentNode.removeChild($id(id));
	}

	evalscripts.push(id);
	var scriptNode = document.createElement("script");
	scriptNode.type = "text/javascript";
	scriptNode.id = id;
	scriptNode.charset = charset ? charset : '';
	try {
		if(src) {
			scriptNode.src = src;
			scriptNode.onloadDone = false;
			scriptNode.onload = function () {
				scriptNode.onloadDone = true;
				JSLOADED[src] = 1;
				if(callback)
					try{eval('callback()')} catch(e) {}
			};
			scriptNode.onreadystatechange = function () {
				if((scriptNode.readyState == 'loaded' || scriptNode.readyState == 'complete') && !scriptNode.onloadDone) {
					scriptNode.onloadDone = true;
					JSLOADED[src] = 1;
					if(callback)
						try{eval('callback()')} catch(e) {}
				}
			};
		} else if(text){
			scriptNode.text = text;
		}
		if(targetid == 'htmlhead') {
			document.getElementsByTagName('head')[0].appendChild(scriptNode);
		} else if(targetid == 'htmlbody') {
			document.getElementsByTagName('body')[0].appendChild(scriptNode);
		} else {
			$id(targetid).appendChild(scriptNode);
		}
	} catch(e) {}
}
function isWeiXin(){
	if(window.navigator.userAgent.toLowerCase().match(/MicroMessenger/i) == 'micromessenger') {
		return true;
	}
	return false;
}
function getUrlArg(arg, url){
	var arg = isUndefined(arg) ? '' : arg;
	var url = isUndefined(url) || url === '' ? document.location.href : url;
	if(url.indexOf('?') == -1 || arg == '')
		return '';
	url = url.substr(url.indexOf('?')+1);
	var expr = new RegExp('(\\w+)=(\\w+)','ig');
	var args = [];
	var tmp = [];
	while((tmp = expr.exec(url)) != null){
		args[tmp[1]] = tmp[2];
	}
	return isUndefined(args[arg]) ? '' : args[arg];
}

function in_array(needle, haystack){
	if(typeof haystack == 'undefined')return false;
	if(typeof needle == 'string' || typeof needle == 'number'){
		for(var i in haystack){
			if(haystack[i] == needle){
				return true;
			}
		}
	}
	return false;
}

var dataForWeixinShare = {
    title: '帮你说',
    content: '中文转语音工具',
    imgurl: 'https://www.bolatoo.com/h5/sayword/static/i/sayer2.png',
    contenturl: 'https://www.bolatoo.com/h5/sayword/?ADTAG=tec.wc.sh'
}
var dataForWeixinShareTmp = {};
var bindShared = false;
function bindShare(dataForShare) {
	var title = dataForShare.title;
	var desc = dataForShare.content;
	var link = dataForShare.contenturl;
	var imgUrl = dataForShare.imgurl;
	wx.onMenuShareTimeline({
		title: desc,
		link: link,
		imgUrl: imgUrl,
		success: function (res) {
			try{MtaH5.clickStat('wxTimeline_succ')}catch(e){}
		},
		cancel: function (res) {
			try{MtaH5.clickStat('wxTimeline_cancel')}catch(e){}
		},
		fail: function (res) {
			try{MtaH5.clickStat('wxTimeline_fail')}catch(e){}
		}
	});
	wx.onMenuShareAppMessage({
		title: title,
		desc: desc,
		link: link,
		imgUrl: imgUrl,
		success: function (res) {
			try{MtaH5.clickStat('wxAppmessage_succ')}catch(e){}
		},
		cancel: function (res) {
			try{MtaH5.clickStat('wxAppmessage_cancel')}catch(e){}
		},
		fail: function (res) {
			try{MtaH5.clickStat('wxAppmessage_fail')}catch(e){}
		}
	});
	wx.onMenuShareQQ({
		title: title,
		desc: desc,
		link: link,
		imgUrl: imgUrl,
		success: function (res) {
			try{MtaH5.clickStat('wxShareQQ_succ')}catch(e){}
		},
		cancel: function (res) {
			try{MtaH5.clickStat('wxShareQQ_cancel')}catch(e){}
		},
		fail: function (res) {
			try{MtaH5.clickStat('wxShareQQ_fail')}catch(e){}
		}
	});
	wx.onMenuShareWeibo({
		title: title,
		desc: desc,
		link: link,
		imgUrl: imgUrl,
		success: function (res) {
			try{MtaH5.clickStat('wxShareWeibo_succ')}catch(e){}
		},
		cancel: function (res) {
			try{MtaH5.clickStat('wxShareWeibo_cancel')}catch(e){}
		},
		fail: function (res) {
			try{MtaH5.clickStat('wxShareWeibo_fail')}catch(e){}
		}
	});
	wx.onMenuShareQZone({
		title: title,
		desc: desc,
		link: link,
		imgUrl: imgUrl,
		success: function (res) {
			try{MtaH5.clickStat('wxShareQzone_succ')}catch(e){}
		},
		cancel: function (res) {
			try{MtaH5.clickStat('wxShareQzone_cancel')}catch(e){}
		},
		fail: function (res) {
			try{MtaH5.clickStat('wxShareQzone_fail')}catch(e){}
		}
	});
}

$(function () {
    dataForWeixinShareTmp = $.extend(dataForWeixinShareTmp, dataForWeixinShare);
    if (isWeiXin()) {
        appendscript('//res.wx.qq.com/open/js/jweixin-1.0.0.js', '', function () {
            appendscript('//www.bolatoo.com/api/weixin/jssdk/wxconfig.php?rurl=' + encodeURIComponent(document.location.href), '', function () {
                var wxconfig = window['wxconfig'] || '';
                if (wxconfig) {
                    wx.config({
                        appId: wxconfig.appId,
                        timestamp: wxconfig.timestamp,
                        nonceStr: wxconfig.nonceStr,
                        signature: wxconfig.signature,
                        jsApiList: ['onMenuShareTimeline','onMenuShareAppMessage','onMenuShareQQ','onMenuShareWeibo','onMenuShareQZone']
                    });
                    wx.ready(function () {
                        bindShare(dataForWeixinShareTmp);
                        bindShared = true;
                    });
                }
            });
        });
    }
	var placeholdText = '';
	var key = getUrlArg('_k');
	if (key && key.length > 0) {
			if (key == 'hh') {
					placeholdText = '胡胡快点吃狗粮';
					$('#message-input').val(placeholdText);
			}
			if (placeholdText.length > 0) {
					if (isWeiXin()) {
						dataForWeixinShareTmp.contenturl += ('&_k=' + key);
						var bindShareHandel = function() {
								if(bindShared) {
										setTimeout(function(){bindShare(dataForWeixinShareTmp)}, 50);
								} else {
										setTimeout(bindShareHandel, 100);
								}
						}
		}
					bindShareHandel();
					setTimeout(function(){
								$('#msgform').submit();
					});
			}
	}
});
