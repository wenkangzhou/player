/*
*TODO 按钮的UI
*/
;(function (exports){
	var Player = function (el, config){
		audio = el;
		this.config = config;
		this.index = config.index,
		this.musicMode = config.musicMode,
		this.init();
	}
	Player.prototype = {
		className:{
			"play": $('.play'),
			"pause": $('.pause'),
			"volume": $('.volume'),
			"progress": $('.progress'),
			"prev": $('.prev'),
			"next": $('.next'),
			"repeat": $('.repeat'),
			"shuffle": $('.shuffle'),
			"list": $('.list')
		},
		init: function(){
			this.initButton();
			this.initPlayer(this.index-1);
			audio.volume = 0.8;
			audio.addEventListener('canplay',this.bufferBar.bind(this),false);
			isMobile() && addClass($('.volume'),'hidden');//如果为移动端，隐藏音量控制
			this.bind();
		},
		initButton: function(){
			var buttons = this.config.button;
			for(var i in buttons){
				buttons[i]?removeClass($("."+i),'hidden'):addClass($("."+i),'hidden');
				if(buttons[i] && i == "volume"){
					$(".volume").style.color = "red";
				}else if (buttons[this.musicMode]){
					$("."+this.musicMode).style.color = "red";
				}
			}

		},
		initPlayer: function(index){
			var playList = this.config.playList;
			//音乐路径
			audio.setAttribute('src',playList[index].musicURL);
			//歌手
			$('.artist_name').innerHTML = playList[index].artist;
			//专辑封面
			$('.round_wrapper img').setAttribute('src',playList[index].coverURL);
			//歌名
			$('.music_name').innerHTML = playList[index].musicName;
			//进度条
			$('.progress_now').style.width =   0 +'px';
			//缓冲进度条
			audio.removeEventListener('canplay',this.bufferBar,false);
			clearInterval(this.bufferTimer);
			$('.progress_buf').style.width = 0 +'px';
		},
		bind: function(){
			var me = this;
			audio.addEventListener("progress", function() {
				console.log("progress")
			}, false);
			audio.addEventListener("loadeddata", function() {
				console.log("loadeddata")
			}, false);
			//时间更新
			audio.addEventListener("timeupdate", function() {
				console.log("timeupdate")
				if (!isNaN(audio.duration)) {
					//剩余时间
					var surplus = audio.duration-audio.currentTime;
					var surplusMin = parseInt(surplus/60);
					var surplusSecond = parseInt(surplus%60);
					if (surplusSecond < 10 ) {
						surplusSecond = '0'+surplusSecond;
					};
					$('.time').innerHTML = "-" + surplusMin + ":" +surplusSecond;
					//播放进度条
					var progressValue = audio.currentTime/audio.duration*document.body.clientWidth;
					$('.progress_now').style.width = parseInt(progressValue) + 'px';
				};
			}, false);
			audio.addEventListener("durationchange", function() {
				console.log("durationchange")
			}, false);
			audio.addEventListener("play", function() {
				console.log("play")
			}, false);
			audio.addEventListener("playing", function() {
				console.log("playing")
			}, false);
			audio.addEventListener("pause", function() {
				console.log("pause")
			}, false);
			audio.addEventListener("waiting", function() {
				console.log("waiting")
			}, false);
			audio.addEventListener("seeking", function() {
				console.log("seeking")
			}, false);
			audio.addEventListener("seeked", function() {
				console.log("seeked")
			}, false);
			audio.addEventListener("volumechange", function() {
				console.log("volumechange")
			}, false);
			audio.addEventListener("ratechange", function() {
				console.log("ratechange")
			}, false);
			audio.addEventListener("suspend", function() {
				console.log("suspend")
			}, false);
			//播放结束
			audio.addEventListener("ended", function() {
				console.log("ended")
				me.playMusicMode('ended');
			}, false);
			audio.addEventListener("error", function() {
				console.log("error")
			}, false);


			//方案1 
			// for(var i in this.className){
			// 	this.className[i].addEventListener("click",function(i){
			// 		return function(){
			// 			switch(i){
			// 				case "play":console.log("*play*");break;
			// 				case "pause":console.log("*pause*");break;
			// 				case "volume":console.log("*volume*");break;
			// 				case "progressbar":console.log("*progressbar*");break;
			// 				case "prev":console.log("*prev*");break;
			// 				case "next":console.log("*next*");break;
			// 				case "repeat":console.log("*repeat*");break;
			// 				case "shuffle":console.log("*shuffle*");break;
			// 				case "list":console.log("*list*");break;
			// 				default: console.log("*error*");break;
			// 			}
			// 		}
			// 	}(i));
			// }
			//方案2
			// for(var i in this.className){
			// 	(function(i) {
			// 		me.className[i].addEventListener("click",function(){
			// 			switch(i){
			// 				case "play":console.log("*play*");break;
			// 				case "pause":console.log("*pause*");break;
			// 				case "volume":console.log("*volume*");break;
			// 				case "progressbar":console.log("*progressbar*");break;
			// 				case "prev":console.log("*prev*");break;
			// 				case "next":console.log("*next*");break;
			// 				case "repeat":console.log("*repeat*");break;
			// 				case "shuffle":console.log("*shuffle*");break;
			// 				case "list":console.log("*list*");break;
			// 				default: console.log("*error*");break;
			// 			}
			// 		})
			// 	})(i)
			// }

			//播放、暂停
			this.className["play"].addEventListener("click",function(){
				if(hasClass(this,"pause")){
					audio.pause();
					removeClass($('.play'),'pause');
					removeClass($(".rotate"),'rotate_run');
				}else{
					audio.play();
					addClass($('.play'),'pause');
					addClass($('.rotate'),'rotate_run');
				}
			})
			//调整播放时间
			this.className["progress"].addEventListener("click",function(ev){
				me.adjustPorgress(this,ev);
			})
			//是否静音
			this.className["volume"].addEventListener("click",function(){
				if(audio.muted){
					this.style.color = "black";
					this.innerHTML = "音量开";
					audio.muted = false;
				}else{
					this.style.color = "red";
					this.innerHTML = "音量关";
					audio.muted = true;
				}
			})
			//上一首
			this.className["prev"].addEventListener("click",function(){
				me.playMusicMode('prev');
			})
			//下一首
			this.className["next"].addEventListener("click",function(){
				me.playMusicMode('next');
			})
			//重播
			this.className["repeat"].addEventListener("click",function(){
				me.changeMusicMode(this,'repeat');
			})
			//随机
			this.className["shuffle"].addEventListener("click",function(){
				me.changeMusicMode(this,'shuffle');
			})
			//列表
			this.className["list"].addEventListener("click",function(){
				me.changeMusicMode(this,'list');
			})
		},
		//缓冲槽
		bufferBar:function(){
			var me = this;
			this.bufferTimer = setInterval(function(){
				var bufferIndex = audio.buffered.length;
				if (bufferIndex > 0 && audio.buffered != undefined) {
					var bufferValue = audio.buffered.end(bufferIndex-1)/audio.duration*document.body.clientWidth;
					$('.progress_buf').style.width = parseInt(bufferValue)+'px';
					if (Math.abs(audio.duration - audio.buffered.end(bufferIndex-1)) <1) {
						$('.progress_buf').style.width = document.body.clientWidth+'px';
						clearInterval(me.bufferTimer);
					};
				};
			},1000);
		},
		//调整播放时间
		adjustPorgress:function(dom,ev){
			var event = window.event || ev;
			var progressX = event.clientX - dom.getBoundingClientRect().left;
			audio.currentTime = parseInt(progressX/324*audio.duration);
			audio.removeEventListener('canplay',this.bufferBar,false);
		},
		//切换上下曲
		playMusicMode: function(action){
			var musicNum = this.config.playList.length;
			var index = this.index;
			var musicMode = this.musicMode;
			//列表循环
			if (musicMode == 'list' ) {
				if (action == 'prev') {
					if (index == 1) { //如果是第一首歌，跳到最后一首
						index = musicNum;
					}
					else{
						index -= 1;
					}
				}
				else if (action == 'next' || action == 'ended') {
					if (index == musicNum) {//如果是最后一首歌，跳到第一首
						index = 1;
					}
					else{
						index += 1;
					}
				};
			};

			//随机播放
			if (musicMode == 'shuffle') {
				var randomIndex = parseInt(musicNum * Math.random());
				index = randomIndex + 1;
				if (index == musicIndex) {//下一首和当前相同，跳到下一首
					index += 1;
				};
			};

			//单曲循环
			if (musicMode == 'repeat') {
				if (action == 'prev') {
					if (index == 1) { //如果是第一首歌，跳到最后一首
						index = musicNum;
					}
					else{
						index -= 1;
					}
				}
				else if (action == 'next') {
					if (index == musicNum) {//如果是最后一首歌，跳到第一首
						index = 1;
					}
					else{
						index += 1;
					}
				}else{
					//if ended 如果是播放结束自动跳转，不做操作
				}
			};

			this.index = index;
			this.playIndex(index-1);
		},
		//播放指定位置的歌曲
		playIndex: function(index){
			this.initPlayer(index);
			audio.load();
			audio.addEventListener('canplay',this.bufferBar.bind(this),false);
			audio.play();
			removeClass($('.pause'),'hidden');
			addClass($('.play'),'hidden');
		},
		//播放模式切换
		changeMusicMode:function(dom,mode){
			this.musicMode = mode;
			var option = document.getElementsByClassName("musicmode");
			for (var i = 0; i < option.length; i++) {
				option[i].style.color = 'black';
			};
			dom.style.color = 'red';
		}
	}
	//默认配置
	var defConfig = {
		scope: "#audio",
		index: 1,
		musicMode: "repeat",
		button:{
			"repeat":true,
			"list":true,
			"prev":true,
			"next":true,
			"shuffle":true,
			"volume":true
		},
		playList:[
			{
				"artist" : "万能青年旅店",
				"musicName" : "揪心的玩笑与漫长的白日梦",
				"musicURL" : "resource/audio/1.m4a",
				"coverURL" : "images/1.jpg"
			},
			{
				"artist" : "张玮玮",
				"musicName" : "米店",
				"musicURL" : "resource/audio/2.m4a",
				"coverURL" : "images/2.jpg"
			}
		]
	}
	//输出
	exports.Player = function (config){
		var opts = extend({}, defConfig, config);
		return new Player($(opts.scope),opts);
	}

	/*********************************
	*     封装组件要用到的一些方法
	**********************************/

	//判断是否为移动端
	function isMobile()  
	{  
        var userAgentInfo = navigator.userAgent;  
        var Agents = new Array("Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod");  
        var flag = false;  
        for (var v = 0; v < Agents.length; v++) {  
           	if (userAgentInfo.indexOf(Agents[v]) > 0) { 
           		flag = true; 
           		break; 
           	}  
        }  
        return flag;  
	}    
	//选择器
	function $(ele){
		return document.querySelector(ele);
	}
	//深复制
	function extendDeep(parent,child){
		var i,
			toStr = Object.prototype.toString,
			astr = "[object Array]";
		child = child || {};

		for(i in parent){
			if(parent.hasOwnProperty(i)){
				if(typeof parent[i] === "object"){
					child[i] = (toStr.call(parent[i]) === astr)?[]:{};
					extendDeep(parent[i],child[i]);
				}else{
					child[i] = parent[i];
				}
			}
		}
		return child;
	}

	function extend(){
		var _result = {},
	        arr = arguments;
	    if (!arr.length) return {};
	    for (var i = arr.length - 1; i >= 0; i--) {
	        _result = extendDeep(arr[i], _result);
	    }
	    return _result;
	}

	//对class操作的工具函数
	function hasClass(dom,className){
		var classNum = dom.className.split(" "),
			hasClass;

		for (var i = 0; i < classNum.length; i++) {
			if (classNum[i] == className) {
				hasClass = true;
				break;
			}
			else{
				hasClass = false;
			};
		};

		return hasClass;
	}

	function addClass(dom,className){
		if (!hasClass(dom,className)) {
			dom.className += " " + className;
		};
	}

	function removeClass(dom,className){
		if (hasClass(dom,className)) {
			var classNum = dom.className.split(" ");
			for (var i = 0; i < classNum.length; i++) {
				if (classNum[i] == className) {
					classNum.splice(i,1);
					dom.className = classNum.join(" ");
					break;
				};
			};
		};
	}

	function replaceClass(dom,className,replaceClass){
		if (hasClass(dom,className)) {
			var classNum = dom.className.split(" ");
			for (var i = 0; i < classNum.length; i++) {
				if (classNum[i] == className) {
					classNum.splice(i,1,replaceClass);
					dom.className = className.join(" ");
					break;
				};
			};
		};
	}

})(window)