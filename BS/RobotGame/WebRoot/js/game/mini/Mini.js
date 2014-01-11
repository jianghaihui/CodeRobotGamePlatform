// JavaScript Document
DCC.game.Mini = Ext.extend(Ext.app.GameModule, {
    id:'mini-game',
    //name:'Mini',
    rank:0,
    _size:20,
    numArray:[25, 90, 120],
    widthArray:[15, 25, 30],
    heightArray:[15, 25, 30],
    mm:Array, //地雷初始数组, -1-->has mini;0~~other:��ʾ
    _mm:Array, //游戏进行中已知信息数组. -1-->not click;>=0:已知的信息
    init:function () {
        this.rank = 0;
        this.initGame();
    },
    initGame:function () {
        this.mm = new Array(this.widthArray[this.rank] * this.heightArray[this.rank]);//-1-->has mini;0~~other:��ʾ
        this._mm = new Array(this.widthArray[this.rank] * this.heightArray[this.rank]);//0-->not click;1-->clicked;2-->flat
        this._html = document.createElement('div');
        var _div = document.createElement('div');
        _div.setAttribute('align', 'center');
        _div.setAttribute('id', 'mini-panel-div');
        this._html.appendChild(_div);

        for (var k = 0; k < this.mm.length; k++) {
            this.mm[k] = 0;
            this._mm[k] = -1;
        }
        for (var k = 0; k < this.numArray[this.rank]; k++) {
            var n = Math.round(Math.random() * this.widthArray[this.rank] * this.heightArray[this.rank]);
            if (this.mm[n] == -1) { //has mini,Repeat product
                k--;
                continue;
            }
            this.mm[n] = -1;
            n + 1 >= 0 && n + 1 < this.widthArray[this.rank] * this.heightArray[this.rank] && this.mm[n + 1] != -1 ? this.mm[n + 1]++ : 0;
            n - 1 >= 0 && n - 1 < this.widthArray[this.rank] * this.heightArray[this.rank] && this.mm[n - 1] != -1 ? this.mm[n - 1]++ : 0;

            n + this.widthArray[this.rank] + 1 >= 0 && n + this.widthArray[this.rank] + 1 < this.widthArray[this.rank] * this.heightArray[this.rank] && this.mm[n + this.widthArray[this.rank] + 1] != -1 ? this.mm[n + this.widthArray[this.rank] + 1]++ : 0;
            n + this.widthArray[this.rank] >= 0 && n + this.widthArray[this.rank] < this.widthArray[this.rank] * this.heightArray[this.rank] && this.mm[n + this.widthArray[this.rank]] != -1 ? this.mm[n + this.widthArray[this.rank]]++ : 0;
            n + this.widthArray[this.rank] - 1 >= 0 && n + this.widthArray[this.rank] - 1 < this.widthArray[this.rank] * this.heightArray[this.rank] && this.mm[n + this.widthArray[this.rank] - 1] != -1 ? this.mm[n + this.widthArray[this.rank] - 1]++ : 0;

            n - this.widthArray[this.rank] + 1 >= 0 && n - this.widthArray[this.rank] + 1 < this.widthArray[this.rank] * this.heightArray[this.rank] && this.mm[n - this.widthArray[this.rank] + 1] != -1 ? this.mm[n - this.widthArray[this.rank] + 1]++ : 0;
            n - this.widthArray[this.rank] >= 0 && n - this.widthArray[this.rank] < this.widthArray[this.rank] * this.heightArray[this.rank] && this.mm[n - this.widthArray[this.rank]] != -1 ? this.mm[n - this.widthArray[this.rank]]++ : 0;
            n - this.widthArray[this.rank] - 1 >= 0 && n - this.widthArray[this.rank] - 1 < this.widthArray[this.rank] * this.heightArray[this.rank] && this.mm[n - this.widthArray[this.rank] - 1] != -1 ? this.mm[n - this.widthArray[this.rank] - 1]++ : 0;
            if (n % this.widthArray[this.rank] == 0) {
                n - 1 >= 0 && n - 1 < this.widthArray[this.rank] * this.heightArray[this.rank] && this.mm[n - 1] != -1 ? this.mm[n - 1]-- : 0;
                n - this.widthArray[this.rank] - 1 >= 0 && n - this.widthArray[this.rank] - 1 < this.widthArray[this.rank] * this.heightArray[this.rank] && this.mm[n - this.widthArray[this.rank] - 1] != -1 ? this.mm[n - this.widthArray[this.rank] - 1]-- : 0;
                n + this.widthArray[this.rank] - 1 >= 0 && n + this.widthArray[this.rank] - 1 < this.widthArray[this.rank] * this.heightArray[this.rank] && this.mm[n + this.widthArray[this.rank] - 1] != -1 ? this.mm[n + this.widthArray[this.rank] - 1]-- : 0;
            }
            if ((n + 1) % this.widthArray[this.rank] == 0) {
                n + 1 >= 0 && n + 1 < this.widthArray[this.rank] * this.heightArray[this.rank] && this.mm[n + 1] != -1 ? this.mm[n + 1]-- : 0;
                n - this.widthArray[this.rank] + 1 >= 0 && n - this.widthArray[this.rank] + 1 < this.widthArray[this.rank] * this.heightArray[this.rank] && this.mm[n - this.widthArray[this.rank] + 1] != -1 ? this.mm[n - this.widthArray[this.rank] + 1]-- : 0;
                n + this.widthArray[this.rank] + 1 >= 0 && n + this.widthArray[this.rank] + 1 < this.widthArray[this.rank] * this.heightArray[this.rank] && this.mm[n + this.widthArray[this.rank] + 1] != -1 ? this.mm[n + this.widthArray[this.rank] + 1]-- : 0;
            }
        }
        for (var i = 0; i < this.heightArray[this.rank]; i++) {
            for (var j = 0; j < this.widthArray[this.rank]; j++) {
                var _BTN = document.createElement('input');
                _BTN.type = 'button';
                _BTN.className = 'mini-basic-button';
                _BTN.setAttribute('value', '');
                _BTN.style.width = this._size;
                _BTN.style.height = this._size;
                _BTN.id = 'mini-basic-button-' + (i * this.widthArray[this.rank] + j);
                _div.appendChild(_BTN);
            }
            _div.appendChild(document.createElement('br'));
        }
    }, //initGame end
    createWindow:function () {
        var _win = this.getWindow();
        if (!_win) {
            _win = MainOS.desktop.createWindow({
                id:this.id + "-win",
                title:'Mini Window',
                width:(this._size + 1.5) * this.widthArray[this.rank],
                height:(this._size + 1.5) * this.heightArray[this.rank] + 80 - this.heightArray[this.rank],
                iconCls:'icon-mini-win',
                shim:false,
                animCollapse:true,
                constrainHeader:true,
                maximizable:false,
                resizable:false,

                layout:'fit',
                border:false,

                tbar:[
                    {
                        xtype:'splitbutton',
                        text:'Simple',
                        tooltip:'Game Rank',
                        iconCls:'mini-win-rank0',
                        menu:[
                            {
                                xtype:'btnIcon',
                                text:'Simple',
                                iconCls:'mini-win-rank0',
                                listeners:{
                                    click:function (t) {
                                        var win = this.getWindow();
                                        win.getTopToolbar().items.itemAt(0).setText("Simple")
                                        win.getTopToolbar().items.itemAt(0).setIconClass("mini-win-rank0");
                                        this.restart();
                                    },
                                    scope:this
                                }
                            },
                            {
                                xtype:'btnIcon',
                                text:'Medium',
                                iconCls:'mini-win-rank1',
                                listeners:{
                                    click:function (t) {
                                        var win = this.getWindow();
                                        win.getTopToolbar().items.itemAt(0).setText("Medium")
                                        win.getTopToolbar().items.itemAt(0).setIconClass("mini-win-rank1");
                                        this.restart();
                                    },
                                    scope:this
                                }
                            },
                            {
                                xtype:'btnIcon',
                                text:'Heavy',
                                iconCls:'mini-win-rank2',
                                listeners:{
                                    click:function (t) {
                                        var win = this.getWindow();
                                        win.getTopToolbar().items.itemAt(0).setText("Heavy")
                                        win.getTopToolbar().items.itemAt(0).setIconClass("mini-win-rank2");
                                        this.restart();
                                    },
                                    scope:this
                                }
                            }
                        ],
                        listeners:{
                            click:function () {
                                var win = this.getWindow();
                                var _text = win.getTopToolbar().items.itemAt(0).getText();
                                if (_text == "Simple") {
                                    this.rank = 0;
                                } else if (_text == "Medium") {
                                    this.rank = 1;
                                } else if (_text == "Heavy") {
                                    this.rank = 2;
                                }
                                win.setWidth((this._size + 1.5) * this.widthArray[this.rank]);
                                win.setHeight((this._size + 1.5) * this.heightArray[this.rank] + 50 - this.heightArray[this.rank]);
                                this.initGame();
                                win.body.update(this._html.innerHTML);
                                //.createDelegate(this,[this.getThis()])
                            },
                            scope:this
                        }
                    },
                    {
                        xtype:'button',
                        tooltip:'Descreption',
                        iconCls:'mini-win-descreption-tbar',
                        listeners:{
                            click:function () {
                                var win = new Ext.Window({
                                    title:'Mini Descreption',
                                    id:'Mini Descreption',
                                    width:500,
                                    height:400,
                                    minimizable:true,
                                    maximizable:true,
                                    autoScroll:true,
                                    autoLoad:{url:'page/game/mini/descreption.html'}
                                });//.show();
                                win.show();
                                win.toFront();
                            }, //.createDelegate(this, [this.getThis()])
                            scope:this
                        }
                    }
                ],
                html:this._html.innerHTML
            });//createWindow end
        }
        _win.setWidth((this._size + 1.5) * this.widthArray[this.rank]);
        _win.setHeight((this._size + 1.5) * this.heightArray[this.rank] + 50 - this.heightArray[this.rank]);
        _win.show();
    },
    restart:function () {
        var win = this.getWindow();
        var _text = win.getTopToolbar().items.itemAt(0).getText();
        if (_text == "Simple") {
            this.rank = 0;
        } else if (_text == "Medium") {
            this.rank = 1;
        } else if (_text == "Heavy") {
            this.rank = 2;
        }
        win.setWidth((this._size + 1.5) * this.widthArray[this.rank]);
        win.setHeight((this._size + 1.5) * this.heightArray[this.rank] + 50 - this.heightArray[this.rank]);
        this.initGame();
        win.body.update(this._html.innerHTML);
    },

    getMini:function (x) {
        if (x >= 0) {
            return this._mm[x];
        } else {
            return this._mm;
        }
    },

    clickMini:function (x) {
        if (this.mm[x] == -1) {
            this.showAll();
            DCC.widget.show({title:'Death', msg:"Oh...Has Mini....You death", buttons:Ext.Msg.YES});
        } else if (x < this.mm.length) {
            this._mm[x] = this.mm[x];
            if (this.mm[x] == 0) {
                Ext.getDom('mini-basic-button-' + x).setAttribute('value', " ");
                Ext.fly('mini-basic-button-' + x).addClass('mini-basic-button-clicked');
                this.clickAll(x);
            } else {
                Ext.getDom('mini-basic-button-' + x).setAttribute('value', this.mm[x]);
                Ext.fly('mini-basic-button-' + x).addClass('mini-basic-button-clicked');
            }
        }
        if (this.isWin())DCC.widget.show({title:'win', msg:"Yes...You are win", buttons:Ext.Msg.YES});
    },

    flat:function (x) {
        if (this._mm[x] == -1) {
            this._mm[x] = -2;
            Ext.getDom('mini-basic-button-' + x).setAttribute('value', "F");
        }
    },

    isWin:function () {
        for (var i = 0; i < this.mm.length; i++) {
            if (this.mm[i] != -1) {
                if (this._mm[i] == -1)return false;
            }
        }
        return true;
    },

    clickAll:function (x) {
        if (x + 1 >= 0 && x + 1 < this.widthArray[this.rank] * this.heightArray[this.rank] && this._mm[x + 1] == -1 && (x + 1) % this.widthArray[this.rank] != 0) {
            this._mm[x + 1] = this.mm[x + 1];
            if (this.mm[x + 1] == 0) {
                Ext.getDom('mini-basic-button-' + (x + 1)).setAttribute('value', "");
                Ext.fly('mini-basic-button-' + (x + 1)).addClass('mini-basic-button-clicked');
                this.clickAll(x + 1);
            } else {
                Ext.getDom('mini-basic-button-' + (x + 1)).setAttribute('value', this.mm[x + 1]);
                Ext.fly('mini-basic-button-' + (x + 1)).addClass('mini-basic-button-clicked');
            }

        }
        if (x - 1 >= 0 && x - 1 < this.widthArray[this.rank] * this.heightArray[this.rank] && this._mm[x - 1] == -1 && (x - 1) % this.widthArray[this.rank] != 0) {
            this._mm[x - 1] = this.mm[x - 1];
            if (this.mm[x - 1] == 0) {
                Ext.getDom('mini-basic-button-' + (x - 1)).setAttribute('value', "");
                Ext.fly('mini-basic-button-' + (x - 1)).addClass('mini-basic-button-clicked');
                this.clickAll(x - 1);
            } else {
                Ext.getDom('mini-basic-button-' + (x - 1)).setAttribute('value', this.mm[x - 1]);
                Ext.fly('mini-basic-button-' + (x - 1)).addClass('mini-basic-button-clicked');
            }
        }
        if (x - this.widthArray[this.rank] >= 0 && x - this.widthArray[this.rank] < this.widthArray[this.rank] * this.heightArray[this.rank] && this._mm[x - this.widthArray[this.rank]] == -1) {
            this._mm[x - this.widthArray[this.rank]] = this.mm[x - this.widthArray[this.rank]];
            if (this.mm[x - this.widthArray[this.rank]] == 0) {
                Ext.getDom('mini-basic-button-' + (x - this.widthArray[this.rank])).setAttribute('value', "");
                Ext.fly('mini-basic-button-' + (x - this.widthArray[this.rank])).addClass('mini-basic-button-clicked');
                this.clickAll(x - this.widthArray[this.rank]);
            } else {
                Ext.getDom('mini-basic-button-' + (x - this.widthArray[this.rank])).setAttribute('value', this.mm[x - this.widthArray[this.rank]]);
                Ext.fly('mini-basic-button-' + (x - this.widthArray[this.rank])).addClass('mini-basic-button-clicked');
            }
        }
        if (x + this.widthArray[this.rank] >= 0 && x + this.widthArray[this.rank] < this.widthArray[this.rank] * this.heightArray[this.rank] && this._mm[x + this.widthArray[this.rank]] == -1) {
            this._mm[x + this.widthArray[this.rank]] = this.mm[x + this.widthArray[this.rank]];
            if (this.mm[x + this.widthArray[this.rank]] == 0) {
                Ext.getDom('mini-basic-button-' + (x + this.widthArray[this.rank])).setAttribute('value', "");
                Ext.fly('mini-basic-button-' + (x + this.widthArray[this.rank])).addClass('mini-basic-button-clicked');
                this.clickAll(x + this.widthArray[this.rank]);
            } else {
                Ext.getDom('mini-basic-button-' + (x + this.widthArray[this.rank])).setAttribute('value', this.mm[x + this.widthArray[this.rank]]);
                Ext.fly('mini-basic-button-' + (x + this.widthArray[this.rank])).addClass('mini-basic-button-clicked');
            }
        }
    }, //clickAll end

    showAll:function () {
        for (var i = 0; i < this.mm.length; i++) {
            if (this.mm[i] == 0) {
                Ext.getDom('mini-basic-button-' + i).setAttribute('value', "");
                Ext.fly('mini-basic-button-' + i).addClass('mini-basic-button-clicked');
            } else if (this.mm[i] == -1) {
                Ext.getDom('mini-basic-button-' + i).setAttribute('value', "");
                Ext.fly('mini-basic-button-' + i).addClass('mini-basic-button-clicked-hasmini');
            } else {
                Ext.getDom('mini-basic-button-' + i).setAttribute('value', this.mm[i]);
                Ext.fly('mini-basic-button-' + i).addClass('mini-basic-button-clicked');
            }
        }
    },

    getSize:function () {
        return this.widthArray[this.rank];
    },
    getMiniNum:function () {
        return this.numArray[this.rank];
    },

    registMethod:function () {
        return [
            ['clickMini', 'click'],
            ['getMini', 'get'],
            ['flat', 'flat'],
            //['showAll', 'showAll'],
            //['restart', 'restart'],
            ['getSize', 'size'],
            ['getMiniNum', 'miniCount']
        ];
    },
    registWinMethod:function () {
        return 'isWin';
    }
});
