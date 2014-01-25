DCC.game.Tetris = Ext.extend(Ext.app.GameModule, {
    id:'tetris-game',
    oSheet:document.styleSheets[1],
    //������Ϣ
    cfg:{
        "ui":{
            "skin":0, "grid":true, "shadow":false, "next":true
        }, "direction":1 //��ת����: 1˳ʱ�� -1��ʱ��, "startLevel":0, "topScores":[]
    }, //cfg end
    //var Ts=["S","Z","L","J","I","O","T"]; //��״����
    layout:{
        "length":7, 0:{ //S
            "xy":[
                [
                    [0, 1, 1, 2],
                    [0, 0, -1, -1]
                ]
                ,
                [
                    [0, 0, 1, 1],
                    [-2, -1, -1, 0]
                ]
            ]
        }, 1:{ //Z
            "xy":[
                [
                    [0, 1, 1, 2],
                    [-1, -1, 0, 0]
                ]
                ,
                [
                    [0, 0, 1, 1],
                    [0, -1, -1, -2]
                ]
            ]
        }, 2:{ //L
            "xy":[
                [
                    [0, 0, 1, 2],
                    [0, -1, -1, -1]
                ]
                ,
                [
                    [0, 1, 1, 1],
                    [-2, -2, -1, 0]
                ]
                ,
                [
                    [0, 1, 2, 2],
                    [0, 0, 0, -1]
                ]
                ,
                [
                    [0, 0, 0, 1],
                    [-2, -1, 0, 0]
                ]
            ]
        }, 3:{ //J
            "xy":[
                [
                    [0, 1, 2, 2],
                    [-1, -1, -1, 0]
                ]
                ,
                [
                    [0, 1, 1, 1],
                    [0, 0, -1, -2]
                ]
                ,
                [
                    [0, 0, 1, 2],
                    [-1, 0, 0, 0]
                ]
                ,
                [
                    [0, 0, 0, 1],
                    [0, -1, -2, -2]
                ]
            ]
        }, 4:{ //I
            "xy":[
                [
                    [1, 1, 1, 1],
                    [-3, -2, -1, 0]
                ]
                ,
                [
                    [0, 1, 2, 3],
                    [0, 0, 0, 0]
                ]
            ]
        }, 5:{ //O
            "xy":[
                [
                    [0, 0, 1, 1],
                    [0, -1, 0, -1]
                ]
            ]
        }, 6:{ //T
            "xy":[
                [
                    [0, 1, 2, 1],
                    [-1, -1, -1, 0]
                ]
                ,
                [
                    [1, 1, 1, 0],
                    [-2, -1, 0, -1]
                ]
                ,
                [
                    [0, 1, 2, 1],
                    [0, 0, 0, -1]
                ]
                ,
                [
                    [0, 0, 0, 1],
                    [0, -1, -2, -1]
                ]
            ]
        }
    }, //layout end
    XY:[],
    blockSkins:["type1", "type2", "type3"],
    //������ÿ�����������һ���ٶ�
    uplevelScroe:10000,
    gLevelScroe:0, //�������������򻻼�ʱ����

    //����ʱ�䣬ÿ���ٺ�������һ��
    levels:[500, 450, 400, 350, 300, 250, 200, 150, 100, 70],
    addScores:[0, 100, 300, 600, 1000], //���мӷ�
    gScore:0, //�ܷ�
    gLines:0, //������
    //currLevel:0,
    //currMill : 500, //�ٶȼ��𣬼��������
    T:6, curr:0, currColor:0, currX:0, currY:0,
    timer_down:new Ext.util.DelayedTask(),
    //ֻ�С����ҡ���(��ת)�����ּ�����Ҫ�ظ������ģ�Ҫ�жϺ�ʱ���º�ʱ�ͷ�
    //������ͬ�����õļ��£�ֻ����һ����Ч������һ���ͷź���һ��Ҫ������Ч
    //�������Ҷ��ڰ���״̬�������ҵ�����ת���ò�����
    cfgNextBlock:{"T":0, "curr":0, "color":0},
    st_ready:0, st_playing:1, st_paused:2, st_over:3,
    //gStatus : 0, //״̬��ready, playing, paused, over
    currBlocks:[], //��ǰ���Ʒ��������
    lastCannotDown:false,
    movieY:19, movieX:0, aniTime:0,

    _continue:false,
    _stop:true,
    _isWin:false,

    init:function () {
        this.currLevel = this.cfg.startLevel;
        this.currMill = this.levels[this.currLevel]; //�ٶȼ��𣬼��������
        this.gStatus = this.st_ready; //״̬��ready, playing, paused, over
        function addCss(t) {
            var rules = t.oSheet.rules || t.oSheet.cssRules;
            var j = rules.length;
            var ar = t.oSheet.addRule ? (function (a, b) {
                t.oSheet.addRule(a, b)
            }) : (function (a, b) {
                t.oSheet.insertRule(a + "{" + b + "}", j++)
            });
            for (var i = 0; i < 7; i++)
                ar(".c" + i, "background-position: -" + (i * 28) + "px 0;");
            for (var i = 0; i < 10; i++)
                ar(".x" + i, "left: " + (i * 28) + "px;");
            for (var i = -4; i < 20; i++)
                ar(".y" + i, "top: " + (i * 28) + "px;");
        }

        addCss(this);
        this.initUI();
        //this.initGame();
    }, //init end

    initUI:function () {
        this.HTML = document.createElement('div');

        var dvStage = document.createElement('div');
        dvStage.id = 'tetris-win-dvStage';

        var dvOut = document.createElement('div');
        dvOut.className = 'tetris-win-dvOut';

        var dvIn = document.createElement('div');
        dvIn.className = "tetris-win-dvIn";

        var dvGameOver = document.createElement('div');
        dvGameOver.id = 'tetris-win-dvGameOver';
        dvGameOver.style.display = 'none';

        var dvGameOverBg = document.createElement('div');
        dvGameOverBg.id = 'tetris-win-dvGameOverBg';
        dvGameOverBg.className = 'opacity50';
        dvGameOverBg.style.display = 'none';
        //���
        var dvGrid = document.createElement('div');
        dvGrid.id = 'tetris-win-dvGrid';

        var dvBlocks = document.createElement('div');
        dvBlocks.id = 'tetris-win-dvBlocks';
        dvBlocks.className = 'dvBlocks';

        var dvRightBar = document.createElement('div');
        dvRightBar.id = 'tetris-win-dvRightBar';
        dvRightBar.style.textalign = 'left';

        var dvNextOutF = document.createElement('div');
        dvNextOutF.id = 'tetris-win-dvNextOutF';
        ;

        var dvNextOut = document.createElement('div');
        dvNextOut.id = 'tetris-win-dvNextOut';

        var dvNextBlocks = document.createElement('div');
        dvNextBlocks.id = 'tetris-win-dvNextBlocks';
        dvNextBlocks.className = 'dvBlocks';
        dvNextBlocks.innerHTML = " ";

        var dvScoreF = document.createElement('div');
        dvScoreF.id = 'tetris-win-dvScoreF';
        dvScoreF.className = 'dvScoreF';
        //�ٶ���ʾ��
        var dvLevel = document.createElement('span');
        dvLevel.id = 'tetris-win-dvLevel';
        dvLevel.innerHTML = '&nbsp;';
        //������ʾ��
        var dvScore = document.createElement('span');
        dvScore.id = 'tetris-win-dvScore';
        dvScore.innerHTML = '&nbsp;';

        dvIn.appendChild(dvGameOver);
        dvIn.appendChild(dvGameOverBg);
        dvIn.appendChild(dvBlocks);
        dvIn.appendChild(dvGrid);
        dvOut.appendChild(dvIn);

        dvNextOut.appendChild(dvNextBlocks);
        dvNextOutF.appendChild(dvNextOut);

        dvScoreF.appendChild(document.createTextNode('Level:'));
        dvScoreF.appendChild(dvLevel);
        dvScoreF.appendChild(document.createTextNode('Score:'));
        dvScoreF.appendChild(dvScore);

        dvRightBar.appendChild(dvNextOutF);
        dvRightBar.appendChild(dvScoreF);

        dvStage.appendChild(dvOut);
        dvStage.appendChild(dvRightBar);

        this.HTML.appendChild(dvStage);
        /*//�ٶȵȼ�ѡ���
         seLevel :  Ext.getDom('tetris-win-seLevel'),
         //��������ѡ���
         seBlockSkin :  Ext.getDom('tetris-win-seBlockSkin'),
         //���ѡ����ʾ��
         ckGrid :  Ext.getDom('tetris-win-ckGrid'),*/

    }, //initUI end

    initArg:function () {
        this.dvGameOver = Ext.getDom('tetris-win-dvGameOver');

        this.dvGameOverBg = Ext.getDom('tetris-win-dvGameOverBg');

        this.dvGrid = Ext.getDom('tetris-win-dvGrid');

        this.dvBlocks = Ext.getDom('tetris-win-dvBlocks');

        this.dvNextOutF = Ext.getDom('tetris-win-dvNextOutF');

        this.dvNextOut = Ext.getDom('tetris-win-dvNextOut');

        this.dvNextBlocks = Ext.getDom('tetris-win-dvNextBlocks');

        this.dvLevel = Ext.getDom('tetris-win-dvLevel');

        this.dvScore = Ext.getDom('tetris-win-dvScore');

    }, //initArg end

    initGame:function () {
        //��ʼ������
        this.resetXY();

        //��ʼ��Ԥ����
        this.dvNextBlocks.innerHTML = "<div> </div><div> </div><div> </div><div> </div>";

        function min(arr) {
            for (var i = 1, m = arr[0]; i < arr.length; i++) {
                if (arr[i] < m)m = arr[i];
            }
            return m;
        }

        function max(arr) {
            for (var i = 1, m = arr[0]; i < arr.length; i++) {
                if (arr[i] > m)m = arr[i];
            }
            return m;
        }

        //ÿ������е���С���xy
        for (var i = 0; i < this.layout.length; i++) {
            var xy = this.layout[i].xy;
            for (var j = 0; j < xy.length; j++) {
                var d = xy[j];
                d[2] = [min(d[0]), max(d[0]), min(d[1]), max(d[1])];
            }
        }

        this.currLevel = this.cfg.startLevel;
        this.dvLevel.innerHTML = this.currLevel + 1;
        this.dvScore.innerHTML = "0";

        this.display(this.dvGrid, this.cfg.ui.grid);

        //��ʼ������һЩ�����ڳ�����
        this.currColor = 0, this.draw4(6, 2, 4, true);
        this.currColor = 1, this.draw4(4, 5, 5, true);
        this.currColor = 2, this.draw4(2, 6, 8, true);
        this.currColor = 3, this.draw4(1, 2, 8, true);
        this.currColor = 4, this.draw4(0, 2, 12, true);
        this.currColor = 5, this.draw4(5, 6, 12, true);
        this.currColor = 6, this.draw4(3, 2, 16, true);
        this.viewNext();
    }, //initGame end

    createWindow:function () {
        var _win = this.getWindow();
        if (!_win) {
            _win = MainOS.desktop.createWindow({
                id:this.id + "-win",
                title:'Tetris Window',
                width:520,
                height:650,
                iconCls:'icon-tetris-win',
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
                        tooltip:'Descreption',
                        iconCls:'tetris-win-descreption-tbar',
                        listeners:{
                            click:function () {
                                var win = new Ext.Window({
                                    title:'Tetris Descreption',
                                    id:'Tetris Descreption',
                                    width:500,
                                    height:400,
                                    //manager:t.getWindowManager(),
                                    minimizable:true,
                                    maximizable:true,
                                    autoScroll:true,
                                    autoLoad:{url:'page/game/tetris/descreption.html'}
                                });
                                win.show();
                                win.toFront();
                            }, //.createDelegate(this,[this.getThis()])
                            scope:this
                        }
                    }
                ],
                html:this.HTML.innerHTML
            })
        }
        _win.show();
        this.initArg();
        this.initGame();
        //this.startNewGame();
    }, //createWindow end

    display:function (obj, b) {
        obj.style.display = b ? '' : 'none';
    },
    setBlockSkin:function (x) {
        var rules = this.oSheet.rules || this.oSheet.cssRules;
        for (var i = 0; i < 7; i++)
            rules[i].style.backgroundPosition = (-28 * i) + "px " + (-28 * x) + "px";
    },
    viewNext:function () {
        var T = Math.floor(this.layout.length * Math.random());
        var color = Math.floor(7 * Math.random());
        var curr = Math.floor(this.layout[T].xy.length * Math.random());
        var d = this.layout[T].xy[curr];
        var xmin = d[2][0], ymin = d[2][2];
        var w = d[2][1] - d[2][0] + 1, h = d[2][3] - d[2][2] + 1;
        var style = this.dvNextBlocks.style;
        style.left = (122 / 2 - w * 28 / 2) + "px";
        style.top = (122 / 2 - h * 28 / 2) + "px";
        for (var i = 0; i < 4; i++) {
            this.dvNextBlocks.childNodes[i].className = "c" + color + " x" + (d[0][i] - xmin) + " y" + (d[1][i] - ymin);
        }
        this.cfgNextBlock.T = T, this.cfgNextBlock.curr = curr, this.cfgNextBlock.color = color;
    },
    draw4:function (T, x, y, b) {
        var xy = this.layout[T].xy;
        var d = xy[0];
        var color = this.currColor;
        this.currBlocks = [];
        for (var i = 0; i < 4; i++) {
            var div = this.draw1(color, x + d[0][i], y + d[1][i]);
            if (!b)div.id = "T" + i;
            if (!b)this.currBlocks.push(div);
        }
        this.currX = x;
        this.currY = y;
    },
    draw1:function (c, x, y, b) {
        var div = document.createElement("div");
        div.className = "c" + c + " x" + x + " y" + y;
        if (b && x >= 0 && x < 10 && y >= 0 && y < 20) {
            this.XY[x][y] = true;
            div.id = 'end_' + x + '_' + y;
        }
        return this.dvBlocks.appendChild(div);
    },
    dropNewBlock:function () {
        this.T = this.cfgNextBlock.T;
        this.curr = this.cfgNextBlock.curr;
        this.currColor = this.cfgNextBlock.color;
        var xy2 = this.layout[this.T].xy[this.cfgNextBlock.curr][2];
        var x = Math.floor((10 - (xy2[1] - xy2[0] + 1) - xy2[0]) / 2);
        this.draw4(this.T, x, -1);
        this.down();
        this.viewNext();
        this._continue = true;
    },
    move:function (T, x, y) {
        x = this.currX + x;
        y = this.currY + y;
        var xy = this.layout[T].xy;
        var d = xy[this.curr];
        var color = "c" + this.currColor;
        var cx = [], cy = [];
        for (var i = 0; i < 4; i++) {
            cx[i] = (x + d[0][i]), cy[i] = (y + d[1][i]);
            if (cx[i] < 0 || cx[i] > 9 || cy[i] < -4 || cy[i] > 19)return;
        }
        for (var i = 0; i < 4; i++) {
            this.currBlocks[i].className = color + " x" + cx[i] + " y" + cy[i];
        }
        this.currX = x;
        this.currY = y;
    }, //move end
    end:function (T) {
        this._continue = false;
        this.currBlocks.end = true;
        this.timer_down.cancel();
        var lines = []; //����к�y
        for (var i = 0; i < 4; i++) {
            var xy = this.layout[T].xy[this.curr];
            var x = this.currX + xy[0][i];
            var y = this.currY + xy[1][i];
            //���y<0��game over
            if (y < 0) {
                this.gStatus = this.st_over;
                this.display(this.dvGameOver, true);
                this.display(this.dvGameOverBg, !Ext.isOpera);
                this._stop = true;
                //this.animate(this.dvGameOver);
                //movie(); //��β����
                //if(this.gScore);
                //alert(this.toStringXY());
                return;
            }
            this.XY[x][y] = true;
            this.currBlocks[i].id = 'end_' + x + '_' + y;
            var j = 0;
            for (j = 0; j < 10; j++) {
                if (!this.XY[j][y])break;
            }
            if (j == 10)lines.push(y);
        }
        this.currBlocks = [];
        var N = lines.length;
        if (N > 0) {
            this.gScore += this.addScores[N]; //�ӷ�
            this.gLevelScroe += this.addScores[N]; //�ӷ�
            this.dvScore.innerHTML = this.gScore;
            this.gLines += N;
            this.gLevelLines += N;
            //�ж��Ƿ���
            if (this.gLevelScroe >= this.uplevelScroe) {
                //if(gLevelLines >= uplevelLines){
                if (this.currLevel < this.levels.length - 1)this.currLevel++;
                else _isWin = true;
                this.currMill = this.levels[this.currLevel];
                this.dvLevel.innerHTML = this.currLevel + 1;
                this.gLevelLines = this.gLines % this.uplevelLines;
                this.gLevelScroe = this.gScore % this.uplevelScroe;
            }
            //��ʼ����
            for (var i = 0; i < N; i++) {
                for (var j = 0; j < 10; j++) {
                    this.dvBlocks.removeChild($('end_' + j + '_' + lines[i]));
                    this.XY[j][lines[i]] = false;
                }
            }
            lines = lines.sort();
            var yadds = []; //��¼ÿ�и�Ҫ���伸��
            for (var i = N - 1; i >= 0; i--) {
                for (var j = lines[i] - 1; j >= 0; j--) {
                    yadds[j] = (yadds[j] || 0) + 1;
                }
                yadds[lines[i]] = 0;
            }
            //ѭ�����Ƹ���
            for (var j = lines[N - 1] - 1; j >= 0; j--) {
                var addy = yadds[j];
                if (addy > 0)
                    for (var i = 0; i < 10; i++) {
                        if (this.XY[i][j]) {
                            this.XY[i][j] = false;
                            this.XY[i][j + addy] = true;
                            var obj = Ext.fly('end_' + i + '_' + j);
                            obj.className = obj.className.replace("y" + j, "y" + (j + addy));
                            obj.id = 'end_' + i + '_' + (j + addy);
                        }
                    }
            }
        }
        this.dropNewBlock();
    }, //end end
    rotate:function () {
        var xy = this.layout[this.T].xy;
        if (xy.length < 2)return;
        var curr2 = ((this.curr + this.cfg.direction) + xy.length) % xy.length;
        var d = xy[curr2];
        var color = "c" + this.currColor;
        var cxmin = d[2][0], cxmax = d[2][1];
        var x = this.currX, y = this.currY;
        //��תʱ���ߣ��������Ҫƽ��
        if (x + cxmin < 0) x = 0;
        else if (x + cxmax > 9) x = 9 - cxmax;
        //�ж��Ƿ��ܹ���ת������ת���ռλ�������Ƿ�Ϊ��
        for (var i = 0; i < 4; i++) {
            if (this.XY[x + d[0][i]][y + d[1][i]]) {
                return;
            }
        }
        //��ת
        this.curr = curr2;
        this.currX = x;
        for (var i = 0; i < 4; i++) {
            this.currBlocks[i].className = color + " x" + (x + d[0][i]) + " y" + (y + d[1][i]);
        }
    },
    //��Ȼ����һ��
    down:function () {
        if (this.gStatus != this.st_playing) return;
        var nowCannotDown = !this.canMove4(this.T, 0, 1);
        var nowCannotLeft = !this.canMove4(this.T, -1, 0);
        var nowCannotRight = !this.canMove4(this.T, 1, 0);
        if (this.lastCannotDown && nowCannotDown || nowCannotLeft && nowCannotRight && nowCannotDown) {
            this.end(this.T);
            this.lastCannotDown = nowCannotDown = nowCannotLeft = nowCannotRight = false;
            return false;
        }
        //this.timer_down.start.defer(this.currMill, this, [{run: this.down_T, interval:  this.currMill, scope: this,repeat:1}])
        this.timer_down.delay(this.currMill, this.down, this)
        nowCannotDown = !this.canMove4(this.T, 0, 1);
        if (nowCannotDown) {
            this.lastCannotDown = true;
        } else {
            this.move(this.T, 0, 1);
        }
        return true;
    },
    //�ֶ��ƶ�һ��
    move_1step:function (T, x, y) {
        if (!this.canMove4(T, x, y)) {
            return false;
        }
        this.move(T, x, y);
        return true;
    },
    //ֱ�ӿ������
    move_quickdown:function (T) {
        var y = 0;
        while (this.canMove4(T, 0, y + 1))y++;
        if (y) {
            this.move(T, 0, y);
            this.end(T);
        }
    },
    canMove4:function (T, addx, addy) {
        var xy = this.layout[T].xy[this.curr];
        var x0 = this.currX + addx, y0 = this.currY + addy;
        for (var i = 0; i < 4; i++) {
            var x = x0 + xy[0][i], y = y0 + xy[1][i];
            if (x < 0 || x > 9 || y > 19 || this.XY[x][y]) return false;
        }
        return true;
    },
    restart:function () {
        if (this.gStatus == this.st_playing || this.gStatus == this.st_paused) {
            if (!confirm("\u8981\u7EC8\u6B62\u5F53\u524D\u6E38\u620F\u91CD\u65B0\u5F00\u59CB\u5417\uFF1F"))
                return false;
        }
        this.display(this.dvGameOver, false);
        this.display(this.dvGameOverBg, false);
        this.dvScore.innerHTML = "0";
        this.currLevel = this.cfg.startLevel;
        this.currMill = this.levels[this.currLevel];
        this.dvLevel.innerHTML = this.currLevel + 1;
        this.timer_down.cancel();
        this.gStatus = this.st_ready;
        this.gScore = 0;
        this.gLines = 0;
        this.gLevelLines = 0;
        this.gLevelScroe = 0;
        this.dvBlocks.innerHTML = "";
        this.resetXY();
        return true;
    }, //restart end
    startNewGame:function () {
        this._continue = true;
        this._stop = false;
        if (!this.restart())return false;
        this.gStatus = this.st_playing;
        this.dropNewBlock();
    },
    resetXY:function () {
        for (var i = 0; i < 10; i++) {
            this.XY[i] = [];
            for (var j = 0; j < 20; j++) this.XY[i][j] = false;
        }
    },
    toStringXY:function () {
        var s = [];
        for (var i = 0; i < 20; i++) {
            s.push('\n');
            for (var j = 0; j < 10; j++) {
                s.push(this.XY[j][i] ? '\u25A0' : '\u25A1');
            }
        }
        return s.join("");
    },
    canContinue:function () {
        if (this._continue) {
            this._continue = false;
            return true;
        }
        return false;
    },
    isStop:function () {
        return this._stop;
    },
    isWin:function () {
        return this._isWin;
    },
    M_getXY:function () {
        return this.XY;
    },
    M_isBlock:function (x, y) {
        return this.XY[x][y];
    },
    M_getCurrBlock:function () {
        var r2 = [];
        for (var i = 0; i < this.currBlocks.length; i++) {
            var str = this.currBlocks[i].className;
            var reg1 = /x-?\d*/;
            var reg2 = /y-?\d*/;
            var _x = reg1.exec(str)[0].replace('x', '');
            var _y = reg2.exec(str)[0].replace('y', '');
            var r1 = [_x, _y];
            r2[i] = r1;
        }
        return r2;
    },
    M_getCurr:function () {
        return this.curr;
    },
    M_getT:function () {
        return this.T;
    },
    M_left:function (step) {
        if (step > 0) {
            for (var i = 0; i < step; i++)
                this.move_1step(this.T, -1, 0);
        } else {
            this.move_1step(this.T, -1, 0);
        }
    },
    M_right:function (step) {
        if (step > 0) {
            for (var i = 0; i < step; i++)
                this.move_1step(this.T, 1, 0);
        } else {
            this.move_1step(this.T, 1, 0);
        }
    },
    M_down:function (step) {
        if (step > 0) {
            for (var i = 0; i < step; i++)
                this.down();
        } else {
            this.move_quickdown(this.T);
        }
    },
    M_move:function (x, y) {
        this.move(this.T, x, y);
    },
    M_pause:function () {
        this.gStatus = this.st_paused;
    },
    registMethod:function () {
        return [
            ['M_getXY', 'getMap'],
            ['M_isBlock', 'isBlock'],
            ['M_getCurrBlock', 'getCurrBlock'],
            ['rotate', 'rotate'],
            ['M_left', 'left'],
            ['M_right', 'right'],
            ['M_down', 'down'],
            //['M_move','move'],
            ['M_pause', 'pause'],
            ['M_getCurr', 'getCurr'],
            ['M_getT', 'getT']
        ];
    },
    registBeginMethod:function () {
        return 'startNewGame';
    },
    registLoopMethod:function () {
        return 'canContinue';
    },
    registStopMethod:function () {
        return 'isStop';
    },
    registWinMethod:function () {
        return 'isWin';
    },
    getLoopTime:function () {
        return this.currMill;
    }
})
