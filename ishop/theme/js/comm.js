/*控制dom显示隐藏,尽量用out和into函数，减少重排过程*/
(function($){
	$.fn.extend({
		"out": function(){
			return $(this).css({position:"absolute",left:"-9999px",top:"-9999px"});
		},
		"into": function(){
			return $(this).css({position:"static"});
		},
		"switchClass": function(del,add){
			return $(this).removeClass(del).addClass(add);
		}
	}); 
	
	/*浏览器检测（主要检测是不是IE6）*/
	$.extend({
		"isIE6": function(){
			return ($.browser.msie && $.browser.version=="6.0")?true:false;
		}
	});
})($);

//回到顶端
(function($){
	$.extend({
		"backToTop": function(){
			var backToTopBtnBox = $('<div id="sideBthnBg" class="side_btn_bg">'+
				'<a href="http://www.nbtv.cn/suggest/index.php" class="sugg_btn" title="我的建议"></a>'+
				'<a id="backTopBtn" class="back_top_btn" style="margin-top:2px;" href="javascript:;" title="回到顶部"></a>'+
				'</div>'),
				bodyAndHtml = $("body,html"),
				win = $(window),
				doc = $(document),
				docH = win.height(),
				docW = win.width(),
				eleTop = docH/2+100,
				eleLeft = docW/2+480,
				backToTopBtn = null;
				//docW = win.width(),
				//eleLeft = docW/2+480;
				//eleRight = 0;
			function init(){
				backToTopBtnBox.appendTo("body");
				backToTopBtn = $("#backTopBtn");
				positionBtn(backToTopBtnBox);
			};
			init();
			
			function positionBtn(ele){
				ele.css({"top":eleTop,"right":0});
				backToTopBtn.hide();
			}
			
			backToTopBtn.click(function(){
				bodyAndHtml.animate({scrollTop:0},200);
			});
			win.scroll(function(){
				win.scrollTop()>100?backToTopBtn.show():backToTopBtn.hide();
				if($.isIE6()){	
					backToTopBtnBox.css({"top":eleTop+doc.scrollTop(),"right":0});
				}
				
			})
		}
	});
})($);

//验证信息常用函数
(function($){
	$.extend({
		"isEmail": function(val){
			var reg = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
			return reg.test(val)?true:false;
		}
	});
})($);


/*幻灯片通用组件2012-7-4 王宇航
	ele表示最外层div

	eType:如何出发图片轮转参数可以为mouseover,click默认为mouseover

	type:图片轮换的类型，参数可以为show,fade,slide,默认为show

	slideDir：当图片轮转类型为slide的时候，slideDir可以设置为left,top
	
	triggerFun:触发图片轮转时可以执行的函数，比如触发按钮变色，改变边框样式等等
	
	调用函数如
	$.picSlide($(".tabPic"),{triggerFun:function(ele){
		$(".tabPic").parent().removeClass("on");
		ele.parent().addClass("on");
	}});
*/
(function($){
	$.extend({
		picSlide: function(ele,options){
			defaults = {
				eType : "mouseover",
				type : "show",
				slideDir : "left",
				speed : 300,
				delay : 5000,
				picBox : null,
				navBox : null,
				triggerFun : function(){}
			};
			
			var o = $.extend(defaults, options),
				picBox = null!=o.picBox?o.picBox:ele.find("ul:first"),
				navBox = null!=o.navBox?o.navBox:ele.find("ul:last"),
				picArr = $(picBox).children(),
				navArr = $(navBox).children(),
				h = $(picArr[0]).height(),
				w = $(picArr[0]).width(),
				tabPic = function(){},
				funSetTime = function(){};//用于时间循环函数的重写。
				
			function init(){
				navArr.each(function(index){
					$(this).attr("rel",index);
				});
				
				if(o.type === "show"){
					$(picArr).css({"position":"absolute","left":"0","top":"0"});
					tabPic = showTab;
				}else if(o.type === "fade"){
					$(picArr).css({"position":"absolute","left":"0","top":"0"});
					$(picArr[0]).css("z-index",2);
					!$.isIE6()?tabPic = fadeTab:tabPic = showTab;
				}else if(o.type === "slide"){
					if(o.slideDir === "left"){
						$(picBox).css("width",9999);
						$(picArr).css("float","left");
						tabPic = slideLeftTab;
					}else if(o.slideDir === "top"){
						tabPic = slideTopTab;
					}
				}
				
				setTimeFun(0);//定时函数，定时进行图片轮状
			};
			init();
			
			function showTab(curIndex){
				$(picArr[curIndex]).show().siblings().hide();
			};
			
			function fadeTab(curIndex){
				var curEle = $(picArr[curIndex]);
				curEle.siblings().stop(true,true).css("z-index",1).fadeTo(o.speed,0);
				curEle.stop(false,true).fadeTo(o.speed,1);
			};
			
			function slideLeftTab(curIndex){
				$(picBox).stop(true,true).animate({
					"margin-left": -(curIndex*w)+"px"
				},o.speed);
			};
			
			function slideTopTab(curIndex){
				$(picBox).stop(true,true).animate({
					"margin-top": -(curIndex*h)+"px"
				},o.speed);
			};
			
			function on(ele){
				ele.siblings().removeClass("on");
				ele.addClass("on");
			};
			
			function setTimeFun(index){
				funSetTime = setInterval(function(){
					tabPic(index);
					on($(navArr[index]));
					index = (index >= ($(navArr).length-1)?0:index+1);
					o.triggerFun();
				},o.delay);
			};
			
			navArr.bind(o.eType,function(){
				clearInterval(funSetTime);
				on($(this));
				tabPic($(this).attr("rel"));
				o.triggerFun();
			});
			navArr.bind("mouseout",function(){
				clearInterval(funSetTime);
				setTimeFun(parseInt($(navBox).children(".on").attr("rel")));
			});
		}
	});
})($);

/*滚动*/
(function($){
	$.extend({
		picScroll: function(preBtn,nextBtn,target,options){
			defaults = {
				dir : "left",
				speed : 500,
				delay : 5000
			};
			
			var o = $.extend(defaults, options),
				targetArr = target.children(),
				l = targetArr.length,
				h = parseInt($(targetArr[0]).height()),
				w = parseInt($(targetArr[0]).width()),
				scrollFun = function(){},
				funSetTime = function(){};//用于时间循环函数的重写。
				
			function init(){
				if(preBtn != null && nextBtn != null){
					o.dir==="left"?scrollLeft():scorllTop();
				}
				setTimeFun();
			};
			init();
			
			function moveFun(maxMargin,curMargin,moveDirection){
				if(moveDirection === "right"){
					if(curMargin > (maxMargin+w)){
						target.animate({"margin-left":curMargin-w},o.speed);
					}else{
						var cloneEle = target.children().first().clone();
						target.append(cloneEle);
						target.animate({"margin-left":curMargin-w},o.speed,function(){
							target.css({"margin-left":0});
							cloneEle.detach();
						});
					}
				}else if(moveDirection === "left"){
					if(curMargin < 0){
						target.animate({"margin-left":curMargin+w},o.speed)
					}else{
						var cloneEle = target.children().last().clone();
						cloneEle.css({"margin-left":-w});
						target.prepend(cloneEle);
						target.animate({"margin-left":curMargin+w},o.speed,function(){
							target.css({"margin-left":maxMargin+w});
							cloneEle.detach();
						});
					}
				}else if(moveDirection === "up"){
					if(curMargin < 0){
						target.animate({"margin-top":curMargin+h},o.speed);
					}else{
						var cloneEle = target.children().last().clone();
						cloneEle.css({"margin-top":-h});
						target.prepend(cloneEle);
						target.animate({"margin-top":curMargin+h},o.speed,function(){
							target.css({"margin-top":maxMargin+h});
							cloneEle.detach();
						});
					}
				}else if(moveDirection === "down"){
					if(curMargin > (maxMargin+h)){
						target.animate({"margin-top":curMargin-h},o.speed)
					}else{
						var cloneEle = target.children().first().clone();
						target.append(cloneEle);
						target.animate({"margin-top":curMargin-h},o.speed,function(){
							target.css({"margin-top":0});
							cloneEle.detach();
						});
					}
				}else{return false}
			};
			
			function scrollLeft(){
				var maxMl = (-l*w);
				preBtn.click(function(){
					target.stop(true,true);
					var curMl = parseInt(target.css("margin-left"));
					moveFun(maxMl,curMl,"left");
				});
				nextBtn.click(function(){
					target.stop(true,true);
					var curMl = parseInt(target.css("margin-left"));
					moveFun(maxMl,curMl,"right");
				});
			};
			
			function scorllTop(){
				var maxMt = (-l*h);
				preBtn.click(function(){
					target.stop(true,true);
					var curMt = parseInt(target.css("margin-top"));
					moveFun(maxMt,curMt,"up");
				});
				nextBtn.click(function(){
					target.stop(true,true);
					var curMt = parseInt(target.css("margin-top"));
					moveFun(maxMt,curMt,"down");
				});
			};
			
			function setTimeFun(){
				if(o.dir === "left"){
					funSetTime = setInterval(function(){
						target.stop(true,true);
						var maxMl = (-l*w),
							curMl = parseInt(target.css("margin-left"));
						moveFun(maxMl,curMl,"right");
					},o.delay);
				}else{
					funSetTime = setInterval(function(){
						target.stop(true,true);
						var maxMt = (-l*h),
							curMt = parseInt(target.css("margin-top"));
						moveFun(maxMt,curMt,"down");
					},o.delay);
				}
				
			};
			
			target.mouseover(function(){
				clearInterval(funSetTime);
			});
			
			target.mouseout(function(){
				clearInterval(funSetTime);
				setTimeFun();
			});
			
			preBtn?preBtn.mouseover(function(){
				clearInterval(funSetTime);
			}):null;
			
			preBtn?preBtn.mouseout(function(){
				clearInterval(funSetTime);
				setTimeFun();
			}):null;
			
			nextBtn?nextBtn.mouseover(function(){
				clearInterval(funSetTime);
			}):null;
			
			nextBtn?nextBtn.mouseout(function(){
				clearInterval(funSetTime);
				setTimeFun();
			}):null;
		}
	});
})($);

/*
选项卡插件
ele:选项卡class数组
target:选项卡对应显示隐藏内容class数组
使用的时候，必须给每个内容框加上id并在选项卡上加上对应的rel，rel对应id的值
*/
(function($){
	$.extend({
		tabBox: function(ele,target,options){
			defaults = {
				eType : "click"
			};
			
			var o = $.extend(defaults, options);
			
			$(ele).bind(o.eType,function(){
				$(ele).removeClass("cur");
				$(this).addClass("cur");
				$(target).out();
				$("#"+$(this).attr("rel")).into();
			});
		}
	});
})($);

/*全站通用ajax*/
(function($){
	$.extend({
		ajaxPost: function(options){
			defaults = {
				url: "",
				data:{},
				type:"post",
				dataType:"json",
				callback: function(result){}
			};
			var o = $.extend(defaults, options);
			function init(){
				$.ajax({
					url: o.url,
					type: o.type,
					data: o.data,
					dataType: o.dataType,
					success: function(result){
						result.html?window.open(result.html,"_self"):o.callback(result);
					}
				});
			}
			init();
		}
	});
})($);

//pop layer
(function($){
	$.extend({
		open: function(options){
			defaults = {
				html: "",
				openFun: function(){},
				closeFun: function(){}
			};
			
			var o = $.extend(defaults,options),
				$bg = $('<div id="popLayerBg" class="pop_layer_bg" style="width:100%;"></div>'),
				$box = $('<div id="popLayerBox" class="pop_layer_box"><div class="tr"><a id="popCloseBtn" class="pop_box_close wb_close" href="javascript:;"><img src="http://www.nbtv.cn/res/ming/image/icon_close.gif" /></a></div><div id="popContent" class="pop_content"></div></div>');
			function init(){
				var $bgELe = $("#popLayerBg"),
					$boxEle = $("#popLayerBox");
				//第一次创建pop层
				if($bgELe.length === 0 && $boxEle.length === 0){
					$(document.body).append($bg);
					$(document.body).append($box);
					$bgELe = $("#popLayerBg");
					$boxEle = $("#popLayerBox");
					$("#popCloseBtn").click(function(){closeBox($bgELe,$boxEle)});
				}
				//加入html代码
				$("#popContent").html(o.html);
				//重定位pop层
				resetPosition($bgELe,$boxEle);
				o.openFun();
			}
			init();
			
			function closeBox($bgEle,$boxEle){
				$bgEle.out();
				$boxEle.out();
				o.closeFun();
			}
			
			function resetPosition($bgEle,$boxEle){
				var w = parseInt($(document).width()),
					boxW = parseInt($boxEle.width()),
					scrollTop = (document.documentElement.scrollTop || document.body.scrollTop),
					boxEleH = $boxEle.height(); 
				$boxEle.css({position:"absolute",top:50+parseInt(scrollTop),left:(w-boxW)/2});
				var clientH = $(document.body).height(),
					h = $(document).height();
				$bgEle.css({position:"absolute",top:0,left:0,height:parseInt(h)});
			}
		}
	})
})($);

/*******************************************常用插件*******************************************************************************/
/*jquery操作cookie*/
(function($){
	$.cookie = function(name, value, options){
		if (typeof value != 'undefined') { // name and value given, set cookie 
			options = options || {};
			if (value === null) {
				value = '';
				options.expires = -1;
			}
			var expires = '';
			if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
				var date;
				if (typeof options.expires == 'number') {
					date = new Date();
					date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
				} else {
					date = options.expires;
				}
				expires = '; expires=' + date.toUTCString(); // use expires attribute, max-age is not supported by IE 
			}
			var path = options.path ? '; path=' + options.path: '';
			var domain = options.domain ? '; domain=' + options.domain: '';
			var secure = options.secure ? '; secure': '';
			document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
		} else { // only name given, get cookie 
			var cookieValue = null;
			if (document.cookie && document.cookie != '') {
				var cookies = document.cookie.split(';');
				for (var i = 0; i < cookies.length; i++) {
					var cookie = jQuery.trim(cookies[i]);
					// Does this cookie string begin with the name we want? 
					if (cookie.substring(0, name.length + 1) == (name + '=')) {
						cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
						break;
					}
				}
			}
			return cookieValue;
		}
	};
	function getcookie(name) {
		var cookie_start = document.cookie.indexOf(name);
		var cookie_end = document.cookie.indexOf(";", cookie_start);
		return cookie_start == -1 ? '': unescape(document.cookie.substring(cookie_start + name.length + 1, (cookie_end > cookie_start ? cookie_end: document.cookie.length)));
	}
	function setcookie(cookieName, cookieValue, seconds, path, domain, secure) {
		var expires = new Date();
		expires.setTime(expires.getTime() + seconds);
		document.cookie = escape(cookieName) + '=' + escape(cookieValue) + (expires ? '; expires=' + expires.toGMTString() : '') + (path ? '; path=' + path: '/') + (domain ? '; domain=' + domain: '') + (secure ? '; secure': '');
	}
})($);
