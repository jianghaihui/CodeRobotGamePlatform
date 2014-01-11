DCC.game.Test = Ext.extend(Ext.app.GameModule, {
    id:'test-win-game',
    init:function () {

    },
    createWindow:function () {
        var win = this.getWindow();
        if (!win) {
            win = MainOS.desktop.createWindow({
                id:'test-win-game',
                title:'test',
                width:200,
                height:300,
                html:'<p>Something useful would be in here.</p>',
                iconCls:'bogus',
                shim:false,
                animCollapse:false,
                constrainHeader:true
            });
        }
        win.show();
    }
});