/*!
 * Ext JS Library 3.2.0
 * Copyright(c) 2006-2010 Ext JS, Inc.
 * licensing@extjs.com
 * http://www.extjs.com/license
 */
/**
 * 任务栏类
 *
 * JHS
 */
Ext.ux.TaskBar = function () {
    this.init();
}

Ext.extend(Ext.ux.TaskBar, Ext.util.Observable, {
    //任务栏DOM节点
    el:null,

    /**
     * 初始化任务栏
     */
    init:function () {
        //初始化开始菜单
        this.startMenu = new Ext.ux.StartMenu(Ext.apply({
            height:300,
            shadow:true,
            title:'Guest',
            width:250
        }, MainOS.startConfig));

        //初始化开始按钮
        this.startBtn = new Ext.Button({
            text:'Start',
            id:'ux-startbutton',
            iconCls:'start',
            menu:this.startMenu,
            menuAlign:'bl-tl',
            renderTo:'ux-taskbar-start',
            clickEvent:'mousedown',
            template:new Ext.Template(
                '<table cellspacing="0" class="x-btn"><tbody class="{1}"><tr>',
                '<td class="ux-startbutton-left"><i>&#160;</i></td>',
                '<td class="ux-startbutton-center"><em class="{2} unselectable="on">',
                '<button class="x-btn-text" type="{0}" style="height:30px;"></button>',
                '</em></td>',
                '<td class="ux-startbutton-right"><i>&#160;</i></td>',
                '</tr></tbody></table>')
        });

        //左边快速启动栏
        this.quickStartPanel_L = new Ext.ux.QuickStartPanel({
            el:'ux-quickstart-l-panel',
            id:'TaskBarQuickStart_L',
            minWidth:75,
            region:'west',
            split:true,
            width:75
        });

        //右边快速启动栏
        this.quickStartPanel_R = new Ext.ux.QuickStartPanel({
            el:'ux-quickstart-r-panel',
            id:'TaskBarQuickStart_R',
            minWidth:35,
            split:true,
            region:'east',
            width:35
        });

        //任务栏按钮面板
        this.tbPanel = new Ext.ux.TaskButtonsPanel({
            el:'ux-taskbuttons-panel',
            id:'TaskBarButtons',
            region:'center'
        });

        //开始按钮占用宽度
        var width = this.startBtn.getEl().getWidth() + 10;
        //开始按钮包围框
        var sbBox = new Ext.BoxComponent({
            el:'ux-taskbar-start',
            id:'TaskBarStart',
            minWidth:width,
            region:'west',
            split:false,
            width:width
        });

        //任务栏面板,包含了左右快速启动栏和任务栏按钮面板
        var panelWrap = new Ext.Container({
            el:'ux-taskbar-panel-wrap',
            items:[this.quickStartPanel_L, this.tbPanel, this.quickStartPanel_R],
            layout:'border',
            region:'center'
        });

        //任务栏
        var container = new Ext.ux.TaskBarContainer({
            el:'ux-taskbar',
            layout:'border',
            items:[sbBox, panelWrap]
        });

        this.el = container.el;

        return this;
    },

    /**
     * 添加任务栏按钮
     * @param win
     *      关联的窗体对象
     */
    addTaskButton:function (win) {
        return this.tbPanel.addButton(win);
    },

    /**
     * 删除任务栏按钮
     * @param btn
     *      关联的窗体对象
     */
    removeTaskButton:function (win) {
        this.tbPanel.removeButton(win);
    },

    /**
     * 设置任务栏活动按钮
     * @param win
     *      关联的窗体对象
     */
    setActiveButton:function (win) {
        this.tbPanel.setActiveButton(win.taskButton);
    }
});


/**
 * 任务栏面板类
 * @class Ext.ux.TaskBarContainer
 * @extends Ext.Container
 */
Ext.ux.TaskBarContainer = Ext.extend(Ext.Container, {
    initComponent:function () {
        Ext.ux.TaskBarContainer.superclass.initComponent.call(this);

        this.el = Ext.get(this.el) || Ext.getBody();
        this.el.setHeight = Ext.emptyFn;
        this.el.setWidth = Ext.emptyFn;
        this.el.setSize = Ext.emptyFn;
        this.el.setStyle({
            overflow:'hidden',
            margin:'0',
            border:'0 none'
        });
        this.el.dom.scroll = 'no';
        this.allowDomMove = false;
        this.autoWidth = true;
        this.autoHeight = true;
        Ext.EventManager.onWindowResize(this.fireResize, this);
        this.renderTo = this.el;
    },

    fireResize:function (w, h) {
        this.onResize(w, h, w, h);
        this.fireEvent('resize', this, w, h, w, h);
    }
});


/**
 * 任务栏按钮面板类（支持滚动功能）
 * @class Ext.ux.TaskButtonsPanel
 * @extends Ext.BoxComponent
 */
Ext.ux.TaskButtonsPanel = Ext.extend(Ext.BoxComponent, {
    activeButton:null,
    enableScroll:true,
    scrollIncrement:0,
    scrollRepeatInterval:400,
    scrollDuration:.35,
    animScroll:true,
    resizeButtons:true,
    buttonWidth:168,
    minButtonWidth:118,
    buttonMargin:2,
    buttonWidthSet:false,

    initComponent:function () {
        Ext.ux.TaskButtonsPanel.superclass.initComponent.call(this);
        this.on('resize', this.delegateUpdates);
        this.items = [];

        this.stripWrap = Ext.get(this.el).createChild({
            cls:'ux-taskbuttons-strip-wrap',
            cn:{
                tag:'ul', cls:'ux-taskbuttons-strip'
            }
        });
        this.stripSpacer = Ext.get(this.el).createChild({
            cls:'ux-taskbuttons-strip-spacer'
        });
        this.strip = new Ext.Element(this.stripWrap.dom.firstChild);

        this.edge = this.strip.createChild({
            tag:'li',
            cls:'ux-taskbuttons-edge'
        });
        this.strip.createChild({
            cls:'x-clear'
        });
    },

    addButton:function (win) {
        var li = this.strip.createChild({tag:'li'}, this.edge); // insert before the edge
        var btn = new Ext.ux.TaskBar.TaskButton(win, li);

        this.items.push(btn);

        if (!this.buttonWidthSet) {
            this.lastButtonWidth = btn.container.getWidth();
        }

        this.setActiveButton(win);
        return btn;
    },

    removeButton:function (win) {
        var btn =win.taskButton;
        var li = document.getElementById(btn.container.id);
        btn.destroy();
        li.parentNode.removeChild(li);

        var s = [];
        for (var i = 0, len = this.items.length; i < len; i++) {
            if (this.items[i] != btn) {
                s.push(this.items[i]);
            }
        }
        this.items = s;

        this.delegateUpdates();
    },

    setActiveButton:function (btn) {
        this.activeButton = btn;
        this.delegateUpdates();
    },

    delegateUpdates:function () {
        if (this.resizeButtons && this.rendered) {
            this.autoSize();
        }
        if (this.enableScroll && this.rendered) {
            this.autoScroll();
        }
    },

    autoSize:function () {
        var count = this.items.length;
        var ow = this.el.dom.offsetWidth;
        var aw = this.el.dom.clientWidth;

        if (!this.resizeButtons || count < 1 || !aw) { // !aw for display:none
            return;
        }

        var each = Math.max(Math.min(Math.floor((aw - 4) / count) - this.buttonMargin, this.buttonWidth), this.minButtonWidth); // -4 for float errors in IE
        var btns = this.stripWrap.dom.getElementsByTagName('button');

        this.lastButtonWidth = Ext.get(btns[0].id).findParent('li').offsetWidth;

        for (var i = 0, len = btns.length; i < len; i++) {
            var btn = btns[i];

            var tw = Ext.get(btns[i].id).findParent('li').offsetWidth;
            var iw = btn.offsetWidth;

            btn.style.width = (each - (tw - iw)) + 'px';
        }
    },

    autoScroll:function () {
        var count = this.items.length;
        var ow = this.el.dom.offsetWidth;
        var tw = this.el.dom.clientWidth;

        var wrap = this.stripWrap;
        var cw = wrap.dom.offsetWidth;
        var pos = this.getScrollPos();
        var l = this.edge.getOffsetsTo(this.stripWrap)[0] + pos;

        if (!this.enableScroll || count < 1 || cw < 20) { // 20 to prevent display:none issues
            return;
        }

        wrap.setWidth(tw); // moved to here because of problem in Safari

        if (l <= tw) {
            wrap.dom.scrollLeft = 0;
            //wrap.setWidth(tw); moved from here because of problem in Safari
            if (this.scrolling) {
                this.scrolling = false;
                this.el.removeClass('x-taskbuttons-scrolling');
                this.scrollLeft.hide();
                this.scrollRight.hide();
            }
        } else {
            if (!this.scrolling) {
                this.el.addClass('x-taskbuttons-scrolling');
            }
            tw -= wrap.getMargins('lr');
            wrap.setWidth(tw > 20 ? tw : 20);
            if (!this.scrolling) {
                if (!this.scrollLeft) {
                    this.createScrollers();
                } else {
                    this.scrollLeft.show();
                    this.scrollRight.show();
                }
            }
            this.scrolling = true;
            if (pos > (l - tw)) { // ensure it stays within bounds
                wrap.dom.scrollLeft = l - tw;
            } else { // otherwise, make sure the active button is still visible
                this.scrollToButton(this.activeButton, true); // true to animate
            }
            this.updateScrollButtons();
        }
    },

    createScrollers:function () {
        var h = this.el.dom.offsetHeight; //var h = this.stripWrap.dom.offsetHeight;

        // left
        var sl = this.el.insertFirst({
            cls:'ux-taskbuttons-scroller-left'
        });
        sl.setHeight(h);
        sl.addClassOnOver('ux-taskbuttons-scroller-left-over');
        this.leftRepeater = new Ext.util.ClickRepeater(sl, {
            interval:this.scrollRepeatInterval,
            handler:this.onScrollLeft,
            scope:this
        });
        this.scrollLeft = sl;

        // right
        var sr = this.el.insertFirst({
            cls:'ux-taskbuttons-scroller-right'
        });
        sr.setHeight(h);
        sr.addClassOnOver('ux-taskbuttons-scroller-right-over');
        this.rightRepeater = new Ext.util.ClickRepeater(sr, {
            interval:this.scrollRepeatInterval,
            handler:this.onScrollRight,
            scope:this
        });
        this.scrollRight = sr;
    },

    getScrollWidth:function () {
        return this.edge.getOffsetsTo(this.stripWrap)[0] + this.getScrollPos();
    },

    getScrollPos:function () {
        return parseInt(this.stripWrap.dom.scrollLeft, 10) || 0;
    },

    getScrollArea:function () {
        return parseInt(this.stripWrap.dom.clientWidth, 10) || 0;
    },

    getScrollAnim:function () {
        return {
            duration:this.scrollDuration,
            callback:this.updateScrollButtons,
            scope:this
        };
    },

    getScrollIncrement:function () {
        return (this.scrollIncrement || this.lastButtonWidth + 2);
    },

    scrollToButton:function (item, animate) {
        item = item.el.dom.parentNode; // li
        if (!item) {
            return;
        }
        var el = item; //this.getBtnEl(item);
        var pos = this.getScrollPos(), area = this.getScrollArea();
        var left = Ext.fly(el).getOffsetsTo(this.stripWrap)[0] + pos;
        var right = left + el.offsetWidth;
        if (left < pos) {
            this.scrollTo(left, animate);
        } else if (right > (pos + area)) {
            this.scrollTo(right - area, animate);
        }
    },

    scrollTo:function (pos, animate) {
        this.stripWrap.scrollTo('left', pos, animate ? this.getScrollAnim() : false);
        if (!animate) {
            this.updateScrollButtons();
        }
    },

    onScrollRight:function () {
        var sw = this.getScrollWidth() - this.getScrollArea();
        var pos = this.getScrollPos();
        var s = Math.min(sw, pos + this.getScrollIncrement());
        if (s != pos) {
            this.scrollTo(s, this.animScroll);
        }
    },

    onScrollLeft:function () {
        var pos = this.getScrollPos();
        var s = Math.max(0, pos - this.getScrollIncrement());
        if (s != pos) {
            this.scrollTo(s, this.animScroll);
        }
    },

    updateScrollButtons:function () {
        var pos = this.getScrollPos();
        this.scrollLeft[pos == 0 ? 'addClass' : 'removeClass']('ux-taskbuttons-scroller-left-disabled');
        this.scrollRight[pos >= (this.getScrollWidth() - this.getScrollArea()) ? 'addClass' : 'removeClass']('ux-taskbuttons-scroller-right-disabled');
    }
});


/**
 * 任务栏按钮类
 * @class Ext.ux.TaskBar.TaskButton
 * @extends Ext.Button
 */
Ext.ux.TaskBar.TaskButton = function (win, el) {
    this.win = win;
    Ext.ux.TaskBar.TaskButton.superclass.constructor.call(this, {
        iconCls:win.iconCls,
        text:Ext.util.Format.ellipsis(win.title, 12),
        renderTo:el,
        handler:function () {
            if (win.minimized || win.hidden) {
                win.show();
            } else if (win == win.manager.getActive()) {
                win.minimize();
            } else {
                win.toFront();
            }
        },
        clickEvent:'mousedown',
        template:new Ext.Template(
            '<table cellspacing="0" class="x-btn {3}"><tbody><tr>',
            '<td class="ux-taskbutton-left"><i>&#160;</i></td>',
            '<td class="ux-taskbutton-center"><em class="{5} unselectable="on">',
            '<button class="x-btn-text {2}" type="{1}" style="height:28px;">{0}</button>',
            '</em></td>',
            '<td class="ux-taskbutton-right"><i>&#160;</i></td>',
            "</tr></tbody></table>")
    });
};

/**
 * 扩展任务栏按钮类
 */
Ext.extend(Ext.ux.TaskBar.TaskButton, Ext.Button, {
    onRender:function () {
        Ext.ux.TaskBar.TaskButton.superclass.onRender.apply(this, arguments);

        this.cmenu = new Ext.menu.Menu({
            items:[
                {
                    text:'Restore',
                    handler:function () {
                        if (!this.win.isVisible()) {
                            this.win.show();
                        } else {
                            this.win.restore();
                        }
                    },
                    scope:this
                },
                {
                    text:'Minimize',
                    handler:this.win.minimize,
                    scope:this.win
                },
                {
                    text:'Maximize',
                    handler:this.win.maximize,
                    scope:this.win
                },
                '-',
                {
                    text:'Close',
                    handler:this.closeWin.createDelegate(this, this.win, true),
                    scope:this.win
                }
            ]
        });

        this.cmenu.on('beforeshow', function () {
            var items = this.cmenu.items.items;
            var w = this.win;
            items[0].setDisabled(w.maximized !== true && w.hidden !== true);
            items[1].setDisabled(w.minimized === true);
            items[2].setDisabled(w.maximizable == false || w.hidden === true);
            items[4].setDisabled(w.closable == false);
        }, this);

        this.el.on('contextmenu', function (e) {
            e.stopEvent();
            if (!this.cmenu.el) {
                this.cmenu.render();
            }
            var xy = e.getXY();
            xy[1] -= this.cmenu.el.getHeight();
            this.cmenu.showAt(xy);
        }, this);
    },

    closeWin:function (cMenu, e, win) {
        if (!win.isVisible()) {
            win.show();
        } else {
            win.restore();
        }
        win.close();
    }
});

/**
 * 快速启动栏类
 * @class Ext.ux.QuickStartPanel
 * @extends Ext.BoxComponent
 */
Ext.ux.QuickStartPanel = Ext.extend(Ext.BoxComponent, {
    enableMenu:true,

    initComponent:function () {
        Ext.ux.QuickStartPanel.superclass.initComponent.call(this);

        this.on('resize', this.delegateUpdates);

        this.menu = new Ext.menu.Menu();

        this.items = [];

        this.stripWrap = Ext.get(this.el).createChild({
            cls:'ux-quickstart-strip-wrap',
            cn:{tag:'ul', cls:'ux-quickstart-strip'}
        });

        this.stripSpacer = Ext.get(this.el).createChild({
            cls:'ux-quickstart-strip-spacer'
        });

        this.strip = new Ext.Element(this.stripWrap.dom.firstChild);

        this.edge = this.strip.createChild({
            tag:'li',
            cls:'ux-quickstart-edge'
        });

        this.strip.createChild({
            cls:'x-clear'
        });
    },

    add:function (config) {
        var li = this.strip.createChild({tag:'li'}, this.edge); // insert before the edge

        var btn = new Ext.Button(Ext.apply(config, {
            cls:'x-btn-icon',
            menuText:config.text,
            renderTo:li,
            text:'' // do not display text
        }));

        this.items.push(btn);

        this.delegateUpdates();

        return btn;
    },

    remove:function (btn) {
        var li = document.getElementById(btn.container.id);
        btn.destroy();
        li.parentNode.removeChild(li);

        var s = [];
        for (var i = 0, len = this.items.length; i < len; i++) {
            if (this.items[i] != btn) {
                s.push(this.items[i]);
            }
        }
        this.items = s;

        this.delegateUpdates();
    },

    menuAdd:function (config) {
        this.menu.add(config);
    },

    delegateUpdates:function () {
        if (this.enableMenu && this.rendered) {
            this.showButtons();
            this.clearMenu();
            this.autoMenu();
        }
    },

    showButtons:function () {
        var count = this.items.length;

        for (var i = 0; i < count; i++) {
            this.items[i].show();
        }
    },

    clearMenu:function () {
        this.menu.removeAll();
    },

    autoMenu:function () {
        var count = this.items.length;
        var ow = this.el.dom.offsetWidth;
        var tw = this.el.dom.clientWidth;

        var wrap = this.stripWrap;
        var cw = wrap.dom.offsetWidth;
        var l = this.edge.getOffsetsTo(this.stripWrap)[0];

        if (!this.enableMenu || count < 1 || cw < 20) { // 20 to prevent display:none issues
            return;
        }

        wrap.setWidth(tw);

        if (l <= tw) {
            if (this.showingMenu) {
                this.showingMenu = false;
                this.menuButton.hide();
            }
        } else {
            tw -= wrap.getMargins('lr');

            wrap.setWidth(tw > 20 ? tw : 20);

            if (!this.showingMenu) {
                if (!this.menuButton) {
                    this.createMenuButton();
                } else {
                    this.menuButton.show();
                }
            }

            mo = this.getMenuButtonPos();

            for (var i = count - 1; i >= 0; i--) {
                var bo = this.items[i].el.dom.offsetLeft + this.items[i].el.dom.offsetWidth;

                if (bo > mo) {
                    this.items[i].hide();

                    var ic = this.items[i].initialConfig,
                        config = {
                            iconCls:ic.iconCls,
                            handler:ic.handler,
                            scope:ic.scope,
                            text:ic.menuText
                        };

                    this.menuAdd(config);
                } else {
                    this.items[i].show();
                }
            }

            this.showingMenu = true;
        }
    },

    createMenuButton:function () {

        var h = this.el.dom.offsetHeight;

        var mb = this.el.insertFirst({
            cls:'ux-quickstart-menubutton-wrap'

        });

        mb.setHeight(h);

        var btn = new Ext.Button({
            cls:'x-btn-icon',
            id:'ux-quickstart-menubutton',
            menu:this.menu,
            renderTo:mb
        });

        mb.setWidth(Ext.get('ux-quickstart-menubutton').getWidth());

        this.menuButton = mb;
    },

    getMenuButtonPos:function () {
        return this.menuButton.dom.offsetLeft;
    }
});
