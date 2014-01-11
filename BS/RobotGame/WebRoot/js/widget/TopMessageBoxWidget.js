//expanded list must be on the very top level
Ext.form.ComboBox.prototype.initComponent = Ext.form.ComboBox.prototype.initComponent.createSequence(function () {
    this.on('render', function () {
            var zindex = Ext.WindowMgr.zseed + 5000;
            this.on('expand', function () {
                    this.list.setStyle("z-index", zindex.toString());
                },
                this,
                {single:true}
            );
        },
        this,
        {single:true}
    )
});

//put alert-Box on the top level (50000)
DCC.widget.alert = function () {
    var _mb_alert = Ext.MessageBox.alert;
    var zseed = Ext.WindowMgr.zseed;
    Ext.WindowMgr.zseed = 20000;
    var res = _mb_alert.apply(Ext.MessageBox, arguments);
    Ext.WindowMgr.zseed = zseed;
    return res;
};

//put confirm-Box on the top level (50000)
DCC.widget.confirm = function () {
    var _mb_alert = Ext.MessageBox.confirm;
    var zseed = Ext.WindowMgr.zseed;
    Ext.WindowMgr.zseed = 20000;
    var res = _mb_alert.apply(Ext.MessageBox, arguments);
    Ext.WindowMgr.zseed = zseed;
    return res;
};

//put prompt-Box on the top level (50000)
DCC.widget.prompt = function () {
    var _mb_alert = Ext.MessageBox.prompt;
    var zseed = Ext.WindowMgr.zseed;
    Ext.WindowMgr.zseed = 20000;
    var res = _mb_alert.apply(Ext.MessageBox, arguments);
    Ext.WindowMgr.zseed = zseed;
    return res;
};

//put show-Box on the top level (50000)
DCC.widget.show = function () {
    var _mb_alert = Ext.MessageBox.show;
    var zseed = Ext.WindowMgr.zseed;
    Ext.WindowMgr.zseed = 20000;
    var res = _mb_alert.apply(Ext.MessageBox, arguments);
    Ext.WindowMgr.zseed = zseed;
    return res;
};