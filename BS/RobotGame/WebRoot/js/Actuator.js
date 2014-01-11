/**
 * 执行器
 *
 * JHS
 */
Ext.Actuator = function (game) {
    //启动器窗体对象
    var win;
    //整个启动器的宽度
    var width;
    //整个启动器的高度
    var height = 600;
    //资源浏览器的宽度
    var explorer_width = 100;
    //编辑器的宽度
    var editor_width = 500;
    //游戏的宽度
    var game_width = 500;

//    //资源浏览器面板
//    this.explorer_panel;
//    //编辑器面板
//    this.editor_panel;
//    //游戏面板
//    this.game_panel;
//    //启动器面板
//    this.center_panel;

    this.init = function () {
//        game_width = game.getWindow().width;
        game_width = 200;
        width = explorer_width + editor_width + game_width;
    }

    this.createWindow = function () {
        if (!win) {
            //test
            var test_panel = new Ext.Panel({
                region:'north',
                split:true,
                collapsible:true, //可收缩
                frameHeader:false,
                frame:false,
                height:100
            });
            //资源浏览器面板
            var explorer_panel = new Ext.Panel({
                title: 'Explorer',
                region:'west',
                split:true,
                collapsible:true, //可收缩
                width:explorer_width
            });
            //编辑器面板
            var editor_panel = new Ext.Panel({
                region:'center',
                layout: 'fit',
                frameHeader:true,
                frame:false,
                margins: '5 5 0 0'
            });
            //游戏面板
            var game_panel = new Ext.Panel({
                title: 'Game',
                split:true,
                region:'east',
                collapsible:true, //可收缩
                width:game_width
            });

            win = MainOS.desktop.createWindow({
                id:game.id + "-actuator",
                title:game.id + ' Actuator Window',
                width:width,
                height:height,
                iconCls:'icon-actuator-win',
                shim:false,
                animCollapse:true,
                constrainHeader:true,
                maximizable:true,
                minimizable:true,
                closable:true,
                resizable:true,
                modal:false,

                layout:'border',
                items: [explorer_panel,editor_panel,game_panel,test_panel]
            });
        }//if end
        win.show();
    }
};