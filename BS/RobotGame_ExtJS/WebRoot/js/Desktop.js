/**
 * 桌面类
 */
Ext.Desktop = function () {
    /**
     * 任务栏对象
     */
    this.taskBar = new Ext.ux.TaskBar();
    this.xTickSize = this.yTickSize = 1;
    //桌面DOM节点
    //var desktopEl = Ext.get('desktopPanel');
    var desktopEl = Ext.get('x-desktop');
    //桌面图标节点
    var shortcutsEl = Ext.get('x-shortcuts');
    //任务栏DOM节点
    var taskBarEl = Ext.get('ux-taskbar');
    //窗体组管理器
    var windowGroup = new Ext.WindowGroup();
    //活动窗体
    var activeWindow;

    //注册事件,浏览器窗口大小发生变化时,重新布局界面
    Ext.EventManager.onWindowResize(layout);
    //重新布局界面
    layout();
    //禁用右键菜单
    desktopEl.on('contextmenu', function (e) {
        e.stopEvent();
    }, this);
    //生成桌面
    if (shortcutsEl) {
        //从json数据中动态添加桌面图标
        for (var i = 0; i < shortcutJson.getCount(); i++) {
            var shortcutItem = shortcutJson.getAt(i);
            shortcutsEl.insertHtml("beforeEnd", "<dt  class=\"desktop_icon\" id=\"" + shortcutItem.get("id") + "-shortcut\">" +
                "<span class=\"icon\">"+
                "<img src=\"" + shortcutItem.get("img") + "\"/>" +
                "</span>"+
                "<div class=\"text\">" + shortcutItem.get("name") + "</div>" +
                "</dt>");
        }
        //注册点击事件
        shortcutsEl.on('click', function (e, t) {
            if (t = e.getTarget('dt', shortcutsEl)) {
                e.stopEvent();
                MainOS.desktop.openGameModule(t.id.replace('-shortcut', ''), true, 'game', 'template/Template1.js')
            }
        });

        var overEl;
        shortcutsEl.on('mouseover', function (e, t) {
            if (t = e.getTarget('dt', shortcutsEl)) {
                e.stopEvent();
                overEl = Ext.get(t);
                overEl.addClass("desktop_icon_over");
            }else{
                if(overEl!=null){
                    overEl.removeClass("desktop_icon_over");
                    overEl=null;
                }
            }
        });
    }

    /**
     * 最小化窗体
     * @param win
     */
    function minimizeWin(win) {
        win.minimized = true;
        win.hide();
    }

    /**
     * 标志窗体为活动窗体
     * @param win
     */
    function markActive(win) {
        //如果指定窗体已经为活动窗体则取消活动状态
        if (activeWindow && activeWindow != win) {
            markUnActive(activeWindow);
        }
        //设置任务栏活动对象
        this.taskBar.setActiveButton(win);
        activeWindow = win;
        Ext.fly(win.taskButton.el).addClass('active-win');
        win.minimized = false;
    }

    /**
     * 取消窗体的活动状态
     * @param win
     */
    function markUnActive(win) {
        if (win == activeWindow) {
            activeWindow = null;
            Ext.fly(win.taskButton.el).removeClass('active-win');
        }
    }

    /**
     * 移除窗体
     * @param win
     */
    function removeWin(win) {
        //移除任务栏对象
        this.taskBar.removeTaskButton(win);
        layout();
    }

    /**
     * 重新布局
     */
    function layout() {
        desktopEl.setHeight(Ext.lib.Dom.getViewHeight() - taskBarEl.getHeight());
        desktopEl.setWidth(Ext.lib.Dom.getViewWidth());
    }

    /**
     * 创建窗体
     * @param config
     * @param cls
     * @return {*}
     */
    this.createWindow = function (config, cls) {
        var win = new (cls || Ext.Window)(
            Ext.applyIf(config || {}, {
                renderTo:desktopEl, //设置渲染到desktopEl节点上
                manager:windowGroup, //设置管理器
                minimizable:true, //设置可最小化
                maximizable:true//设置可最大化
            })
        );
        win.dd.xTicke = this.xTickSize;
        win.dd.yTick = this.yTickSize;
        //渲染窗体
        win.render(desktopEl);

        if (win.id == DEFAULT_JS_EDITOR_WIN_ID) {//如果是编辑器窗体
            //动画锚点
            win.animateTarget = MainOS.quickStartButtons['showJSEditor'];
            //只有最小化事件
            win.on({
                'minimize':{
                    fn:minimizeWin
                }
            });
            layout();
            return win;
        } else if (win.id == DEFAULT_ROBOT_WIN_ID) {//如果是机器人窗体
            //动画锚点
            win.animateTarget = MainOS.robotQuickStartButtons[DEFAULT_ROBOT_ID];
            //只有最小化事件
            win.on({
                'minimize':{
                    fn:minimizeWin
                }
            });
            layout();
            return win;
        } else {  //其他窗体
            //添加任务栏按钮
            win.taskButton = this.taskBar.addTaskButton(win);
            //动画锚点
            win.animateTarget = win.taskButton.el;
            //注册事件
            win.on({
                'activate':{
                    fn:markActive
                },
                'beforeshow':{
                    fn:markActive
                },
                'deactivate':{
                    fn:markUnActive
                },
                'minimize':{
                    fn:minimizeWin
                },
                'close':{
                    fn:removeWin
                },
                scope:this
            });
            layout();
            return win;
        }
    };

    /**
     * 获取窗体组管理器
     * @return {Ext.WindowGroup}
     */
    this.getWindowGroup = function () {
        return windowGroup;
    };

    /**
     * 根据窗体id获取窗体对象
     * @param id
     * @return {*}
     */
    this.getWindow = function (id) {
        return windowGroup.get(id);
    };

    /**
     * 设置TickSize
     * @param xTickSize
     * @param yTickSize
     */
    this.setTickSize = function (xTickSize, yTickSize) {
        this.xTickSize = xTickSize;
        if (arguments.length == 1) {
            this.yTickSize = xTickSize;
        } else {
            this.yTickSize = yTickSize;
        }
        windowGroup.each(function (win) {
            win.dd.xTickSize = this.xTickSize;
            win.dd.yTickSize = this.yTickSize;
            win.resizer.widthIncrement = this.xTickSize;
            win.resizer.heightIncrement = this.yTickSize;
        }, this);
    };

    /**
     * 打开一个游戏模块
     * @param id
     *          游戏ID
     * @param isOpenEditor
     *          是否打开代码编辑器
     * @param editorType
     *          代码编辑器类型：game>游戏,robot>机器人
     * @param codeFile
     *          代码文件
     */
    this.openGameModule = function (id, isOpenEditor, editorType, codeFile) {
        var win = MainOS.desktop.getWindow(id + "-win");
        var module = ModuleLoader.getModule(id).instance;
        var editorWin = null;
        var editor = null;
        if (!win) {
            if (module) {
                module.createWindow();
                win = MainOS.desktop.getWindow(id + "-win");
                module.addDefaultToolBar();
            }
        }

        //打开代码编辑器
        if (isOpenEditor) {
            if (editorType == 'game') {//游戏类型
                editorWin = MainOS.desktop.getWindow(DEFAULT_JS_EDITOR_WIN_ID);
                editor = ModuleLoader.getModule(DEFAULT_JS_EDITOR_ID).instance;
                if (editorWin) {
                    if (editorWin.minimized) {
                        editorWin.show();
                    }
                    if (!editor.getEditorTab(module.id))
                        editor.addEditorTab(module.id);
                } else {
                    editor.init();
                    editor.createWindow();
                    editor.addEditorTab(module.id);
                }
                //载入代码文件
                if (codeFile) {
                    editor.loadSource(CG_Ajax.syncRequest(codeFile));
                }
                //注册事件
                win.addListener('show', module.showE);
                win.addListener('resize', module.resizeE);
                win.addListener('move', module.moveE);
                win.addListener('activate', module.moveE);
            } else if (editorType == 'robot') {//机器人类型
                editorWin = MainOS.desktop.getWindow(DEFAULT_ROBOT_JS_EDITOR_WIN_ID);
                editor = ModuleLoader.getModule(DEFAULT_ROBOT_JS_EDITOR_ID).instance;
                if (editorWin) {
                    if (editorWin.minimized) {
                        editorWin.show();
                    }
                    if (!editor.getEditorTab(module.id))
                        editor.addEditorTab(module.id);
                } else {
                    editor.createWindow();
                    editor.addEditorTab(module.id);
                }
                //载入代码文件
                if (codeFile)
                    editor.loadSource(JSLoader.getCode(codeFile))
            }
        }
    };
};
