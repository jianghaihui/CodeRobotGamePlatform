// JavaScript Document
DCC.robot.David = Ext.extend(Ext.app.RobotModule, {
    id:'david-robot-win',
    currGameId:'',
    currCodeFile:'',
    currCodeName:'',
    currCode:'',

    gameStore:[],
    //代码文件储存结构
    codeFiles:[],
    /*codeFile:[{
     code_file_name:'',//文件名
     code_file_path:'',//文件地址
     code:'',//代码内容
     code_name:'',//代码名
     game_id:'',//指向游戏id
     game_name:''//指向游戏名
     active:false//是否为活动代码
     }],*/
    init:function () {
        for (var i = 0; i < robotCodeJson.getCount(); i++) {
            var codeFile = new Object();
            var obj = robotCodeJson.getAt(i);
            codeFile.game_id = obj.get('game_id');
            codeFile.game_name = obj.get('game_name');
            codeFile.code_file_path = obj.get('code_file_path');
            codeFile.code_file_name = obj.get('code_file_name');
            codeFile.code_name = obj.get('code_name');
            this.codeFiles.push(codeFile);

            var gs = [obj.get('game_id'), obj.get('game_name')];
            var isHas = false;
            for (var j = 0; j < this.gameStore.length; j++) {
                if (this.gameStore[j][0] == gs[0]) {
                    isHas = true;
                    break;
                }
            }
            if (!isHas && this.gameStore.indexOf(gs) == -1) {
                this.gameStore.push(gs);
            }
        }
    }, //init end
    info_label:{
        xtype:'label',
        text:'hello!',
        width:180,
        height:50
    }, //info_label end

    initUI:function (json) {

    }, //initUI end

    config:function (robot) {
        var gameCombo = new Ext.form.ComboBox({
            mode:'local',
            editable:false,
            store:robot.gameStore,
            forceSelection:true, //必须选择一项
            emptyText:'Select Game', //默认值
            triggerAction:'all',
            region:'north',
            listeners:{
                select:function (combo, record, index) {
                    codeList.removeAll();
                    robot.currGameId = record.json[0];
                    for (var i = 0; i < robot.codeFiles.length; i++) {
                        if (robot.codeFiles[i].game_id == record.json[0]) {
                            codeList.add({
                                xtype:'button',
                                width:'100%',
                                text:robot.codeFiles[i].code_name,
                                listeners:{
                                    click:function () {
                                        var buttons = codeList.items;
                                        buttons.each(function () {
                                            this.setText(Ext.util.Format.stripTags(this.getText()));
                                        });
                                        this.setText('<span style=\'color:#ff0000\'>' + this.getText() + '</span>');
                                        for (var j = 0; j < robot.codeFiles.length; j++) {
                                            if (robot.codeFiles[j].game_id == record.json[0]) {
                                                robot.currCodeFile = robot.codeFiles[j].code_file_path + robot.codeFiles[j].code_file_name;
                                                //alert((t.currCodeFile));
                                            }
                                        }
                                    }
                                }
                            });
                        }
                    }
                    codeList.doLayout();
                }
            }
        });
        var codeList = new Ext.Panel({
            autoScroll:true,
            region:'center'
            //layout:'vbox'
        });
        var ok_btn = new Ext.Button({
            text:'OK',
            region:'south',
            handler:function () {
                //alert(this.currGameId);
                //alert(this.currCodeFile);
                _toolTip = '<HTML>' + 'Click me to run game<BR>' + 'game_id:' + this.currGameId + '<BR>codeFile:' + this.currCodeFile + '</HTML>';
                MainOS.desktop.getWindow('david-robot-win').items.itemAt(0).setTooltip(_toolTip);
                win.close();
            }.createDelegate(this)
        });
        var win = new Ext.Window({
            id:'david-robot-config-win',
            title:'David Robot Config',
            width:200,
            height:150,
            iconCls:'icon-david-robot',
            shim:false,
            animCollapse:true,
            autoScroll:true,
            constrainHeader:true,
            maximizable:false,
            closable:false,
            resizable:false,
            draggable:false,
            layout:'border',
            items:[gameCombo, codeList, ok_btn]
        });
        win.show();
        return win;
    }, //config end

    selectGame:function () {

    }, //selectGame end

    run:function () {

    },

    createWindow:function () {
        var _win = MainOS.desktop.getWindow('david-robot-win');
        if (!_win) {
            _win = MainOS.desktop.createWindow({
                id:'david-robot-win',
                title:'David Robot',
                width:200,
                height:150,
                iconCls:'icon-david-robot',
                shim:false,
                animCollapse:true,
                constrainHeader:true,
                maximizable:false,
                closable:false,
                resizable:false,

                layout:'absolute',
                border:false,
                bbar:[this.info_label],
                items:[
                    {
                        id:'robot-david-button-run',
                        iconCls:'robot-david-button-run-icon',
                        xtype:'button',
                        x:40,
                        y:10,
                        width:80,
                        height:80,
                        tooltip:'No game selected',
                        handler:function () {
                            MainOS.desktop.openGameModule(this.currGameId, true, 'robot', this.currCodeFile)
                        }.createDelegate(this)
                    },
                    {
                        id:'robot-david-button-cfg',
                        iconCls:'robot-david-button-cfg-icon',
                        xtype:'button',
                        scale:'medium',
                        x:130,
                        y:65,
                        tooltip:'Click me to select code of game',
                        handler:function () {
                            var cfgWin = this.config(this);
                            cfgWin.setPosition(_win.x, _win.y);
                        }.createDelegate(this)
                    }
                ]
            })
        }
        var availWidth = Ext.get('x-desktop').getWidth(true);
        var availHeight = Ext.get('x-desktop').getHeight(true);
        var width = _win.getWidth();
        var height = _win.getHeight();
        var x = availWidth - width - 10;
        var y = availHeight - height - 10;

        _win.setPosition(x, y);
        _win.show();
    }
//createWindow end
});
