/**
 * JavaScript代码编辑器
 */
DCC.editor.JSEditor = Ext.extend(DCC.editor.EditorModule, {
    id:DEFAULT_JS_EDITOR_ID,
    target:'',
    editorPanel:new Ext.TabPanel({
        id:'js-panel-editor',
        activeTab:0,
        enableTabScroll:true
    }),

    init:function () {
        function beforeRemoveTabEvent(tabPanel, tab) {
            var gameWin = MainOS.desktop.getWindow(tab.title + "-win");
            if (!gameWin) return true;
            DCC.widget.show({
                title:'Are you sure close',
                msg:'If you close this tab ,<br/>the game called ' + tab.title + ' will be closed at the same time.',
                buttons:Ext.Msg.YESNO,
                icon:Ext.Msg.QUESTION,
                fn:function (btn) {
                    if (btn == 'yes') {
                        if (gameWin) {
                            gameWin.close();
                        }
                        tabPanel.un('beforeremove', beforeRemoveTabEvent);
                        tabPanel.remove(tab);
                        tabPanel.addListener('beforeremove', beforeRemoveTabEvent, tabPanel);
                    }
                }
            });
            //DCC.widget.topAlert('','');
            //Ext.MessageBox.prompt('','');
            return false;
        }

        function afterRemoveTabEvent(tabPanel, tab) {
            if (tabPanel.items.length == 0) {
                var editorWin = MainOS.desktop.getWindow(DEFAULT_JS_EDITOR_WIN_ID);
                editorWin.hide();
                editorWin.minimized = true;
            }
        }

        this.editorPanel = new Ext.TabPanel({
            id:'js-panel-editor',
            activeTab:0,
            enableTabScroll:true,
            listeners:{
                tabchange:function (tabPanel, tab) {
                    if (!tab)return;
                    var gameWin = MainOS.desktop.getWindow(tab.title + "-win");
                    gameWin.toFront();
                    gameWin.fireEvent('move');
                },
                beforeremove:beforeRemoveTabEvent,
                remove:afterRemoveTabEvent
            },
            plugins:new Ext.ux.TabCloseMenu()
        })
    }, //init end

    createWindow:function () {
        var win = MainOS.desktop.getWindow(DEFAULT_JS_EDITOR_WIN_ID);
        if (!win) {
            win = MainOS.desktop.createWindow({
                id:DEFAULT_JS_EDITOR_WIN_ID,
                title:'Code Editor Window',
                width:500,
                height:500,
                iconCls:'icon-editor-win',
                shim:false,
                animCollapse:true,
                constrainHeader:true,
                maximizable:false,
                minimizable:true,
                closable:false,
                resizable:true,
                modal:false,

                layout:'fit',
                tbar:[
                    {
                        cls:"x-btn-icon",
                        iconCls:"icon-editor-loadsource",
                        handler:this.loadSource,
                        tooltip:"Load your source from local or web space",
                        scope:this
                    },
                    {
                        cls:"x-btn-icon",
                        iconCls:"icon-editor-savesource",
                        handler:this.saveSource,
                        tooltip:"Save your source to local or web space",
                        scope:this
                    },
                    {
                        cls:"x-btn-icon",
                        iconCls:"icon-editor-sharesource",
                        handler:this.shareSource,
                        tooltip:"Share your source to bbs",
                        scope:this
                    },
                    {
                        cls:"x-btn-icon",
                        iconCls:"icon-editor-runsource",
                        handler:this.runSource,
                        tooltip:"Run your source",
                        scope:this
                    }
                ],
                items:this.editorPanel
            });
        }//if end
        win.show();
    }//createWindow end
});
