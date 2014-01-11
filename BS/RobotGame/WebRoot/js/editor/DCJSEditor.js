var DCJSEditor = Ext.extend(Ext.form.HtmlEditor, {

    enableFormat:false,
    /**
     * @cfg {Boolean} enableFontSize Enable the increase/decrease font size buttons (defaults to true)
     */
    enableFontSize:false,
    /**
     * @cfg {Boolean} enableColors Enable the fore/highlight color buttons (defaults to true)
     */
    enableColors:false,
    /**
     * @cfg {Boolean} enableAlignments Enable the left, center, right alignment buttons (defaults to true)
     */
    enableAlignments:false,
    /**
     * @cfg {Boolean} enableLists Enable the bullet and numbered list buttons. Not available in Safari. (defaults to true)
     */
    enableLists:false,
    /**
     * @cfg {Boolean} enableSourceEdit Enable the switch to source edit button. Not available in Safari. (defaults to true)
     */
    enableSourceEdit:false,
    /**
     * @cfg {Boolean} enableLinks Enable the create link button. Not available in Safari. (defaults to true)
     */
    enableLinks:false,
    /**
     * @cfg {Boolean} enableFont Enable font selection. Not available in Safari. (defaults to true)
     */
    enableFont:false,

    enableKeyEvents:true,

    target:' ',

    setTarget:function (target) {
        this.target = target;
    },
    getTarget:function () {
        return target;
    },

    //extends superclass
    initEditor:function () {
        DCJSEditor.superclass.initEditor.call(this);
        doc = this.getDoc();
        if (Ext.isGecko) {
            Ext.EventManager.on(doc, 'keypress', this.keyBoardListener, this);
        }
        if (Ext.isIE || Ext.isWebKit || Ext.isOpera) {
            Ext.EventManager.on(doc, 'keydown', this.keyBoardListener, this);
        }
        //Ext.EventManager.on(doc, 'keyup', this.lightSource, this);
    },

    //extends superclass to listener keyEvent  ---IE || WebKit || Opera
    keyBoardListener:function (e) {

        var k = e.getKey();
        if (Ext.isIE) {
            if (k == e.TAB) {
                //this.insertAtCursor('&nbsp;&nbsp;&nbsp;&nbsp;');
            } else if (k == e.ENTER) {
                //this.insertAtCursor('<br/>');
            } else if (k == e.F9) {
                ModuleLoader.getModule(this.id).instance.runSource();
            }
        } else if (Ext.isChrome) {
            if (k == e.F9) {// Ext Chrome Bug
                ModuleLoader.getModule(DEFAULT_JS_EDITOR_ID).instance.runSource();
            }
        } else if (Ext.isOpera) {
            if (k == e.TAB) {
                e.stopEvent();
                this.win.focus();
                this.execCmd('InsertHTML', '&nbsp;&nbsp;&nbsp;&nbsp;');
                this.deferFocus();
            }
        } else if (Ext.isWebKit) {
            if (k == e.TAB) {
                e.stopEvent();
                this.insertAtCursor('&nbsp;&nbsp;&nbsp;&nbsp;')
            } else if (k == e.ENTER) {
                e.stopEvent();
                this.execCmd('InsertHtml', '<br /><br />');
                this.deferFocus();
            } else if (k == e.F9) {// Ext Chrome Bug
                ModuleLoader.getModule(DEFAULT_JS_EDITOR_ID).instance.runSource();
            }
        } else if (Ext.isGecko) {
            if (k == e.TAB) {
                this.insertAtCursor('&nbsp;&nbsp;&nbsp;&nbsp;')
            } else if (k == e.F9) {
                ModuleLoader.getModule(DEFAULT_JS_EDITOR_ID).instance.runSource();
            }
        }
    },

    lightSource:function (e) {
        var src = this.getValue();
        src = src.replace('var', '<font color=\"#660066\">var</font>');

        this.setValue('');
        this.insertAtCursor(src);
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
Ext.reg('DCJSEditor', DCJSEditor);
