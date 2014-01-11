/**
 * 系统类
 */
Ext.app.OS = function (cfg) {
    Ext.apply(this, cfg);
    this.addEvents({
        'ready':true,
        'beforeunload':true
    });
};

Ext.extend(Ext.app.OS, Ext.util.Observable, {
    //开始按钮配置信息
    startConfig:null,
    //桌面对象
    desktop:null,
    //快速启动栏按钮数组
    quickStartButtons:[],
    //机器人快速启动按钮数组
    robotQuickStartButtons:[],

    //获取开始按钮配置(右外部调用者提供)
    getStartConfig:Ext.emptyFn(),
    //初始化(右外部调用者提供)
    init:Ext.emptyFn(),

    /**
     * 初始化
     */
    initOS:function () {
        //设置开始按钮配置信息
        this.startConfig = this.startConfig || this.getStartConfig();
        //实例化桌面对象
        this.desktop = new Ext.Desktop();
        //调用外部实现的初始化方法
        this.init();
        //初始化快速启动栏
        this.initQuickStartBar();
        //初始化机器人快速栏
        this.initRobotQuickStartBar();
        //初始化启动菜单
        this.initLauncher();

        //不理解什么作用
        Ext.EventManager.on(window, 'beforeunload', this.onUnload, this);
        //不理解什么作用
        this.fireEvent('ready', this);
    },

    /**
     * 初始化快速启动栏
     */
    initQuickStartBar:function () {
        //添加显示桌面按钮
        var showDesktopBtn = this.desktop.taskBar.quickStartPanel_L.add({
            handler:function () {
                //点击将所有窗体最小化
                this.desktop.getWindowGroup().each(function (win) {
                    if (!win.minimized) {
                        win.minimized = true;
                        win.hide();
                    }
                }, this)
            },
            iconCls:'showdesktop-quick-start-button',
            scope:this,
            tooltip:'Show Desktop'
        });
        //添加显示JS编辑器
        var showJSEditor = this.desktop.taskBar.quickStartPanel_L.add({
            handler:function () {
                var editor = ModuleLoader.getModule(DEFAULT_JS_EDITOR_ID).instance;
                var editorWin = MainOS.desktop.getWindow(DEFAULT_JS_EDITOR_WIN_ID);

                //如果编辑器不存在就创建一个新的
                if (editorWin) {
                    if (editorWin.minimized) {
                        editorWin.show();
                        editorWin.minimized = false;
                    } else {
                        editorWin.hide();
                        editorWin.minimized = true;
                    }
                } else {
                    editor.createWindow();
                }
            },
            iconCls:'js-quick-start-button',
            scope:this,
            tooltip:'Show JSEditor'
        });

        this.quickStartButtons['showDesktopBtn'] = showDesktopBtn;
        this.quickStartButtons['showJSEditor'] = showJSEditor;
    },

    /**
     * 初始化机器人快速启动栏
     */
    initRobotQuickStartBar:function () {
        //添加1号机器人David
        var david = this.desktop.taskBar.quickStartPanel_R.add({
            id:'david-robot-win-button',
            handler:function (btn) {
                var robotWin = MainOS.desktop.getWindow(DEFAULT_ROBOT_WIN_ID);
                var robot = ModuleLoader.getModule(DEFAULT_ROBOT_ID).instance;
                if (robotWin) {
                    if (robotWin.minimized) {
                        robotWin.show();
                        robotWin.minimized = false;
                    } else {
                        robotWin.hide();
                        robotWin.minimized = true;
                    }
                } else {
                    robot.createWindow();
                }
            },
            iconCls:'david-robot-quick-start-button',
            scope:this,
            tooltip:'David Robot'
        });

        this.robotQuickStartButtons[DEFAULT_ROBOT_ID] = david;
    },

    /**
     * 初始化启动菜单
     */
    initLauncher:function () {
        //游戏菜单
        var gameMenu = new Ext.menu.Menu({
            id:'ux-start-game-menu',
            iconCls:'icon-ux-start-game-menu'
        });
        //从json中读取数据
        for (var i = 0, len = gameLauncherJson.getCount(); i < len; i++) {
            var gameJsonItem = gameLauncherJson.getAt(i);
            gameMenu.add({
                id:gameJsonItem.get('id'),
                text:gameJsonItem.get('text'),
                iconCls:gameJsonItem.get('iconCls'),
                handler:function(_this){
                    MainOS.desktop.openGameModule(_this.id.replace('-start', ''), true, 'game', 'template/Template1.js');
                },
                scope:this
            });
        }
        //游戏菜单项
        var gameItem = new Ext.menu.Item({
            id:'ux-start-game-item',
            iconCls:'icon-ux-start-game-item',
            text:'Game',
            handler:function () {
                return false;
            },
            menu:gameMenu
        });
        //添加到开始按钮
        this.desktop.taskBar.startMenu.add(gameItem);
    },

    /**
     * 不清楚什么作用
     */
    onReady:function (fn, scope) {
        this.on('ready', fn, scope);
    },

    /**
     * 不清楚什么作用
     */
    onUnload:function (e) {
        if (this.fireEvent('beforeunload', this) === false) {
            e.stopEvent();
        }
    }
});
