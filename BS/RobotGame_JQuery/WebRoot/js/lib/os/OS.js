/*-----------------------------------------------------------------------------
 *作者:XJiang , email:xjiang19900821@gmail.com
 -----------------------------------------------------------------------------*/

var OS = {
    //创建子命名空间,用的是yui的方法------
    NS:function (ns) {
        if (!ns || !ns.length) {
            return null;
        }
        var levels = ns.split(".");
        var nsobj = OS;
        for (var i = (levels[0] == "OS") ? 1 : 0; i < levels.length; ++i) {
            nsobj[levels[i]] = nsobj[levels[i]] || {};
            nsobj = nsobj[levels[i]];
        }
        return nsobj;
    },
    //获取对象类型名,["Array", "Boolean", "Date", "Number", "Object", "RegExp", "String", "Window", "HTMLDocument"]
    _getType:function (object) {
        return Object.prototype.toString.call(object).match(/^\[object\s(.*)\]$/)[1];
    },
    //用来判断对象类型
    _is:function (object, typeStr) {
        return this._getType(object) == typeStr;
    },

    textLength:function (text) {
        var intLength = 0;
        for (var i = 0; i < text.length; i++) {
            if ((text.charCodeAt(i) < 0) || (text.charCodeAt(i) > 255)) {
                intLength = intLength + 2;
            } else {
                intLength = intLength + 1;
            }
        }
        return intLength
    },
    //加载进度条
    progressBar:function () {
        $("<div id='myCover'></div><div id='loadimg'><span>正在加载,请稍等O(∩_∩)O哈！</span></div>").appendTo('body');
        var w = $(window).width(), h = $(window).height();
        $('#myCover').css({'width':'100%', 'height':h, 'position':'absolute', 'background':'#fff', 'z-index':9999, 'left':0, 'top':0}).fadeTo('slow', 0.8);
        $('#loadimg').css({'position':'absolute', 'background':'url(themes/default/images/loading.gif) no-repeat center center', 'z-index':10000, 'width':'110px', 'height':'64px', 'left':(w - 110) / 2, 'top':((h - 64) / 2) - 50}).find('span').css({'position':'absolute', 'left':0, 'bottom':'-40px', 'width':110, 'display':'block', 'height':40, 'text-align':'center'});
    },
    //停止进度条
    stopProgress:function () {
        $('#myCover').remove();
        $('#loadimg').remove();
    },

    getImgWh:function (url, callback) {
        var width, height, intervalId, check, div, img = new Image(),
            body = document.body;
        img.src = url;

        //从缓存中读取
        if (img.complete) {
            return callback(img.width, img.height);
        }
        ;

        //通过占位提前获取图片头部数据
        if (body) {
            div = document.createElement('div');
            div.style.cssText = 'visibility:hidden;position:absolute;left:0;top:0;width:1px;height:1px;overflow:hidden';
            div.appendChild(img)
            body.appendChild(div);
            width = img.offsetWidth;
            height = img.offsetHeight;
            check = function () {
                if (img.offsetWidth !== width || img.offsetHeight !== height) {
                    clearInterval(intervalId);
                    callback(img.offsetWidth, img.clientHeight);
                    img.onload = null;
                    div.innerHTML = '';
                    div.parentNode.removeChild(div);
                }
                ;
            };
            intervalId = setInterval(check, 150);
        }
        ;
        // 加载完毕后方式获取
        img.onload = function () {
            callback(img.width, img.height);
            img.onload = img.onerror = null;
            clearInterval(intervalId);
            body && img.parentNode.removeChild(img);
        };
    },
    //全屏
    fullscreen:function () {
        var docElm = document.documentElement;
        if (docElm.requestFullscreen) {
            docElm.requestFullscreen();
        }
        else if (docElm.mozRequestFullScreen) {
            docElm.mozRequestFullScreen();
        }
        else if (docElm.webkitRequestFullScreen) {
            docElm.webkitRequestFullScreen();
        }
    },
    //退出全屏
    exitFullscreen:function () {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
        else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        }
        else if (document.webkitCancelFullScreen) {
            document.webkitCancelFullScreen();
        }
    },
    //IE全屏
    fullscreenIE:function () {
        if ($.browser.msie) {
            var wsh = new ActiveXObject("WScript.Shell");
            wsh.sendKeys("{F11}");
        }
    }
}

/*------------------------------------------
 *jquery扩展，加载技术文件和css文件
 -------------------------------------------*/
$.extend({
    includePath:'',
    include:function (file) {
        var files = typeof file == "string" ? [file] : file;
        for (var i = 0; i < files.length; i++) {
            var name = files[i].replace(/^\s|\s$/g, "");
            var att = name.split('.');
            var ext = att[att.length - 1].toLowerCase();
            var isCSS = ext == "css";
            var tag = isCSS ? "link" : "script";
            var attr = isCSS ? " type='text/css' rel='stylesheet' " : " language='javascript' type='text/javascript' ";
            var link = (isCSS ? "href" : "src") + "='" + $.includePath + name + "'";
            if ($(tag + "[" + link + "]").length == 0) document.write("<" + tag + attr + link + "></" + tag + ">");
        }
    }
});

//声明desktop空间,封装相关操作
OS.NS("desktop");
OS.desktop = {
    winWH:function () {
        $('body').data('winWh', {'w':$(window).width(), 'h':$(window).height()});
    },
    desktopPanel:function () {
        $('body')
            .data('panel', {
                'taskBar':{
                    '_this':$('#taskBar'),
                    'task_lb':$('#task_lb')
                },
                'navBar':$('#navBar'),
                'wallpaper':$('#wallpapers'),
                'lrBar':{
                    '_this':$('#lr_bar'),
                    'default_app':$('#default_app'),
                    'start_block':$('#start_block'),
                    'start_btn':$('#start_btn'),
                    'start_item':$('#start_item'),
                    'default_tools':$('#default_tools')
                },
                'desktopPanel':{
                    '_this':$('#desktopPanel'),
                    'innerPanel':$('#desktopInnerPanel'),
                    'deskIcon':$('ul.deskIcon')
                },
                'powered_by':$('a.powered_by')
            });
    },
    iconDataInit:function (data) {
        for (var a in data) {
            $("#" + a).data("iconData", data[a]);
        }
    },
    getMydata:function () {
        return $('body').data();
    },
    mouseXY:function () {
        var mouseXY = [];
        $(document).bind('mousemove', function (e) {
            mouseXY[0] = e.pageX;
            mouseXY[1] = e.pageY;
        });
        return mouseXY;
    },
    contextMenu:function (jqElem, data, menuName, textLimit) {
        var _this = this
            , mXY = _this.mouseXY();

        jqElem
            .smartMenu(data, {
                name:menuName,
                textLimit:textLimit,
                afterShow:function () {
                    var menu = $("#smartMenu_" + menuName);
                    var myData = OS.desktop.getMydata(),
                        wh = myData.winWh;//获取当前document宽高
                    var menuXY = menu.offset(), menuH = menu.height(), menuW = menu.width();
                    if (menuXY.top > wh['h'] - menuH) {
                        menu.css('top', mXY[1] - menuH - 2);
                    }
                    if (menuXY.left > wh['w'] - menuW) {
                        menu.css('left', mXY[0] - menuW - 2);
                    }
                }
            });
        $(document.body).click(function (event) {
            event.preventDefault();
            $.smartMenu.hide();
        });
    }
}

//弹出窗口，支持拖曳，改变大小，关闭，最大化，最小化
OS.NS("desktop.win");
OS.desktop.win = {
    winHtml:function (title, url, id) {
        return "<div class='windows corner' id="
            + id
            + "><div class='win_title'><b>"
            + title
            + "</b><span class='win_btnblock'><a href='#' class='winMinimize' title='最小化'></a><a href='#' class='winMaximize' title='最大化'></a><a href='#' class='winHyimize' title='还原'></a><a href='#' class='winClose' title='关闭'></a></span></div><iframe frameborder='0' name='myFrame_"
            + id
            + "' id='myFrame_"
            + id
            + "' class='winframe' scrolling='auto' width='100%' src=''></iframe></div>";
    },
    //添加遮障层，修复iframe 鼠标经过事件bug
    iframFix:function (obj) {
        obj.each(function () {
            var o = $(this);
            if (o.find('.zzDiv').size() <= 0)
                o.append($("<div class='zzDiv' style='width:100%;height:" + (o.innerHeight() - 26) + "px;position:absolute;z-index:900;left:0;top:26px;'></div>"));
        })
    },
    //获取当前窗口最大的z-index值
    maxWinZindex:function ($win) {
        return Math.max.apply(null, $.map($win, function (e, n) {
            if ($(e).css('position') == 'absolute')
                return parseInt($(e).css('z-index')) || 1;
        }));
    },
    //获取当前最顶层窗口
    findTopWin:function ($win, maxZ) {
        var topWin;
        $win.each(function (index) {
            if ($(this).css("z-index") == maxZ) {
                topWin = $(this);
                return false;
            }
        });
        return topWin;
    },
    //关闭窗口
    closeWin:function (obj) {
        var _this = this, $win = $('div.windows').not(".hideWin"), maxZ, topWin;
        OS.desktop.taskBar.delWinTab(obj);
        obj.hide(200, function () {
            $(this).remove();
        });
        //当关闭窗口后寻找最大z-index的窗口并使其出入选择状态
        if ($win.size() > 1) {
            maxZ = _this.maxWinZindex($win.not(obj));
            topWin = _this.findTopWin($win, maxZ);
            _this.switchZindex(topWin);
        }
    },
    //最小化窗口
    minimize:function (obj) {
        var _this = this, $win = $('div.windows').not(".hideWin"), maxZ, topWin, objTab;
        //obj.hide();
        obj.css({"left":obj.position().left - 10000, "visibility":"hidden"}).addClass("hideWin");

        //最小化窗口后，寻找最大z-index窗口至顶
        if ($win.size() > 1) {
            maxZ = _this.maxWinZindex($win.not(obj));
            topWin = _this.findTopWin($win, maxZ);
            _this.switchZindex(topWin);
        } else {
            objTab = OS.desktop.taskBar.findWinTab(obj);
            objTab.removeClass('selectTab').addClass('defaultTab');
        }
    },
    //最大化窗口函数
    maximizeWin:function (obj) {
        var myData = OS.desktop.getMydata(),
            panel = $("#desktopInnerPanel").offset(),
            wh = myData.winWh;//获取当前document宽高
        obj
            .css({'width':wh['w'], 'height':wh['h'], 'left':-panel.left, 'top':-panel.top})
            .draggable("disable")
            .resizable("disable")
            .fadeTo("fast", 1)
            .find(".winframe")
            .css({'width':wh['w'], 'height':wh['h'] - 26});
    },
    //还原窗口函数
    hyimizeWin:function (obj) {
        var myData = obj.data(),
            winLocation = myData.winLocation;//获取窗口最大化前的位置大小

        obj.css({'width':winLocation['w'], 'height':winLocation['h'], 'left':winLocation['left'], 'top':winLocation['top']})
            .draggable("enable")
            .resizable("enable")
            .find(".winframe")
            .css({'width':winLocation['w'], 'height':winLocation['h'] - 26});
    },
    //交换窗口z-index值
    switchZindex:function (obj) {
        var myData = OS.desktop.getMydata()
            , $topWin = myData.topWin
            , $topWinTab = myData.topWinTab
            , curWinZindex = obj.css("z-index")
            , maxZ = myData.maxZindex
            , objTab = OS.desktop.taskBar.findWinTab(obj);

        if (!$topWin.is(obj)) {

            obj.css("z-index", maxZ);
            objTab.removeClass('defaultTab').addClass('selectTab');

            $topWin.css("z-index", curWinZindex);
            $topWinTab.removeClass('selectTab').addClass('defaultTab');
            this.iframFix($topWin);
            //更新最顶层窗口对象
            $('body').data("topWin", obj).data("topWinTab", objTab);
        }
    },
    //新建一个窗口
    newWin:function (options) {

        var myData = OS.desktop.getMydata(),
            wh = myData.winWh, //获取当前document宽高
            $windows = $("div.windows"),
            _this = this,
            curwinNum = OS._is(myData.winNum, "Number") ? myData.winNum : 0;//判断当前已有多少窗口
        _this.iframFix($windows);

        //默认参数配置
        var defaults = {
            WindowTitle:null,
            WindowsId:null,
            WindowPositionTop:'center', /* Posible are pixels or 'center' */
            WindowPositionLeft:'center', /* Posible are pixels or 'center' */
            WindowWidth:Math.round(wh['w'] * 0.6), /* Only pixels */
            WindowHeight:Math.round(wh['h'] * 0.8), /* Only pixels */
            WindowMinWidth:250, /* Only pixels */
            WindowMinHeight:250, /* Only pixels */
            iframSrc:null, /* 框架的src路径*/
            WindowResizable:true, /* true, false*/
            WindowMaximize:true, /* true, false*/
            WindowMinimize:true, /* true, false*/
            WindowClosable:true, /* true, false*/
            WindowDraggable:true, /* true, false*/
            WindowStatus:'regular', /* 'regular', 'maximized', 'minimized' */
            WindowAnimationSpeed:500,
            WindowAnimation:'none'
        };

        var options = $.extend(defaults, options);

        //判断窗口位置，否则使用默认值
        var dxy = Math.floor((Math.random() * 100)) + 30;
        var panelLeft = $("#desktopInnerPanel").position();

        var wLeft = OS._is(options['WindowPositionLeft'], "Number") ? options['WindowPositionLeft'] + dxy - panelLeft.left : (wh['w'] - options['WindowWidth']) / 2 + dxy - panelLeft.left;
        var wTop = OS._is(options['WindowPositionTop'], "Number") ? options['WindowPositionTop'] + dxy / 2 : (wh['h'] - options['WindowHeight']) / 2 + dxy / 2;

        //给窗口赋予新的z-index值
        var zindex = curwinNum + 500;
        var id = "myWin_" + options['WindowsId'];//根据传来的id将作为新窗口id
        $('body').data("winNum", curwinNum + 1);//更新窗口数量


        //判断如果此id的窗口存在，则不创建窗口
        if ($("#" + id).size() <= 0) {
            //在任务栏里添加tab
            OS.desktop.taskBar.addWinTab(options['WindowTitle'], options['WindowsId']);
            //初始化新窗口并显示
            $(_this.winHtml(options['WindowTitle'], options['iframSrc'], id)).appendTo('#desktopInnerPanel');

            var $newWin = $("#" + id)
                , $icon = $("#" + options['WindowsId'])
                , $iconOffset = $icon.offset()
                , $fram = $newWin.find(".winframe")
                , $winTitle = $newWin.find(".win_title")
                , winMaximize_btn = $newWin.find('a.winMaximize')//最大化按钮
                , winMinimize_btn = $newWin.find('a.winMinimize')//最小化按钮
                , winClose_btn = $newWin.find('a.winClose')//关闭按钮
                , winHyimize_btn = $newWin.find('a.winHyimize');//还原按钮

            winHyimize_btn.hide();
            if (!options['WindowMaximize']) winMaximize_btn.hide();
            if (!options['WindowMinimize']) winMinimize_btn.hide();
            if (!options['WindowClosable']) winClose_btn.hide();

            //存储窗口最大的z-index值,及最顶层窗口对象
            $('body').data({"maxZindex":zindex, "topWin":$newWin});

            //判断窗口是否启用动画效果
            if (options.WindowAnimation == 'none') {

                $newWin
                    .css({"width":options['WindowWidth'], "height":options['WindowHeight'], "left":wLeft, "top":wTop, "z-index":zindex})
                    .addClass("loading")
                    .show(10, function () {
                        $(this).find(".winframe").attr("src", options['iframSrc']).load(function () {
                            $(this).show();
                        });
                    });

            } else {

                $newWin
                    .css({"left":$iconOffset.left, "top":$iconOffset.top, "z-index":zindex})
                    .addClass("loading")
                    .show()
                    .animate({
                        width:options['WindowWidth'],
                        height:options['WindowHeight'],
                        top:wTop,
                        left:wLeft}, 100, function () {
                        $(this).find(".winframe").attr("src", options['iframSrc']).load(function () {
                            $(this).show();
                        });
                    });
            }

            $newWin
                //存储窗口当前位置大小
                .data('winLocation', {
                    'w':options['WindowWidth'],
                    'h':options['WindowHeight'],
                    'left':wLeft,
                    'top':wTop
                })
                //鼠标点击，切换窗口，使此窗口显示到最上面
                .bind({
                    "mousedown":function (event) {
                        _this.switchZindex($(this));
                    },
                    "mouseup":function () {
                        $(this).find('.zzDiv').remove();
                    }
                })
                .find(".winframe")
                .css({"width":options['WindowWidth'], "height":options['WindowHeight'] - 26});

            //调用窗口拖动,参数可拖动的范围上下左右，窗口id和，浏览器可视窗口大小
            if (options['WindowDraggable']) {
                _this.drag([0, 0, wh['w'] - options['WindowWidth'] - 10, wh['h'] - options['WindowHeight'] - 35], $newWin, wh);
            }
            //调用窗口resize,传递最大最小宽度和高度，新窗口对象id，浏览器可视窗口大小
            if (options['WindowResizable']) {
                _this.resize(options['WindowMinWidth'], options['WindowMinHeight'], wh['w'] - wLeft, wh['h'] - wTop - 35, $newWin, wh);
            }

            //双击窗口标题栏
            $winTitle.dblclick(function () {
                var hasMaximizeBtn = $(this).find(winMaximize_btn);

                if (!hasMaximizeBtn.is(":hidden")) {
                    winMaximize_btn.trigger("click");
                } else {
                    winHyimize_btn.trigger("click");
                }

            });

            //窗口最大化，最小化，及关闭
            winClose_btn.click(function (event) {
                event.stopPropagation();
                _this.closeWin($newWin);
            });
            //最大化
            winMaximize_btn.click(function (event) {
                event.stopPropagation();
                if (options['WindowStatus'] == "regular") {
                    _this.maximizeWin($newWin);
                    $(this).hide();
                    winHyimize_btn.show();
                    options['WindowStatus'] = "maximized";
                    $("#desktopPanel").css("z-index", 95);
                }
            });

            //如果浏览器窗口大小改变，则更新窗口大小
            $(window).wresize(function () {
                if (options['WindowStatus'] == "maximized") {
                    _this.maximizeWin($newWin);
                }
            });
            //还原窗口
            winHyimize_btn.click(function (event) {
                event.stopPropagation();
                if (options['WindowStatus'] == "maximized") {
                    _this.hyimizeWin($newWin);
                    $(this).hide();
                    winMaximize_btn.show();
                    options['WindowStatus'] = "regular";
                    $("#desktopPanel").css("z-index", 70);
                }
            });
            //最小化窗口
            winMinimize_btn.click(function () {
                _this.minimize($newWin);
            });
        } else {

            //如果已存在此窗口，判断是否隐藏
            var wins = $("#" + id), objTab = OS.desktop.taskBar.findWinTab(wins);
            if (wins.is(":hidden")) {
                wins.show();
                objTab.removeClass('defaultTab').addClass('selectTab');//当只有一个窗口时
                OS.desktop.win.switchZindex(wins);
            } else {

            }
        }
    },
    upWinResize_block:function (win) {

        //更新窗口可改变大小范围,wh为浏览器窗口大小
        var offset = win.offset();
        win.resizable("option", {'maxWidth':$(window).width() - offset.left - 10, 'maxHeight':$(window).height() - offset.top - 35})
    },
    drag:function (arr, $newWin, wh) {
        var _this = this;
        $newWin
            .draggable({
                handle:'div.win_title',
                iframeFix:false,
                scroll:false
            })
            .bind("dragstart", function (event, ui) {
                _this.iframFix($(this));
                $("#desktopPanel").css("z-index", 95);
            })
            .bind("dragstop", function (event, ui) {
                $("#desktopPanel").css("z-index", 70);

                var obj_this = $(this);

                var offset = obj_this.offset();
                //计算可拖曳范围
                _this.upWinResize_block(obj_this);

                obj_this
                    //更新窗口存储的位置属性
                    .data('winLocation', {
                        'w':obj_this.width(),
                        'h':obj_this.height(),
                        'left':offset.left,
                        'top':offset.top
                    })
                    .find('.zzDiv')
                    .remove();

                if (event.pageY > wh.h - 50) {
                    $(this).css("top", event.pageY - 90);
                } else if (event.pageY < -35) {
                    $(this).css("top", -35);
                }
            });

        $("div.win_title").css("cursor", "move");

    },
    resize:function (minW, minH, maxW, maxH, $newWin, wh) {
        var _this = this;
        $newWin
            .resizable({
                minHeight:minH,
                minWidth:minW,
                containment:'document',
                maxWidth:maxW,
                maxHeight:maxH
            })
            .css("position", "absolute")
            .bind("resize", function (event, ui) {
                var h = $(this).innerHeight(), w = $(this).innerWidth();
                _this.iframFix($(this));

                //拖曳改变窗口大小，更新iframe宽度和高度，并显示iframe
                $(this).children(".winframe").css({"width":w, "height":h - 26});

            })
            .bind("resizestop", function (event, ui) {
                var obj_this = $(this);
                var offset = obj_this.offset();
                var h = obj_this.innerHeight(), w = obj_this.innerWidth();

                obj_this
                    //更新窗口存储的位置属性
                    .data('winLocation', {
                        'w':w,
                        'h':h,
                        'left':offset.left,
                        'top':offset.top
                    })
                    //删除遮障iframe的层
                    .find(".zzDiv")
                    .remove();
            });
    }
}

//侧边工具栏
OS.NS("desktop.lrBar");
OS.desktop.lrBar = {
    upLrBar:function () {
        var myData = OS.desktop.getMydata()
            , $lrBar = myData.panel.lrBar['_this']
            , wh = myData.winWh;
        $lrBar.css({'top':Math.floor((wh['h'] - $lrBar.height()) / 2) - 60});

    },
    init:function (iconData) {
        //读取元素对象数据
        var myData = OS.desktop.getMydata()
            , $default_tools = myData.panel.lrBar['default_tools']
            , $def_tools_Btn = $default_tools.find('span')
            , $start_btn = myData.panel.lrBar['start_btn']
            , $start_block = myData.panel.lrBar.start_block
            , $start_item = myData.panel.lrBar['start_item']
            , $default_app = myData.panel.lrBar['default_app']
            , $lrBar = myData.panel.lrBar['_this']
            , wh = myData.winWh
            , _this = this;

        //初始化侧栏位置
        _this.upLrBar();

        //附加data数据
        OS.desktop.iconDataInit(iconData);

        //如果窗口大小改变，则更新侧边栏位置
        $(window).wresize(function () {
            OS.desktop.winWH();//更新窗口大小数据
            _this.upLrBar();
        });

        //任务栏右边默认组件区域交互效果
        $def_tools_Btn.hover(function () {
            $(this).css("background-color", "#999");
        }, function () {
            $(this).css("background-color", "transparent");
        });
        //默认应用程序区
        $default_app
            .droppable({
                scope:'a',
                drop:function (event, ui) {
                    var title = ui.draggable.find(".text").text();
                    ui.draggable
                        .removeClass("desktop_icon")
                        .attr({"style":"",
                            "title":title
                        })
                        .find("span")
                        .removeClass("icon")
                        .end()
                        .appendTo($default_app);
                    OS.desktop.deskIcon.init();
                    _this.init();
                }
            })
            .find('li')
            .hover(function () {
                $(this).addClass('btnOver');
            }, function () {
                $(this).removeClass('btnOver');
            })
            .click(function () {

                var data = $(this).data("iconData"), id = this.id;
                OS.desktop.win.newWin({
                    WindowTitle:data.title,
                    iframSrc:data.url,
                    WindowsId:id,
                    WindowAnimation:'none',
                    WindowWidth:data.winWidth,
                    WindowHeight:data.winHeight
                });

                $(this).data("currPanel", $("ul.currDesktop").index("ul.deskIcon"));

            })
            .draggable({
                helper:"clone",
                scroll:false,
                opacity:0.7,
                scope:'a',
                appendTo:'parent',
                start:function () {
                    $lrBar.css("z-index", 90);
                }
            })
            .droppable({
                scope:'a',
                drop:function (event, ui) {

                    var title = ui.draggable.find(".text").text();
                    ui.draggable
                        .removeClass("desktop_icon")
                        .attr({"style":"",
                            "title":title
                        })
                        .find("span")
                        .removeClass("icon")
                        .end()
                        .insertBefore($(this));
                    _this.init();
                    OS.desktop.deskIcon.init();
                }
            });

        //开始按钮、菜单交互效果
        $start_btn.click(function (event) {
            event.preventDefault();
            event.stopPropagation()
            if ($start_item.is(":hidden"))
                $start_item.show();
            else
                $start_item.hide();
        });

        $("body").click(function (event) {
            event.preventDefault();
            $start_item.hide();
        });
        //全屏
        $("#showZm_btn")
            .toggle(function () {
                OS.fullscreenIE();
                OS.fullscreen();
            },
            function () {
                OS.fullscreenIE();
                OS.exitFullscreen();
            });
    }
}
/*----------------------------------------------------------------------------------
 //声明任务栏空间，任务栏相关js操作
 ----------------------------------------------------------------------------------*/
OS.NS("desktop.taskBar");
OS.desktop.taskBar = {
    timer:function (obj) {
        var curDaytime = new Date().toLocaleString().split(" ");
        obj.innerHTML = curDaytime[1];
        obj.title = curDaytime[0];
        setInterval(function () {
            obj.innerHTML = new Date().toLocaleString().split(" ")[1];
        }, 1000);
    },
    upTaskWidth:function () {
        var myData = OS.desktop.getMydata()
            , $task_bar = myData.panel.taskBar['_this'];
        var maxHdTabNum = Math.floor($(window).width() / 100);
        //计算任务栏宽度
        $task_bar.width(maxHdTabNum * 100);
        //存储活动任务栏tab默认组数
        $('body').data("maxHdTabNum", maxHdTabNum - 2);
    },
    init:function () {
        //读取元素对象数据
        var myData = OS.desktop.getMydata();
        var $task_lb = myData.panel.taskBar['task_lb']
            , $task_bar = myData.panel.taskBar['_this']
            , wh = myData.winWh;

        var _this = this;
        _this.upTaskWidth();
        //当改变浏览器窗口大小时，重新计算任务栏宽度
        $(window).wresize(function () {
            _this.upTaskWidth();
        });

    },
    contextMenu:function (tab, id) {
        var _this = this;
        //初始化任务栏Tab右键菜单
        var data = [
            [
                {
                    text:"最大化",
                    func:function () {
                        $("#myWin_" + tab.data('win')).find('a.winMaximize').trigger('click');
                    }
                },
                {
                    text:"最小化",
                    func:function () {
                        OS.desktop.win.minimize($("#myWin_" + tab.data('win')));
                    }
                }
            ]
            ,
            [
                {
                    text:"关闭",
                    func:function () {
                        $("#smartMenu_taskTab_menu" + id).remove();
                        OS.desktop.win.closeWin($("#myWin_" + tab.data('win')));
                    }
                }
            ]
        ];
        OS.desktop.contextMenu(tab, data, "taskTab_menu" + id, 10);
    },
    addWinTab:function (text, id) {
        var myData = OS.desktop.getMydata();
        var $task_lb = myData.panel.taskBar['task_lb']
            , $task_bar = myData.panel.taskBar['_this']
            , $navBar = myData.panel.navBar
            , $navTab = $navBar.find("a")
            , tid = "myWinTab_" + id
            , allTab = $task_lb.find('a')
            , curTabNum = allTab.size()
            , docHtml = "<a href='#' id='" + tid + "'>" + text + "</a>";

        //添加新的tab
        $task_lb.append($(docHtml));
        var $newTab = $("#" + tid);
        //右键菜单
        this.contextMenu($newTab, id);

        $task_lb
            .find('a.selectTab')
            .removeClass('selectTab')
            .addClass('defaultTab');

        $newTab
            .data('win', id)
            .addClass('selectTab')
            .click(function () {
                var win = $("#myWin_" + $(this).data('win')),
                    tabId = this.id,
                    iconId = tabId.split("_")[1],
                    desk = $("#" + iconId).parent(),
                    i = desk.index("ul.deskIcon");	//判断窗口在那个桌面区域

                if (i < 0) {
                    i = $("#" + iconId).data("currPanel");
                }
                //如果是当前桌面
                if (desk.is(".currDesktop")) {
                    if (win.is(".hideWin")) {
                        //win.show();
                        win.css({"left":win.position().left + 10000, "visibility":"visible"}).removeClass("hideWin");

                        $(this).removeClass('defaultTab').addClass('selectTab');//当只有一个窗口时
                        OS.desktop.win.switchZindex(win);
                    } else {
                        if ($(this).hasClass('selectTab')) {
                            OS.desktop.win.minimize(win);
                        } else {
                            OS.desktop.win.switchZindex(win);
                        }
                    }

                    //如果不在当前窗口
                } else {
                    if (win.is(".hideWin")) {
                        //win.show();
                        win.css({"left":win.position().left + 10000, "visibility":"visible"}).removeClass("hideWin");

                        $(this).removeClass('defaultTab').addClass('selectTab');//当只有一个窗口时
                        OS.desktop.win.switchZindex(win);
                    }
                    $navTab.eq(i).trigger("click");
                }

            });

        $('body').data("topWinTab", $newTab);

        //当任务栏活动窗口数超出时
        if (curTabNum > myData.maxHdTabNum - 1) {
            var LeftBtn = $('#leftBtn')
                , rightBtn = $('#rightBtn')
                , bH;

            LeftBtn
                .show()
                .find("a")
                .click(function () {
                    var pos = $task_lb.position();
                    if (pos.top < 0) {
                        $task_lb.animate({
                            "top":pos.top + 40
                        }, 50);
                    }
                });

            rightBtn
                .show()
                .find("a")
                .click(function () {
                    var pos = $task_lb.position(), h = $task_lb.height(), row = h / 40;
                    if (pos.top > (row - 1) * (-40)) {
                        $task_lb.animate({
                            "top":pos.top - 40
                        }, 50);
                    }
                });

            $task_lb.parent().css("margin", "0 100");
        }

    },
    delWinTab:function (wObj) {
        var myData = OS.desktop.getMydata()
            , $task_lb = myData.panel.taskBar['task_lb']
            , $task_bar = myData.panel.taskBar['_this']
            , LeftBtn = $('#leftBtn')
            , rightBtn = $('#rightBtn')
            , pos = $task_lb.position();

        this.findWinTab(wObj).remove();

        var newH = $task_lb.height();
        if (Math.abs(pos.top) == newH) {
            LeftBtn.find('a').trigger("click");
        }
        if (newH == 40) {
            LeftBtn.hide();
            rightBtn.hide();
            $task_lb.parent().css("margin", 0);
        }
    },
    findWinTab:function (wObj) {
        var myData = OS.desktop.getMydata(),
            $task_lb = myData.panel.taskBar['task_lb'],
            objTab;
        $task_lb.find('a').each(function (index) {
            var id = "#myWin_" + $(this).data("win");
            if ($(id).is(wObj)) {
                objTab = $(this);
            }
        });
        return objTab;
    }
}

//navbar
OS.NS("desktop.navBar");
OS.desktop.navBar = {
    init:function () {
        var myData = OS.desktop.getMydata()
            , $navBar = myData.panel.navBar
            , $innerPanel = myData.panel.desktopPanel.innerPanel
            , $navTab = $navBar.find("a")
            , $deskIcon = myData.panel.desktopPanel['deskIcon']
            , desktopWidth = $deskIcon.width()
            , lBarWidth = myData.panel.lrBar["_this"].outerWidth();

        $navBar.css({"display":"none"});
//        $navBar
//            .draggable({
//                scroll:false
//            });
//
//        $navTab
//            .droppable({
//                scope:'a',
//                over:function (event, ui) {
//                    $(this).trigger("click");
//                    var i = $navTab.index($(this));
//                    //ui.draggable
//                    //.css({left:event.pageX+$deskIcon.width()*i});
//                },
//                drop:function (event, ui) {
//                    var i = $navTab.index($(this));
//                    ui.draggable
//                        .addClass("desktop_icon")
//                        .insertBefore($deskIcon.eq(i).find(".add_icon"))
//                        .find("span")
//                        .addClass("icon");
//                    OS.desktop.deskIcon.init();
//                    OS.desktop.lrBar.init();
//                }
//            })
//            .click(function (event) {
//                event.preventDefault();
//                event.stopPropagation();
//                var i = $navTab.index($(this));
//                OS.desktop.deskIcon.desktopMove($innerPanel, $deskIcon, $navTab, 500, desktopWidth + lBarWidth, i);
//            });
    }
};

//桌面背景
OS.NS("desktop.wallpaper");
OS.desktop.wallpaper = {
    init:function (imgUrl) {

        //将当前窗口宽度和高度数据存储在body元素上
        OS.desktop.winWH();

        var myData = OS.desktop.getMydata()
            , winWh = myData.winWh
            , wallpaper = myData.panel.wallpaper
            , _this = this;

        if (imgUrl !== null) {
            wallpaper.html("<img src='" + imgUrl + "'></img>");
            var img = wallpaper.find("img");

            OS.getImgWh(imgUrl, function (imgW, imgH) {
                if (imgW <= winWh.w) {
                    img.css('width', winWh.w);
                } else {
                    img.css({"margin-left":-(imgW - winWh.w) / 2});
                }
                if (imgH <= winWh.h) {
                    img.css('height', winWh.h);
                } else {
                    img.css({"margin-top":-(imgH - winWh.h) / 2});
                }
            });
        }

        //如果窗口大小改变，更新背景布局大小
        window.onresize = function () {
            _this.init(imgUrl);
        };
    }
};

//桌面图标区域
OS.NS("desktop.deskIcon");
OS.desktop.deskIcon = {
    //桌面图标排列
    arrangeIcons:function (desktop) {
        var myData = OS.desktop.getMydata()
            , winWh = myData.winWh
            , $navBar = myData.panel.navBar
            , navBarHeight = $navBar.outerHeight()
        //计算一共有多少图标
            , iconNum = desktop.find("li").size();

        //存储当前总共有多少桌面图标
        desktop.data('deskIconNum', iconNum);

        var gH = 120;//一个图标总高度，包括上下margin
        var gW = 120;//图标总宽度,包括左右margin
        var rows = Math.floor((winWh['h'] - navBarHeight - 75) / gH);
        var cols = Math.ceil(iconNum / rows);
        var curcol = 0, currow = 0;

        desktop.
            find("li")
            .css({
                "position":"absolute",
                "margin":0,
                "left":function (index, value) {
                    var v = curcol * gW + 30;
                    if ((index + 1) % rows == 0) {
                        curcol = curcol + 1;
                    }
                    return v;
                },
                "top":function (index, value) {
                    var v = (index - rows * currow) * gH + 20;
                    if ((index + 1) % rows == 0) {
                        currow = currow + 1;
                    }
                    return v;
                }});
    },
    upDesktop:function ($deskIcon, $deskIconBlock, $innerPanel, $deskIconNum, navBarHeight, lBarWidth) {
        var myData = OS.desktop.getMydata()
            , winWh = myData.winWh
            , w = winWh['w'] - lBarWidth
            , h = (winWh['h'] - 75 - navBarHeight)
            , _this = this;

        //设置桌面图标容器元素区域大小
        $innerPanel.css({"width":((w + lBarWidth) * $deskIconNum) + "px", "height":h + "px"});
        $deskIcon.css({"width":w + "px", "height":h + "px", 'margin-right':lBarWidth});
        $deskIconBlock.css({"width":w + "px", "height":h + "px", "margin-top":navBarHeight, 'margin-left':lBarWidth + 'px', 'margin-bottom':75 + "px"});

        $deskIcon.each(function () {
            _this.arrangeIcons($(this));

            //拖拽功能
            //            $(this)
            //                .droppable({
            //                    scope:'a',
            //                    drop:function (event, ui) {
            //                        ui.draggable
            //                            .addClass("desktop_icon")
            //                            .insertBefore($(this).find(".add_icon"))
            //                            .find("span")
            //                            .addClass("icon");
            //                        _this.init();
            //                        OS.desktop.lrBar.init();
            //                    }
            //                });
        });
    },
    desktopMove:function ($innerPanel, $deskIcon, $navTab, dates, moveDx, nextIndex) {
        $innerPanel
            .stop()
            .animate({
                left:-(nextIndex) * moveDx
            }, dates, function () {
                $deskIcon
                    .removeClass("currDesktop")
                    .eq(nextIndex)
                    .addClass("currDesktop");

                $navTab
                    .removeClass("currTab")
                    .eq(nextIndex)
                    .addClass("currTab");
            });
    },
    init:function (iconData) {

        var myData = OS.desktop.getMydata();
        var winWh = myData.winWh;
        var $deskIconBlock = myData.panel.desktopPanel['_this'];
        var $innerPanel = myData.panel.desktopPanel.innerPanel;
        var $deskIcon = myData.panel.desktopPanel['deskIcon'];
        var $deskIconNum = $deskIcon.size();
        var $navBar = myData.panel.navBar;
        var navBarHeight = $navBar.outerHeight();
        var $navTab = $navBar.find("a");
        var lBarWidth = myData.panel.lrBar["_this"].outerWidth();
        var _this = this;

        _this.upDesktop($deskIcon, $deskIconBlock, $innerPanel, $deskIconNum, navBarHeight, lBarWidth);

        //如果窗口大小改变，则重新排列图标
        $(window).wresize(function () {
            OS.desktop.winWH();//更新窗口大小数据
            _this.upDesktop($deskIcon, $deskIconBlock, $innerPanel, $deskIconNum, navBarHeight, lBarWidth);
        });
        //附加data数据
        OS.desktop.iconDataInit(iconData);

        //桌面可使用鼠标拖动切换
//        var timeStart, timeEnd, dxStart, dxEnd;

        //        $innerPanel
        //            .draggable({
        //                axis:'x',
        //                start:function (event, ui) {
        //
        //                    $(this).css("cursor", "move");
        //                    timeStart = new Date().getTime();
        //                    dxStart = event.pageX;
        //                },
        //                stop:function (event, ui) {
        //                    $(this).css("cursor", "inherit");
        //                    timeEnd = new Date().getTime();
        //                    dxEnd = event.pageX;
        //                    var timeCha = timeEnd - timeStart
        //                        , dxCha = dxEnd - dxStart
        //                        , currDesktop = $(this).find("ul.currDesktop")
        //                        , deskIndex = $deskIcon.index(currDesktop)
        //                        , moveDx = $deskIcon.width() + lBarWidth
        //                        , dates = 1000 + timeCha;
        //
        //                    //左移
        //                    if (dxCha < -150 && deskIndex < 3) {
        //                        _this.desktopMove($(this), $deskIcon, $navTab, dates, moveDx, deskIndex + 1);
        //                        //右移
        //                    } else if (dxCha > 150 && deskIndex > 0) {
        //                        _this.desktopMove($(this), $deskIcon, $navTab, dates, moveDx, deskIndex - 1);
        //                    } else {
        //                        $(this)
        //                            .animate({
        //                                left:-(deskIndex) * moveDx
        //                            }, 500);
        //                    }
        //                }
        //            });


        //图标鼠标经过效果
        $deskIcon
            .find("li")
            .hover(function () {
                $(this).addClass("desktop_icon_over");
            },
            function () {
                $(this).removeClass("desktop_icon_over");
            })
            .not("li.add_icon")
            //双击图标打开窗口
            .click(function () {
                var data = $(this).data("iconData"), id = this.id;
                OS.desktop.win.newWin({
                    WindowTitle:data.title,
                    iframSrc:data.url,
                    WindowsId:id,
                    WindowAnimation:'none',
                    WindowWidth:data.winWidth,
                    WindowHeight:data.winHeight
                });
            })
            .draggable({
                helper:"clone",
                scroll:false,
                opacity:0.7,
                scope:'a',
                appendTo:'body',
                zIndex:91,
                start:function (event, ui) {
                    ui.helper.removeClass("desktop_icon_over");
                }
            })
            .droppable({
                scope:'a',
                drop:function (event, ui) {
                    ui.draggable
                        .unbind("dblclick")
                        .addClass("desktop_icon")
                        .insertBefore($(this))
                        .find("span")
                        .addClass("icon");
                    _this.init();
                    OS.desktop.lrBar.init();
                }
            });

        //初始化桌面右键菜单
        var data = [
            [
                {
                    text:"显示桌面",
                    func:function () {
                    }
                }
            ]
            ,
            [
                {
                    text:"系统设置",
                    func:function () {
                    }
                },
                {
                    text:"主题设置",
                    func:function () {
                    }
                }
            ]
            ,
            [
                {
                    text:"退出系统",
                    func:function () {
                    }
                }
            ]
            ,
            [
                {
                    text:"关于fleiCms",
                    func:function () {
                    }
                }
            ]
        ];
        OS.desktop.contextMenu($(document.body), data, "body", 10);
    }
}

//系统数据
OS.NS("data");
OS.data = {
    //网站根路径
    ROOT_PATH:"/",
    //默认JS文件编辑器模块ID
    DEFAULT_JS_EDITOR_ID:"js-editor",
    //默认JS文件编辑器窗体ID
    DEFAULT_JS_EDITOR_WIN_ID:"js-editor-win",
    //默认机器人JS文件编辑器模块ID
    DEFAULT_ROBOT_JS_EDITOR_ID:'robot-editor',
    //默认机器人JS文件编辑器窗体ID
    DEFAULT_ROBOT_JS_EDITOR_WIN_ID:'robot-editor-win',
    //默认机器人ID
    DEFAULT_ROBOT_ID:'david-robot',
    //默认机器人窗体ID
    DEFAULT_ROBOT_WIN_ID:'david-robot-win',

    init:function () {
        this.load(this.gameLauncherJson);
        this.load(this.moduleJson);
        this.load(this.robotCodeJson);
        this.load(this.shortcutJson);
    },
    /**
     * 判断是否完成全部json数据的载入工作
     * @return {Boolean}
     */
    isLoaded:function () {
        return this.robotCodeJson.getCount() > 0 && this.gameLauncherJson.getCount() > 0 && this.moduleJson.getCount() > 0 && this.shortcutJson.getCount() > 0;
    },

    /**
     * 载入json数据
     * @param json
     *          JsonStore对象
     */
    load:function (json) {
        json.load();
    },

    //机器人数据(json格式)
    robotCodeJson:new Ext.data.JsonStore({
        url:this.ROOT_PATH + 'data/robot_code/david/code.json',
        root:'codes',
        fields:['game_id', 'game_name', 'code_file_path', 'code_file_name', 'code_name']
    }),

    //桌面数据(json格式)
    shortcutJson:new Ext.data.JsonStore({
        url:this.ROOT_PATH + 'data/main/shortcut.json',
        root:'shortcuts',
        fields:['id', 'name', 'img']
    }),

    //开始按钮数据(json格式)
    gameLauncherJson:new Ext.data.JsonStore({
        url:this.ROOT_PATH + 'data/main/launcher.json',
        root:'games',
        fields:['id', 'text', 'iconCls']
    }),

    //读取模块数据(json格式)
    //先使用静态数据读取全部模块,
    //当用户模块和模块管理系统实现后,此处应该只读取用户使用的模块;其他模块从模块管理系统中添加
    moduleJson:new Ext.data.JsonStore({
        url:this.ROOT_PATH + 'data/main/model.json',
        root:'models',
        fields:['id', 'type', 'js_path', 'page_path', 'css_path', 'cls', 'lazy_load']
    })
}

//系统工具
OS.NS("util");
OS.util = {

}

/**
 *  JS文件载入器
 *  必须显示使用Ajax请求js代码，然后用script.text属性载入js脚本，
 *  无法直接使用 script.src指定脚本url来载入脚本
 */
OS.NS("util.jsLoader");
OS.util.jsLoader = {
    /**
     *已经载入的JS对象名列表
     */
    JS_Array:new Array(),

    /**
     * 载入JS文件
     * @param name
     * @param url
     */
    loadJS:function (name, url) {
        if (!url)
            return;

        //判断是否已经载入
        if (this.JS_Array.indexOf(name) != -1) {
            return;
        }

        //将js代码嵌入到页面
        var jsText = OS.util.ajax.syncRequest(url);
        var _script = document.createElement("script");
        _script.type = "text/javascript";
        _script.text = jsText;
        $("head")[0].appendChild(_script);

        this.JS_Array.push(name);
    },

    /**
     * 将用户的js代码嵌入到页面
     * @param source
     */
    includeUserJsText:function (source) {
        //移除用户JS节点
        $("head")[0].removeChild($("#UserJSCode")[0]);

        //添加用户JS节点
        var _script = document.createElement("script");
        _script.type = "text/javascript";
        _script.text = source;
        _script.id = "UserJSCode";
        $("head")[0].appendChild(_script);
    }
}

/**
 *  CSS文件载入器
 *  可以直接使用link.href指定url来载入css文件
 */
OS.NS("util.cssLoader");
OS.util.cssLoader = {
    //已载入的CSS对象列表
    CSS_Array:new Array(),

    /**
     * 载入CSS文件
     * @param name
     * @param url
     */
    loadCSS:function (name, url) {
        if (!url)
            return;

        //判断是否已经载入
        if (this.CSS_Array.indexOf(name) != -1) {
            return;
        }

        //直接使用link.href指定url来载入css文件
        var _css = document.createElement("link");
        _css.type = "text/css";
        _css.rel = "stylesheet";
        _css.href = url;

        this.CSS_Array.push(name);

        $("head")[0].appendChild(_css);
    }
}

/**
 * 模块载入器
 */
OS.NS("util.moduleLoader");
OS.util.moduleLoader = {

    modules:new Array(),

    init:function () {
        //从json数据中读取模块信息
        for (var i = 0; i < moduleJson.getCount(); i++) {
            var moduleJsonItem = moduleJson.getAt(i);

            var module = new Object();
            module.id = moduleJsonItem.get('id');//id
            module.type = moduleJsonItem.get('type');//类型
            module.js_path = moduleJsonItem.get('js_path');//js文件路径
            module.page_path = moduleJsonItem.get('page_path');//说明页面路径
            module.css_path = moduleJsonItem.get('css_path');//css文件路径
            module.cls = moduleJsonItem.get('cls');//类名(全类名)
            module.lazy_load = moduleJsonItem.get('lazy_load');//是否延时载入
            module.loaded = false;//是否已经载入

            //存入模块列表
            this.modules.push(module);

            //如果不是延迟加载,则马上载入模块相关文件
            if (!module.lazy_load) {
                this.load(module);
            }
        }
    },

    /*
     *  获取模块,将自动载入模块
     */
    getModule:function (id) {
        for (var i = 0; i < this.modules.length; i++) {
            var module = this.modules[i];
            if (module.id == id) {
                if (!module.loaded) {
                    //载入CSS文件
                    OS.util.cssLoader.loadCSS(module.id, module.css_path);
                    //载入JS文件
                    OS.util.jsLoader.loadJS(module.id, module.js_path);

                    module.instance = (new Function('return new ' + module.cls + ';'))();
                    module.loaded = true;
                }
                return module;
            }
        }
    }
}

/**
 * Ajax操作
 */
OS.NS("util.ajax");
OS.util.ajax = {
    /**
     * 创建XML回调对象，
     * 如果存在window.XMLHttpRequest()对象,则返回此对象，
     * 如果是IE则搜索Msxml2.XMLHTTP各个版本及Microsoft.XMLHTTP并创建对象返回。
     * @return {XMLHttpRequest}
     *              XML回调对象
     */
    getXmlHttpRequest:function () {
        if (window.XMLHttpRequest) {
            return new XMLHttpRequest();
        } else {
            if (window.Ajax_XMLHttpRequestProgID) {
                return new ActiveXObject(window.Ajax_XMLHttpRequestProgID);
            } else {
                var proIDs = ["Msxml2.XMLHTTP.5.0", "Msxml2.XMLHTTP.4.0", "MSXML2.XMLHTTP.3.0", "MSXML2.XMLHTTP", "Microsoft.XMLHTTP"];
                for (var i = 0; i < proIDs.length; ++i) {
                    var proID = proIDs[i];
                    try {
                        var x = new ActiveXObject(proID);
                        window.Ajax_XMLHttpRequestProgID = proID;
                        return x;
                    } catch (e) {

                    }
                }
            }
        }
        return null;
    },

    /**
     * 同步请求
     * @param url
     * @return {*}
     */
    syncRequest:function (url) {
        if (!url)
            return;

        //xml请求对象
        var oXmlHttp = this.getXmlHttpRequest();

        oXmlHttp.onreadystatechange = function () {
            if (oXmlHttp.readyState == 4) {
                if (oXmlHttp.status == 200 || oXmlHttp.status == 304) {
                } else {
                    alert('XML request error: ' + oXmlHttp.statusText + ' (' + oXmlHttp.status + ')');
                }
            }
        }
        oXmlHttp.open('GET', url, false);
        oXmlHttp.send(null);

        return oXmlHttp.responseText;
    },
    /**
     * 异步请求
     * @param url
     * @return {*}
     */
    asyncRequest:function (url) {
        if (!url)
            return;

        //xml请求对象
        var oXmlHttp = this.getXmlHttpRequest();

        oXmlHttp.onreadystatechange = function () {
            if (oXmlHttp.readyState == 4) {
                if (oXmlHttp.status == 200 || oXmlHttp.status == 304) {
                } else {
                    alert('XML request error: ' + oXmlHttp.statusText + ' (' + oXmlHttp.status + ')');
                }
            }
        };
        oXmlHttp.open('GET', url, true);
        oXmlHttp.send(null);

        return oXmlHttp.responseText;
    }
}