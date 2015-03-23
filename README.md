# A HTML5 Player
##调用
```javascript
Player({
	scope: "#audio",//audio标签的dom
	index: 1,//播放顺序，从1开始
	musicMode: "repeat",//播放模式，repeat:循环；list:列表；shuffle:随机
	button:{//需要显示隐藏的按钮，true为显示，false为隐藏
		"repeat":true,//循环播放按钮
		"list":true,//列表播放按钮
		"shuffle":true,//随机播放按钮
		"prev":true,//上一首按钮
		"next":true,//下一首按钮
		"volume":true//音量按钮
	},
	playList:[//曲目信息
		{
			"artist" : "万能青年旅店",//演唱者
			"musicName" : "揪心的玩笑与漫长的白日梦",//歌曲名
			"musicURL" : "resource/audio/1.m4a",//歌曲url
			"coverURL" : "images/1.jpg"//专辑封面url
		},
		{
			"artist" : "张玮玮",//演唱者
			"musicName" : "米店",//歌曲名
			"musicURL" : "resource/audio/2.m4a",//歌曲url
			"coverURL" : "images/2.jpg"//专辑封面url
		}
	]
})
```
