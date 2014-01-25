Ext.app.RobotModule = function (config) {
    Ext.apply(this, config);
    Ext.app.RobotModule.superclass.constructor.call(this);
    this.init();
}

Ext.extend(Ext.app.RobotModule, Ext.util.Observable, {
    init:Ext.emptyFn,
    showE:function (win) {
        var availWidth = Ext.get('x-desktop').getWidth(true);
        var availHeight = Ext.get('x-desktop').getHeight(true);
        var width = win.getWidth();
        var height = win.getHeight();
        var x = availWidth - width - 10;
        var y = availHeight - height - 10;

        win.setPosition(x, y);
    }
})
