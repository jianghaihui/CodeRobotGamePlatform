// JavaScript Document
DCC.editor.EditorModule = function (config) {
    Ext.apply(this, config);
    DCC.editor.EditorModule.superclass.constructor.call(this);
}

Ext.extend(DCC.editor.EditorModule, Ext.util.Observable, {
    init:Ext.emptyFn,
    id:null,
    setTarget:function (target) {
        this.target = target;
    },

    getTarget:function () {
        return target;
    },

    loadSource:function (source) {
        var win = MainOS.desktop.getWindow(this.id + '-win');
        var editorPanel = win.items.itemAt(0).getActiveTab();
        if (!editorPanel) {
            DCC.widget.alert('Message', 'Not any code of game');
            return;
        }
        var editor = editorPanel.items.itemAt(0);
        editor.setSource(source);
    }, //load end

    saveSource:function () {
        var editor = this;
    }, //save end

    shareSource:function () {
        var editor;

    }, //share end

    runSource:function () {
        var win = MainOS.desktop.getWindow(this.id + "-win");
        var editorPanel = win.items.itemAt(0).getActiveTab();
        if (!editorPanel) {
            DCC.widget.alert('Message', 'Not any code of game');
            return;
        }
        var editor = editorPanel.items.itemAt(0);
        var src = editor.getSource();

        if (editor.target) {
            var module = ModuleLoader.getModule(editor.target).instance;
            if (module) {

                var json = new Ext.data.Store({
                    reader:new Ext.data.ArrayReader({}, [
                        {name:'method'},
                        {name:'mapping'}
                    ]),
                    data:module.registMethod()
                    //autoLoad:true
                });
                if (!src && module.registDefaultMethod()) {
                    src = module.registDefaultMethod();
                }
                var actionMethodName = module.id.replace(new RegExp('-', 'g'), '_') + '_action';
                var actionMethod = new Function(module.id.replace(new RegExp('-', 'g'), '_') + '_action();');
                src = src.replace(new RegExp('this.', 'g'), 'ModuleLoader.getModule(\'' + module.id + '\').instance.')
                for (var i = 0; i < json.getCount(); i++) {
                    src = src.replace(new RegExp(json.getAt(i).get('mapping') + '[\(]', 'g'), 'ModuleLoader.getModule(\'' + module.id + '\').instance.' + json.getAt(i).get('method') + '(')
                }
                src = src.replace(new RegExp('function action', 'g'), 'function ' + actionMethodName);

                JSLoader.includeUserJsText(src);
                //var fn = new Function(src);
                var times = 0;
                var beginMethod = module.registBeginMethod();
                var loopMethod = module.registLoopMethod();
                var stopMethod = module.registStopMethod();
                var winMethod = module.registWinMethod();
                var loopTime = module.getLoopTime();

                if (winMethod) {
                    winMethod = 'return ModuleLoader.getModule(\'' + module.id + '\').instance.' + winMethod + '()';
                    winMethod = new Function(winMethod);
                }

                if (stopMethod) {
                    stopMethod = 'return ModuleLoader.getModule(\'' + module.id + '\').instance.' + stopMethod + '()';
                    stopMethod = new Function(stopMethod);
                }

                if (beginMethod) {
                    beginMethod = 'ModuleLoader.getModule(\'' + module.id + '\').instance.' + beginMethod + '()';
                    new Function(beginMethod)();
                }

                if (loopMethod) {
                    loopMethod = 'return ModuleLoader.getModule(\'' + module.id + '\').instance.' + loopMethod + '()';
                    loopMethod = new Function(loopMethod);
                    var runner = new Ext.util.TaskRunner();
                    runner.start({
                        run:function () {
                            if (stopMethod()) {
                                runner.stopAll();//(runner);
                                return;
                            }
                            if (loopMethod()) {
                                try {
                                    var d = new Date();
                                    actionMethod();
                                    times = times + ((new Date()) - d);
                                } catch (err) {
                                    DCC.widget.show({title:'Error', msg:err, buttons:Ext.Msg.OK});
                                }
                            }
                            if (winMethod()) {
                                runner.stopAll();//(runner);
                                DCC.widget.show({title:'End', msg:'use time: ' + times + 'ms', buttons:Ext.Msg.OK});
                            }
                        },
                        interval:loopTime
                    });
                } else {
                    try {
                        var d = new Date();
                        actionMethod();
                        times = times + ((new Date()) - d);
                        if (winMethod()) {
                            //runner.stopAll();//(runner);
                            DCC.widget.show({title:'WIN', msg:'use time: ' + times + 'ms', buttons:Ext.Msg.OK});
                        }
                    } catch (err) {
                        DCC.widget.show({title:'ERROR', msg:err, buttons:Ext.Msg.OK});
                    }
                }
            }
        }
    }, //run end

    help:function () {
        var editor;
    }, //help end

    addEditorTab:function (target) {
        var tabEditor = new Editor();
//        var tabEditor = new Ext.ux.AceEditor()
        tabEditor.setTarget(target);
        var tabPanel = new Ext.Panel({
            title:target,
            header:false,
            border:false,
            layout:'fit',
            closable:true,
            items:tabEditor
        });
        this.editorPanel.add(tabPanel);
        this.editorPanel.setActiveTab(tabPanel);
        this.editorPanel.doLayout();
    }, //addEditorTab end

    getEditorTab:function (id) {
        var items = this.editorPanel.items;
        for (var i = 0; i < items.length; i++) {
            if (items.itemAt(i).title == id) return items.itemAt(i);
        }
    },

    setActive:function (id) {
        var items = this.editorPanel.items;
        for (var i = 0; i < items.length; i++) {
            if (items.itemAt(i).title == id) {
                this.editorPanel.setActiveTab(items.itemAt(i));
                break;
            }
        }
    },

    closeAllTab:function () {
        var items = this.editorPanel.items;
        for (var i = 0; i < items.length; i++) {
            this.editorPanel.remove(items.itemAt(i));
        }
    }
});
