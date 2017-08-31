var jc=jc||{};
    jc.js=jc.js||{};
    jc.js.util=jc.js.util||{};
$("a").prop("href","");
!(function(nameSpace){
	function WafSimpleMenu(){
		this.pageName = "test";
	}
	window.openAll = false;
	var $tb_d = $("td b");
	var $td = $("td");
	var $body = $("body");
	var menuHtml = $tb_d.eq(0).html();
	var userHtml = $td.eq(1).html();
	var simpleMenuInited = false;

	//为了方便在html字符串上绑定事件，把该方法暴露给window对象
	WafSimpleMenu.prototype.toggleSimpleMenu = function(closed,animat,noOpen){
		if(!simpleMenuInited){
			this.initSimpleMenu(closed,animat,noOpen);
			simpleMenuInited = true;
			this.initStatus();
		}else{
			this.removeSimpleMenu();
			simpleMenuInited = false;
		}
	};
	//关闭简易菜单
	WafSimpleMenu.prototype.closeSimpleMenu = function(time){
		$('.waf-simple-menu').animate({"left":"-300px"},time);
		$('.waf-scrollbar-cover').animate({"left":"-20px"},time);
		$('.waf-menu-toggler').animate({"left":"0px"},time).html("展开菜单");
		$('.waf-menu-Totop').animate({"left":"-60px"},time);
		$body.animate({"left":"0px"},time);
		setCookie(this.pageName+"_noOpen",1,'d30');
	};
	//打开简易菜单
	WafSimpleMenu.prototype.openSimpleMenu = function(time){
		$('.waf-scrollbar-cover').animate({"left":"282px"},time);
		$('.waf-menu-toggler').animate({"left":"299px"},time).html("收起菜单");
		$('.waf-simple-menu').animate({"left":"0px"},time);
		$('.waf-menu-Totop').animate({"left":"240px"},time);
		$body.animate({"left":"300px"},time);
		setCookie(this.pageName+"_noOpen",0,'d30');
	};
	//初始化菜单
	WafSimpleMenu.prototype.initSimpleMenu = function(closed,animat,noOpen){
		var _this = this;
		setCookie("waf_simple_menu","true",'d30');
		var simpleMenuItem = this.initSimpleMenuItem();
		//菜单容器
		var div = $("<div class='waf-simple-menu'></div>");
		//登录用户、退出登录
		div.append($td.eq(1).html().replace(/&nbsp;/g,''));
		//初始化菜单功能项
		var controlsStr = 	"<p style='text-align: center'>\
								<label><input waf-auto-retract=0 checked name='auto-retract' value='1' type='radio' />自动收起菜单 | </label>\
								<label><input waf-auto-retract=1 name='auto-retract' value='0' type='radio' />不自动收起菜单</label>\
							</p>\
							<p style='text-align: center'><button class='open-all-group'>展开所有菜单</button><br></p>";
		div.append(controlsStr);
		div.append(simpleMenuItem);
		div.append("<div title='返回顶部' class='waf-menu-Totop'><span class='iconfont icon-xiangshang'></span></div>");
		$body.append("<div class='waf-menu-toggler'>展开菜单</div>");
		//$body.append("<div class='waf-scrollbar-cover'></div>");
		//清空原来菜单与添加新菜单
		$tb_d.eq(0).html("<p style='text-align:center;padding:12px;'><button onclick='toggleSimpleMenu(true)'>切换到平铺菜单</button><p>");
		$tb_d.eq(0).append(div);
		$td.eq(1).html('');
		div.find('ul').hide();
		//html就绪后打开菜单
		if(noOpen === '1'){
			this.bindEvent(closed);
		}else{
			if(animat===false){
				setTimeout(function(){
					_this.openSimpleMenu(0);
				},20);
				this.bindEvent(false);
			}else{
				setTimeout(function(){
					_this.openSimpleMenu(200);
				},20);
				this.bindEvent(closed);
			}
		}

	};
	//还原到原来菜单
	WafSimpleMenu.prototype.removeSimpleMenu = function(){
		setCookie("waf_simple_menu","false",'d30');
		this.closeSimpleMenu(200);
		setTimeout(function(){
			$tb_d.eq(0).html(menuHtml);
			$td.eq(1).html(userHtml);
			$td.eq(0).css({"width":"auto"});
			$tb_d.eq(0).append("<p style='text-align:center;margin:0;padding:12px;'><button onclick='toggleSimpleMenu(false)'>切换到缩略菜单</button><p>");
			$('.waf-scrollbar-cover').remove();
			$('.waf-menu-toggler').remove();
			$body.css({"overflow-y":"auto","width":$body.width("auto")})
		},250);
	};
	//绑定事件
	WafSimpleMenu.prototype.bindEvent = function(closed){
		var _this = this;
		$('.menu-item').on("click",function(){
			_this.toggleMenuItem.call(this,true)
			_this.checkOpenAll();
			_this.setOpensCookie();
		});
		$(".waf-simple-menu").hover(function(){
			$body.css({"overflow-y":"hidden","width":$body.width()});
		},function(){
			$body.css({"overflow-y":"auto","width":$body.width("auto")});
		});
		$(".waf-menu-toggler").on("click",function(){
			if(closed){
				setTimeout(function(){
					_this.openSimpleMenu(200);
				},20);
				closed = false;
			}else{
				_this.closeSimpleMenu(200);
				closed = true;
			}
		});
		$("[name='auto-retract']").on("change",function(){
			setCookie(_this.pageName+"_auto_retract",$(this).attr("waf-auto-retract"),'d30');
			$('.menu-item').unbind("click");
			if(this.value === '1'){
				$('.menu-item').on("click",function(){
					_this.toggleMenuItem.call(this,true);
					_this.checkOpenAll();
					_this.setOpensCookie();
				});
			}else{
				$('.menu-item').on("click",function(){
					_this.toggleMenuItem.call(this,false);
					_this.checkOpenAll();
					_this.setOpensCookie();
				});
			}
		});
		$(".open-all-group").on("click",function(){
			openAll = !openAll;
			$("[name='auto-retract']").eq(1).click();
			if(openAll){
				$(".menu-group").find("ul").show(200);
				$(".menu-group").find(".iconfont").removeClass("icon-shouqi").addClass("icon-zhankai");
			}else{
				$(".menu-group").find("ul").hide(200);
				$(".menu-group").find(".iconfont").removeClass("icon-zhankai").addClass("icon-shouqi");
			}
			_this.setOpensCookie();
		});
		$(".waf-simple-menu").on("scroll",function(){
			var scrollTop = $(this).scrollTop();
			setCookie(_this.pageName+"_scrollTop",scrollTop,'d30');
			if(scrollTop>=300){
				$(".waf-menu-Totop").fadeIn(200);
			}else{
				$(".waf-menu-Totop").fadeOut(200);
			}
		});
		$(".waf-menu-Totop").on("click",function(){
			$(".waf-simple-menu").animate({"scrollTop":0},200);
		});
		$(".menu-group a").on("click",function(e){
			e.preventDefault();
			var href = $(this).prop("href");
			$(".menu-group li").css("background-color","transparent");
			$(this).parent().addClass("c190218250");
			var itemGroup = $(this).parent().parent().parent().attr("waf-index");
			var item = $(this).parent().attr("waf-index");
			setCookie(pageName+"_last_click_itemGroup",itemGroup,'d30');
			setCookie(pageName+"_last_click_item",item,'d30');
			location.href = href;
		});
		$(".menu-group a").hover(function(){
			if($(this).parent().is(".c190218250"))
				return;
			$(this).addClass("ddd")
		},function(){
			$(this).removeClass("ddd")
		});
		$(".menu-item").hover(function(){
			if($(this).is(".skyblue"))
				return;
			$(this).addClass("ddd")
		},function(){
			$(this).removeClass("ddd")
		});
	};
	//将原来菜单的html转换成数组
	WafSimpleMenu.prototype.getMenuItemArr = function(){
		return menuHtml.replace(/\t/g,'').replace(/\n/g,'').replace(/[:|：]/g,'').split("<br>").reduce(function(a,b,c){
			a.push(b.replace(/\/font><a/g,"/font>|||<a").replace(/\/a><a/g,"/a>|||<a").split("|||"));
			return a;
		},[]);
	};
	//生成简易菜单html
	WafSimpleMenu.prototype.initSimpleMenuItem = function(){
		return this.getMenuItemArr().reduce(function(a,b,c){
			a += "<div waf-index="+c+" class='menu-group'>\
				<p class='menu-item'>\
				<span class='iconfont icon-shouqi'></span><span>"
				+$(b[0]).text()+"</span></p><ul>"
				+b.reduce(function(q,w,e){
				q += "<li waf-index="+e+">";
				q += w;
				q += "</li>";
				return q;
			},'');
			a += "</ul></div>";
			return a;
		},"");
	};
	//记录展开的菜单项
	WafSimpleMenu.prototype.setOpensCookie = function(){
		var opens = '';
		$(".icon-zhankai").each(function(i,e){
			opens += $(e).parent().parent().attr("waf-index");
			opens += ",";
		});
		setCookie(this.pageName+"_opens",opens,'d30');
	};
	//检查是否所有菜单都被展开
	WafSimpleMenu.prototype.checkOpenAll = function(){
		openAll = !($(".icon-shouqi").length>0);
	};
	//展开或关闭菜单项
	WafSimpleMenu.prototype.toggleMenuItem = function(autoRetract){
		$(this).parent().find('ul').toggle(200);
		$(this).parent().find('.iconfont').toggleClass("icon-shouqi").toggleClass("icon-zhankai");
		$(this).removeClass("ddd").addClass("skyblue").parent().siblings().find('.menu-item').removeClass("skyblue");
		if(autoRetract){
			$(this).parent().siblings().find('.iconfont').addClass("icon-shouqi").removeClass("icon-zhankai");
			$(this).parent().siblings().find('ul').hide(200);
		}
		setCookie(pageName+"_last_click_itemGroup",$(this).parent().attr("waf-index"),'d30');
	};
	//显示菜单后还原以前状态
	WafSimpleMenu.prototype.initStatus = function(){
		var _this = this;
		var waf_auto_retract = getCookie(this.pageName+"_auto_retract");
		waf_auto_retract && $("[name='auto-retract']").eq(waf_auto_retract).click();
		openAll && $(".open-all-group").html("收起所有菜单");

		var opens = getCookie(this.pageName+"_opens");
		if(opens){
			var opensArr = opens.split(",");
			opensArr.pop();
			for(var i = 0; i < opensArr.length; i++){
				$(".menu-item").eq(opensArr[i]).parent().find('ul').show(200);
				$(".menu-item").eq(opensArr[i]).parent().find(".iconfont").removeClass("icon-shouqi").addClass("icon-zhankai");
			}
		}
		this.checkOpenAll();

		setTimeout(function(){
			var scrollTop = getCookie(_this.pageName+"_scrollTop");
			scrollTop && $(".waf-simple-menu").animate({"scrollTop":scrollTop},200);
			// scrollTop && $(".waf-simple-menu").scrollTop(scrollTop);
		},50);

		var lastClickItemGroup = getCookie(this.pageName+"_last_click_itemGroup");
		lastClickItemGroup && $(".menu-item").eq(lastClickItemGroup).addClass("skyblue");
		var lastClickItem = getCookie(this.pageName+"_last_click_item");
		lastClickItem && $(".menu-item").eq(lastClickItemGroup).parent().find("li").eq(lastClickItem).addClass("c190218250");
	};

	//tools
	function watch(a,fn){
		var _this = this;
		var old = this[a];
		setInterval(function(){
			if(old!==_this[a]){
				fn(old,_this[a]);
			}
			old = _this[a];
		},50);
	}

	WafSimpleMenu.prototype.init = function (){
		window.pageName = this.pageName;
		window.toggleSimpleMenu = this.toggleSimpleMenu.bind(this);
		$tb_d.eq(0).append("<p style='text-align:center;padding:12px;'><button onclick='toggleSimpleMenu(false)'>切换到缩略菜单</button><p>");

		watch("openAll",function(oldV,newV){
			if(newV === true){
				$(".open-all-group").html("收起所有菜单");
			}else{
				$(".open-all-group").html("展开所有菜单");
			}
		});

		var noOpen = getCookie(this.pageName+"_noOpen");
		if(getCookie("waf_simple_menu")==="true"){
			toggleSimpleMenu(true,false,noOpen);
		}
	};

	nameSpace.WafSimpleMenu = WafSimpleMenu;
})(window.jc.js.util);
