DCC.game.Snakes = Ext.extend(Ext.app.GameModule, {
    id:'snakes-game',

    HTML:null,
    tbl:null,
    /**
     * body: ���?������ߵ�ÿһ�ڣ�
     * ��ݽṹ{x:x0, y:y0, color:color0},
     * x,y��ʾ���,color��ʾ��ɫ
     **/
    body:[],

    /**
     *map:��ǰ��ͼ,
     *0-->�յ�,1-->����,2-->ʳ��,3-->�ϰ�
     */
    map:[],
    //�ϰ�
    wall:[
        [
            [0, 0]
        ],
        [
            [0, 0],
            [0, 1],
            [0, 2],
            [0, 3]
        ],
        [
            [0, 0],
            [1, 1],
            [1, 2],
            [1, 3]
        ],
        [
            [0, 0],
            [1, 0],
            [2, 0],
            [3, 0]
        ],
        [
            [0, 0],
            [0, 1],
            [1, 1],
            [1, 2],
            [1, 3],
            [0, 3]
        ]
    ],
    colors:['red', 'orange', 'yellow', 'green', 'blue', 'purple'],
    wallNum:50,
    footNum:150,
    //��ǰ�ƶ��ķ���,ȡֵ0,1,2,3, �ֱ��ʾ����,��,��,��, �����̷������Ըı���
    direction:0,
    //����
    rowCount:45,
    //����
    colCount:45,
    //��ʼ��

    winNum:100,
    _isStop:false,
    _isWin:false,

    init:function () {
        this.initUI();
    },
    initGame:function () {
        this._isStop = false;
        this._isWin = false;
        //����table
        for (var row = 0; row < this.rowCount; row++) {
            var tr = this.tbl.insertRow(-1);
            for (var col = 0; col < this.colCount; col++) {
                var td = tr.insertCell(-1);
                td.className = 'snakes-win-td';
            }
        }
        //��ʼ������
        this.body = [];
        //��ʼ��map
        for (var row = 0; row < this.rowCount; row++) {
            for (var col = 0; col < this.colCount; col++) {
                this.map[row * this.rowCount + col] = 0;
            }
        }
        //�����ʼ�ƶ�����
        this.direction = Math.floor(Math.random() * 4);

        //�����ϰ�
        for (var i = 0; i < this.wallNum; i++) {
            x = Math.floor(Math.random() * this.colCount);
            y = Math.floor(Math.random() * this.rowCount);
            indexWall = Math.floor(Math.random() * this.wall.length);
            for (var j = 0; j < this.wall[indexWall].length; j++) {
                if (x + this.wall[indexWall][j][0] >= this.colCount || y + this.wall[indexWall][j][1] >= this.rowCount) {
                    indexWall = Math.floor(Math.random() * this.wall.length);
                    j = -1;
                    continue;
                }
            }
            for (var j = 0; j < this.wall[indexWall].length; j++) {
                _x = x + this.wall[indexWall][j][0];
                _y = y + this.wall[indexWall][j][1];
                if (!this.isCellFilled(_x, _y)) {
                    this.tbl.rows[_y].cells[_x].style.backgroundColor = '#aaaaaa';
                    this.map[_y * this.colCount + _x] = 3;
                }
            }
        }

        //����ʳ���
        for (var i = 0; i < this.footNum; i++) {
            x = Math.floor(Math.random() * this.colCount);
            y = Math.floor(Math.random() * this.rowCount);
            colorIndex = Math.floor(Math.random() * this.colors.length);
            if (!this.isCellFilled(x, y)) {
                this.tbl.rows[y].cells[x].style.backgroundColor = this.colors[colorIndex];
                this.map[y * this.colCount + x] = 2;
            }
        }
        //������ͷ
        while (true) {
            x = Math.floor(Math.random() * this.colCount);
            y = Math.floor(Math.random() * this.rowCount);
            if (!this.isCellFilled(x, y)) {
                this.tbl.rows[y].cells[x].style.backgroundColor = "black";
                this.body.push({x:x, y:y, color:'black'});
                this.map[y * this.colCount + x] = 1;
                break;
            }
        }
    },
    initUI:function () {
        this.HTML = document.createElement('div');
        this.tbl = document.createElement('table');
        this.tbl.id = 'snakes-win-table';
        this.tbl.className = 'snakes-win-table';
        this.tbl.border = 1;
        this.tbl.cellspacing = 0;
        this.tbl.cellpadding = 0;

        /*
         //����table
         for(var row=0;row<this.rowCount;row++){
         var tr=this.tbl.insertRow(-1);
         for(var col=0;col<this.colCount;col++) {
         var td=tr.insertCell(-1);
         td.className = 'snakes-win-td';
         }
         }*/
        this.HTML.appendChild(this.tbl);
    },
    createWindow:function () {
        var _win = this.getWindow();
        if (!_win) {
            _win = MainOS.desktop.createWindow({
                id:this.id + "-win",
                title:'Snakes Window',
                width:530,
                height:530,
                iconCls:'icon-snakes-win',
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
                        iconCls:'snakes-win-restart-tbar',
                        listeners:{
                            click:this.restart.createDelegate(this)
                        }
                    },
                    {
                        xtype:'button',
                        tooltip:'Descreption',
                        iconCls:'snakes-win-descreption-tbar',
                        listeners:{
                            click:function (t) {
                                new Ext.Window({
                                    title:'Snakes Descreption',
                                    id:'Snakes Descreption',
                                    width:500,
                                    height:400,
                                    manager:t.getWindowManager(),
                                    minimizable:true,
                                    maximizable:true,
                                    autoScroll:true,
                                    autoLoad:{url:'page/game/snakes/descreption.html'}
                                }).show();
                            }, //.createDelegate(this, [this.getThis()])
                            scope:this
                        }
                    }
                ],
                html:this.HTML.innerHTML
            })
        }
        _win.show();
        this.tbl = Ext.getDom('snakes-win-table');
        this.initGame();
    }, //createWindow end
    //�ƶ�
    move:function (s) {
        var _s = 0;
        while (_s < s && !this._isStop && !this._isWin) {
            this.erase();
            this.moveOneStep();
            this.paint();
            _s++;
        }
    },
    //�ƶ�һ������
    moveOneStep:function () {
        if (this.checkNextStep() == -1) {
            this._isStop = true;
            DCC.widget.show({title:'END', msg:'Game over!\nPress Restart to continue.', buttons:Ext.Msg.OK});
            return;
        }
        if (this.checkNextStep() == 1) {
            var _point = this.getNextPos();
            var _x = _point.x;
            var _y = _point.y;
            var _color = this.getColor(_x, _y);
            this.body.unshift({x:_x, y:_y, color:_color});
            if (this.body.length == this.winNum) {
                this._isWin = true;
                return;
            }
            //��Ϊ����һ��ʳ������ٲ���һ��ʳ��
            this.map[y * this.colCount + x] = 1;
            this.generateDood();
            return;
        }
        //window.status = this.toString();
        var point = this.getNextPos();
        //������һ�ڵ���ɫ
        var color = this.body[0].color;
        //��ɫ��ǰ�ƶ�
        for (var i = 0; i < this.body.length - 1; i++) {
            this.body[i].color = this.body[i + 1].color;
        }
        //��β��һ�ڣ� ��β��һ�ڣ�������ǰ���Ч��
        var end = this.body.pop();
        this.map[end.y * this.colCount + end.x] = 0;
        this.body.unshift({x:point.x, y:point.y, color:color});
        this.map[point.y * this.colCount + point.x] = 1;
        //window.status = this.toString();
    },

    //̽Ѱ��һ�����ߵ�ʲô�ط�
    getNextPos:function () {
        var x = this.body[0].x;
        var y = this.body[0].y;
        var color = this.body[0].color;
        //����
        if (this.direction == 0) {
            y--;
        }
        //����
        else if (this.direction == 1) {
            x++;
        }
        //����
        else if (this.direction == 2) {
            y++;
        }
        //����
        else {
            x--;
        }
        //����һ�����
        return {x:x, y:y};
    },
    //��齫Ҫ�ƶ�������һ����ʲô
    checkNextStep:function () {
        var point = this.getNextPos();
        var x = point.x;
        var y = point.y;
        if (x < 0 || x >= this.colCount || y < 0 || y >= this.rowCount) {
            return -1;//���߽磬��Ϸ����
        }
        if (this.map[y * this.colCount + x] == 3) {
            return -1;//�����ϰ�,��Ϸ����
        }
        for (var i = 0; i < this.body.length; i++) {
            if (this.body[i].x == x && this.body[i].y == y) {
                return -1;//�����Լ�������,��Ϸ����
            }
        }
        if (this.isCellFilled(x, y)) {
            return 1;//�ж���
        }
        return 0;//�յ�
    },
    //��������
    erase:function () {
        for (var i = 0; i < this.body.length; i++) {
            this.eraseDot(this.body[i].x, this.body[i].y);
        }
    },
    //��������
    paint:function () {
        for (var i = 0; i < this.body.length; i++) {
            this.paintDot(this.body[i].x, this.body[i].y, this.body[i].color);
        }
    },
    //����һ��
    eraseDot:function (x, y) {
        this.tbl.rows[y].cells[x].style.backgroundColor = "";
    },
    //����һ��
    paintDot:function (x, y, color) {
        this.tbl.rows[y].cells[x].style.backgroundColor = color;
    },
    //�õ�һ������ϵ���ɫ
    getColor:function (x, y) {
        return this.tbl.rows[y].cells[x].style.backgroundColor;
    },
    //���ڵ���
    toString:function () {
        var str = "";
        for (var i = 0; i < this.body.length; i++) {
            str += "x:" + this.body[i].x + " y:" + this.body[i].y + " color:" + this.body[i].color + " - ";
        }
        return str;
    },
    //���һ��������û�б����
    isCellFilled:function (x, y) {
        if (this.tbl.rows[y].cells[x].style.backgroundColor == "") {
            return false;
        }
        return true;
    },
    //���¿�ʼ
    restart:function () {
        for (var i = 0; i < this.rowCount; i++) {
            this.tbl.deleteRow(0);
        }
        this.initGame();
    },
    //����ʳ�
    generateDood:function () {
        var x = Math.floor(Math.random() * this.colCount);
        var y = Math.floor(Math.random() * this.rowCount);
        var colorIndex = Math.floor(Math.random() * 7);
        if (!this.isCellFilled(x, y)) {
            this.tbl.rows[y].cells[x].style.backgroundColor = this.colors[colorIndex];
            this.map[y * this.colCount + x] = 2;
        }
    },
    //��ǰ�ƶ��ķ���,ȡֵ0,1,2,3, �ֱ��ʾ����,��,��,��, �����̷������Ըı���
    //direction: 0,
    M_left:function (s) {
        this.direction = 3;
        this.move(s);
    },
    M_right:function (s) {
        this.direction = 1;
        this.move(s);
    },
    M_up:function (s) {
        this.direction = 0;
        this.move(s);
    },
    M_down:function (s) {
        this.direction = 2;
        this.move(s);
    },
    M_getMap:function () {
        return this.map;
    },
    M_getRowCount:function () {
        return this.rowCount;
    },
    M_getColCount:function () {
        return this.colCount;
    },
    M_getSnakes:function () {
        return this.body;
    },
    M_getDir:function () {
        return direction;
    },
    canContinue:function () {
        return true;
    },
    isStop:function () {
        return this._isStop;
    },
    isWin:function () {
        return this._isWin;
    },
    registMethod:function () {
        return [
            ['M_left', 'left'],
            ['M_right', 'right'],
            ['M_up', 'up'],
            ['M_down', 'down'],
            ['M_getMap', 'getMap'],
            ['M_getRowCount', 'getRowCount'],
            ['M_getColCount', 'getColCount'],
            ['M_getSnakes', 'getSnakes'],
            ['M_getDir', 'getDir']
        ];
    },
    registDefaultMethod:function () {
        return 'up(1)';
    },
    //registBeginMethod:function(){
    //	return 'restart';
    //},
    registWinMethod:function () {
        return 'isWin';
    },
    registLoopMethod:function () {
        return 'canContinue';
    },
    registStopMethod:function () {
        return 'isStop';
    },
    getLoopTime:function () {
        return 1000;
    }
})