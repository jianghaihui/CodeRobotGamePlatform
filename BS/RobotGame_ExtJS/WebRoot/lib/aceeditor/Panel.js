/**
 * @class Ext.ux.aceeditor.Panel
 * @extends Ext.panel.Panel
 *
 * @author Harald Hanek (c) 2011-2012
 * @license http://harrydeluxe.mit-license.org
 */
var ACEPanel = function (config) {
    var me = this;

    me.addEvents({
            'editorcreated':true
        },
        'change');

    ACEPanel.superclass.constructor.call(this, config);
}
Ext.extend(ACEPanel, Ext.Panel, {
    layout:'fit',
    autofocus:true,
    border:false,

    path:'',
    sourceCode:'',
    fontSize:'12px',
    theme:'clouds',
    printMargin:false,
    printMarginColumn:80,
    highlightActiveLine:true,
    highlightGutterLine:true,
    highlightSelectedWord:true,
    showGutter:true,
    fullLineSelection:true,
    tabSize:4,
    useSoftTabs:false,
    showInvisible:false,
    useWrapMode:false,
    codeFolding:true,

    listeners:{
        resize:function () {
            if (this.editor) {
                this.editor.resize();
            }
        },
        activate:function () {
            if (this.editor && this.autofocus) {
                this.editor.focus();
            }
        }
    },

    initComponent:function () {
        var me = this,
            items = {
                xtype:'component',
                autoEl:'pre'
            };

        Ext.apply(me, {
            items:items
        });

        ACEPanel.superclass.initComponent.call(this, arguments);
        //me.callParent(arguments);
    },

    initEditor:function () {
        var me = this;

        me.editor = ace.edit(me.editorId);
        me.editor.ownerCt = me;
        me.setMode(me.parser);
        me.setTheme(me.theme);
        me.editor.getSession().setUseWrapMode(me.useWrapMode);
        me.editor.setShowFoldWidgets(me.codeFolding);
        me.editor.setShowInvisibles(me.showInvisible);
        me.editor.setHighlightGutterLine(me.highlightGutterLine);
        me.editor.setHighlightSelectedWord(me.highlightSelectedWord);
        me.editor.renderer.setShowGutter(me.showGutter);
        me.setFontSize(me.fontSize);
        me.editor.setShowPrintMargin(me.printMargin);
        me.editor.setPrintMarginColumn(me.printMarginColumn);
        me.editor.setHighlightActiveLine(me.highlightActiveLine);
        me.getSession().setTabSize(me.tabSize);
        me.getSession().setUseSoftTabs(me.useSoftTabs);
        me.setValue(me.sourceCode);

        me.editor.getSession().on('change', function () {
            me.fireEvent('change', me);

        }, me);

        if (me.autofocus)
            me.editor.focus();
        else {
            me.editor.renderer.hideCursor();
            me.editor.blur();
        }

        me.editor.initialized = true;
        me.fireEvent('editorcreated', me);
    },

    getEditor:function () {
        return this.editor;
    },

    getSession:function () {
        return this.editor.getSession();
    },

    getTheme:function () {
        return this.editor.getTheme();
    },

    setTheme:function (name) {
        this.editor.setTheme(name);
    },

    setMode:function (mode) {
        this.getSession().setMode(mode);
//        this.getSession().setMode("ace/js/mode/" + mode);
    },

    getValue:function () {
        return this.editor.getSession().getValue();
    },

    setValue:function (value) {
        this.editor.getSession().setValue(value);
    },

    setFontSize:function (value) {
        this.editor.setFontSize(value);
    },

    undo:function () {
        this.editor.undo();
    },

    redo:function () {
        this.editor.redo();
    },

    onRender:function () {
        var me = this;

        if (me.sourceEl != null) {
            //me.sourceCode = Ext.get(me.sourceEl).getHTML();
            //me.sourceCode = Ext.get(me.sourceEl).dom.innerHTML; 
            me.sourceCode = Ext.get(me.sourceEl).dom.outerText;
            //me.sourceCode = Ext.get(me.sourceEl).dom.value;
        }

        me.editorId = me.items.keys[0];
        me.oldSourceCode = me.sourceCode;

        ACEPanel.superclass.onRender.apply(this, arguments);
        //me.callParent(arguments);

        // init editor on afterlayout
        me.on('afterlayout', function () {
            if (me.url) {
                Ext.Ajax.request({
                    url:me.url,
                    success:function (response) {
                        me.sourceCode = response.responseText;
                        me.initEditor();
                    }
                });
            }
            else {
                me.initEditor();
            }

        }, me, {
            single:true
        });
    }
});
Ext.reg('ACEPanel', ACEPanel);