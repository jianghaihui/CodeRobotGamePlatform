// JavaScript Document
DCC.editor.RobotEditor = Ext.extend(DCC.editor.EditorModule, {
    id:'robot-win-editor',
    target:'',
    editorPanel:new Ext.TabPanel({
        id:'robot-panel-editor',
        activeTab:0,
        enableTabScroll:true
    }),

    createWindow:function () {
        var win = MainOS.desktop.getWindow('robot-win-editor');
        if (!win) {
            win = MainOS.desktop.createWindow({
                id:'robot-win-editor',
                title:'Robot Code Editor Window',
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
