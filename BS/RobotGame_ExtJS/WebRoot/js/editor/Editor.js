/**
 * 编辑器
 */
var Editor = function (config) {
    Editor.superclass.constructor.call(this, config);
}
Ext.extend(Editor,ACEPanel, {

    enableFormat:false,
    enableFontSize:false,
    enableColors:false,
    enableAlignments:false,
    enableLists:false,
    enableSourceEdit:false,
    enableLinks:false,
    enableFont:false,

    enableKeyEvents:true,

    target:' ',

    setTarget:function (target) {
        this.target = target;
    },
    getTarget:function () {
        return target;
    },

    getSource:function () {
        var source = this.getValue();
        source = source.replace(new RegExp('; ', 'g'), ';');
        source = source.replace(new RegExp('&nbsp;', 'g'), '');
        source = Ext.util.Format.stripTags(source);
        source = Ext.util.Format.htmlDecode(source);
        return source;
    },

    setSource:function (source) {
        this.setValue(source);
    }
});//HTMLEditor end
Ext.reg('Editor', Editor);
