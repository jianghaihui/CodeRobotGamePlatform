DCC.game.FiveChess = Ext.extend(Ext.app.GameModule, {
    id:'fivechess-game',
    HTML:null,
    tbl:null,
    rowCount:16,
    colCount:16,
    board:[], //0--->无子;1-->白子;2-->黑子

    flag:0, //����Ϊ�׷�����,ż��Ϊ�ڷ�����
    isRobot:false,

    init:function () {
        this.initUI();
    }, //init end

    initUI:function () {
        this.HTML = document.createElement('div');
        this.tbl = document.createElement('table');
        this.tbl.id = 'fivechess-win-table';
        this.tbl.className = 'fivechess-win-table';
        this.tbl.border = 0;
        this.tbl.style.cellspacing = 0;
        this.tbl.style.cellpadding = 0;
        this.tbl.align = 'center';
        this.HTML.appendChild(this.tbl);

    }, //initUI end
    initGame:function () {
        this.flag = 0;
        //��ʼ������
        for (var row = 0; row < this.rowCount; row++) {
            var tr = this.tbl.insertRow(-1);
            tr.setAttribute('id', 'fiveChess_tr_' + row);
            for (var col = 0; col < this.colCount; col++) {
                var td = tr.insertCell(-1);
                td.setAttribute('id', 'fiveChess_cell_' + (row * 100 + col));
                this.setCellPanelInnerHTML(td);
                td.setAttribute("name", "noChess");
                this.board[row * this.colCount + col] = 0;
            }
        }
    }, //initGame end
    createWindow:function () {
        var _win = this.getWindow();
        if (!_win) {
            _win = MainOS.desktop.createWindow({
                id:this.id + "-win",
                title:'FiveChess Window',
                width:600,
                height:630,
                iconCls:'icon-fivechess-win',
                shim:false,
                animCollapse:true,
                constrainHeader:true,
                maximizable:false,
                resizable:false,

                layout:'fit',
                border:false,
                tbar:[
                    {
                        xtype:'button',
                        tooltip:'Restart',
                        iconCls:'fivechess-win-restart-tbar',
                        listeners:{
                            click:this.reStartGame.createDelegate(this)
                        }
                    },
                    {
                        xtype:'button',
                        tooltip:'Descreption',
                        iconCls:'fivechess-win-descreption-tbar',
                        listeners:{
                            click:function (t) {
                                new Ext.Window({
                                    title:'FiveChess Descreption',
                                    id:'FiveChess Descreption',
                                    width:500,
                                    height:400,
                                    manager:t.getWindowManager(),
                                    minimizable:true,
                                    maximizable:true,
                                    autoScroll:true,
                                    autoLoad:{url:'page/game/fivechess/descreption.html'}
                                }).show();
                            },//.createDelegate(this, [this.getThis()])
                            scope:this
                        }
                    }
                ],
                html:this.HTML.innerHTML
            })
        }
        _win.show();
        this.tbl = Ext.getDom('fivechess-win-table');
        this.initGame();
    }, //createWindow end
    setCellPanelInnerHTML:function (cell) {    //Ϊcell���ñ���
        var temp = cell.getAttribute("id").replace(/[^\d]/g, '');
        cell.innerHTML = "<img src='images/fivechess/m.jpg'>";				//���ձ鵽����
        if (temp % 100 == 0) cell.innerHTML = "<img src='images/fivechess/l.jpg'>";
        if (temp % 100 == (this.colCount - 1)) cell.innerHTML = "<img src='images/fivechess/r.jpg'>";
        if (temp / 100 < 1) cell.innerHTML = "<img src='images/fivechess/t.jpg'>";
        if (temp / 100 > (this.rowCount - 1)) cell.innerHTML = "<img src='images/fivechess/b.jpg'>";
        if (temp == 0) cell.innerHTML = "<img src='images/fivechess/lt.jpg'>";
        if (temp == (this.colCount - 1)) cell.innerHTML = "<img src='images/fivechess/rt.jpg'>";
        if (temp % 100 == 0 && temp / 100 == (this.rowCount - 1)) cell.innerHTML = "<img src='images/fivechess/lb.jpg'>";
        if (temp % 100 == (this.colCount - 1) && temp / 100 > (this.rowCount - 1)) cell.innerHTML = "<img src='images/fivechess/rb.jpg'>";
    },
    isAnyoneWin:function (cell, flag) {  //�ж���Ӯ�ķ���

    },
    //�Դ���㣬�����Ƿ�����������
    checkChessMap:function (cell) {

    },
    reStartGame:function () {
        this.initGame();
    },
    M_getMap:function () {
        return this.board;
    },
    M_R_checkAt:function (x, y) {
        if (this.isRobot && this.board[y * this.colCount + x] == 0) {
            cell = Ext.getDom('fiveChess_cell_' + (y * 100 + x));
            cell.innerHTML = "<img src='images/fivechess/white.jpg'>";
            cell.setAttribute("name", "black");
            this.board[y * this.colCount + x] = 1;
            flag++;
        }
    },
    M_checkAt:function (x, y) {
        if (!this.isRobot && this.board[y * this.colCount + x] == 0) {
            cell = Ext.getDom('fiveChess_cell_' + (y * 100 + x));
            cell.innerHTML = "<img src='images/fivechess/black.jpg'>";
            cell.setAttribute("name", "black");
            this.board[y * this.colCount + x] = 2;
            flag++;
        }
    },
    registMethod:function () {
        return [
            ['', ''],
        ];
    },
    registBeginMethod:function () {
        return '';
    },
    registLoopMethod:function () {
        return '';
    },
    registStopMethod:function () {
        return '';
    },
    registWinMethod:function () {
        return '';
    }
});
