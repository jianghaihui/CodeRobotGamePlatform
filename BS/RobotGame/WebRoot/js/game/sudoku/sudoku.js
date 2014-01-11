DCC.game.Sudoku = Ext.extend(Ext.app.GameModule, {
    id:'sudoku-game',
    size:9,
    _width:405,
    _height:405,
    version:'v1.0',
    // 游戏状态
    gameState:'init',
    // 计时器
    gameTimer:null,
    // 游戏局面
    layout:[],
    // 答案
    answer:[],
    // 答案的索引
    answerPosition:[],

    oldSolving:[],
    // 游戏时的待填局面
    solving:[],

    HTML:document.createElement('div'),

    init:function () {
        this.initGame();
        this.initUI();
    }, //init end
    initGame:function () {
        for (var i = 0; i < this.size; i++) {
            for (var j = 0; j < this.size; j++) {
                this.layout[i * this.size + j] = 0;
                this.solving[i * this.size + j] = 0;
                this.oldSolving[i * this.size + j] = 0;
                this.answerPosition[i * this.size + j] = 0;
                for (var h = 0; h < this.size; h++) {
                    this.answer[i * this.size * this.size + j * this.size + h] = 0;
                }
            }
        }
    },
    initUI:function () {
        var self = this;
        // 难度选择
        var level = "<input type='radio' name='level' checked>初级<br/>"
            + "<input type='radio' name='level'>中级<br/>"
            + "<input type='radio' name='level'>高级<br/>"
            + "<input type='radio' name='level'>骨灰级<br/><br/>";

        // 西部面板
        var westPanel = document.createElement('div');
        westPanel.align = 'center';
        westPanel.className = 'westPanel';
        westPanel.innerHTML = '<span style="color:red;">游戏选项</span><br/>'
            + '<font size="2">请选择难度：<br/>' + level + '</font>';
        this.HTML.appendChild(westPanel);

        // 中央面板
        var mp = document.createElement('div');
        mp.setAttribute('id', 'mp');
        mp.className = 'mainPanel';
        this.HTML.appendChild(mp);
        // 游戏局面
        var w = this._width / this.size;
        var h = this._height / this.size;

        for (var i = 0; i < this.size; i++) {
            for (var j = 0; j < this.size; j++) {
                var cell = document.createElement('div');
                cell.setAttribute('id', 'cell_' + i + '_' + j);
                cell.style.cssText = "position:absolute;left:" + j * w
                    + "px;top:" + i * h + "px;width:" + w + "px;height:"
                    + h + "px;border:2px solid #666;";
                var subSize = Math.floor(Math.sqrt(this.size));
                var r = Math.floor(i / subSize);
                var c = Math.floor(j / subSize);
                if (r % 2 == c % 2) {
                    cell.style.background = 'pink';
                }
                mp.appendChild(cell);
            }
        }
    }, //initUI end

    createWindow:function () {
        var _win = this.getWindow();
        if (!_win) {
            _win = MainOS.desktop.createWindow({
                id:this.id + "-win",
                title:'Sudoku Window',
                width:550,
                height:500,
                iconCls:'icon-sudoku-win',
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
                        iconCls:'sudoku-win-restart-tbar',
                        listeners:{
                            click:this.restart.createDelegate(this)
                        }
                    },
                    {
                        xtype:'button',
                        tooltip:'Descreption',
                        iconCls:'sudoku-win-descreption-tbar',
                        listeners:{
                            click:function () {
                                var win = new Ext.Window({
                                    title:'Sudoku Descreption',
                                    id:'Sudoku Descreption',
                                    width:500,
                                    height:400,
                                    //manager:t.getWindowManager(),
                                    minimizable:true,
                                    maximizable:true,
                                    autoScroll:true,
                                    autoLoad:{url:'page/game/sudoku/descreption.html'}
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
        this.start();
    }, //createWindow end
    // 生成游戏局面
    generate:function () {
        this.initGame();
        var curRow = 0, curCol = 0;
        while (curRow != this.size) {
            if (this.answerPosition[curRow * this.size + curCol] == 0)
                this.getAnswer(curRow, curCol);// 如果这个位置没有被回溯过，就不用重新计算解空间
            var ansCount = this.getAnswerCount(curRow, curCol);
            if (ansCount == this.answerPosition[curRow * this.size + curCol]
                && curRow == 0 && curCol == 0)
                break;// 全部回溯完毕
            if (ansCount == 0) {
                this.answerPosition[curRow * this.size + curCol] = 0;// 无可用解，应该就是0
                // alert("无可用解，回溯！");
                if (curCol > 0) {
                    curCol--;
                } else if (curCol == 0) {
                    curCol = 8;
                    curRow--;
                }
                this.layout[curRow * this.size + curCol] = 0;
                continue;
            }
            // 可用解用完
            else if (this.answerPosition[curRow * this.size + curCol] == ansCount) {
                // alert("可用解用完，回溯！");
                this.answerPosition[curRow * this.size + curCol] = 0;
                if (curCol > 0) {
                    curCol--;
                } else if (curCol == 0) {
                    curCol = 8;
                    curRow--;
                }
                this.layout[curRow * this.size + curCol] = 0;
                continue;
            } else {
                // 返回指定格中，第几个解
                this.layout[curRow * this.size + curCol] = this.getAnswerNum(
                    curRow, curCol, this.answerPosition[curRow * this.size
                        + curCol]);
                // alert("位置：(" + curRow + ", " + curCol + ")="
                // + layout[curRow][curCol]);
                this.answerPosition[curRow * this.size + curCol]++;
                if (curCol == 8) {
                    curCol = 0;
                    curRow++;
                } else if (curCol < 8) {
                    curCol++;
                }
            }
        }
    }, //generate end
    // 取指定行列的答案
    getAnswer:function (row, col) {
        for (var i = 1; i <= this.size; i++) {
            this.answer[row * this.size * this.size + col * this.size + i - 1] = i;// 假定包含所有解
        }
        // 去除已经包含的
        for (var i = 0; i < this.size; i++) {
            if (this.layout[i * this.size + col] != 0) {
                this.answer[row * this.size * this.size + col * this.size
                    + this.layout[i * this.size + col] - 1] = 0;// 去除列中包含的元素
            }
            if (this.layout[row * this.size + i] != 0) {
                this.answer[row * this.size * this.size + col * this.size
                    + this.layout[row * this.size + i] - 1] = 0;// 去除行中包含的元素
            }
        }
        var subnum = Math.floor(Math.sqrt(this.size));
        var x = Math.floor(row / subnum);
        var y = Math.floor(col / subnum);
        for (var i = x * subnum; i < subnum + x * subnum; i++) {
            for (var j = y * subnum; j < subnum + y * subnum; j++) {
                if (this.layout[i * this.size + j] != 0)
                    this.answer[row * this.size * this.size + col * this.size
                        + this.layout[i * this.size + j] - 1] = 0;// 去小方格中包含的元素
            }
        }
        this.randomAnswer(row, col);
    }, //getAnswer end
    // 对指定行列的答案随机排序
    randomAnswer:function (row, col) {
        // 随机调整一下顺序
        var list = [];
        for (var i = 0; i < this.size; i++)
            list.push(this.answer[row * this.size * this.size + col * this.size
                + i]);
        var rdm = 0, idx = 0;
        while (list.length != 0) {
            rdm = Math.floor(Math.random() * list.length);
            this.answer[row * this.size * this.size + col * this.size + idx] = list[rdm];
            list.splice(rdm, 1);
            idx++;
        }
    }, //randomAnswer end
    // 计算指定行列可用解的数量
    getAnswerCount:function (row, col) {
        var count = 0;
        for (var i = 0; i < this.size; i++)
            if (this.answer[row * this.size * this.size + col * this.size + i] != 0)
                count++;
        return count;
    }, // getAnswerCount end

    // 返回指定行列在指定位置的解
    getAnswerNum:function (row, col, ansPos) {
        var cnt = 0;
        for (var i = 0; i < this.size; i++) {
            // 找到指定位置的解，返回
            if (cnt == ansPos
                && this.answer[row * this.size * this.size + col
                * this.size + i] != 0)
                return this.answer[row * this.size * this.size + col
                    * this.size + i];
            if (this.answer[row * this.size * this.size + col * this.size + i] != 0)
                cnt++;// 是解，调整计数器
        }
        return 0;// 没有找到，逻辑没有问题的话，应该不会出现这个情况
    }, //getAnswerNum end

    // 检查玩家的答案是否正确
    checkAnswer:function () {
        var flag = true;

        for (var i = 0; i < this.size; i++) {
            for (var j = 0; j < this.size; j++) {
                if (this.solving[i * this.size + j] != this.layout[i
                    * this.size + j]) {
                    flag = false;
                    var cell = Ext.getDom('cell_' + i + '_' + j);
                    this.twinkle(cell, cell.style.background, 'red');
                    // alert('请在第' + (i + 1) + '行，' + (j + 1) + '列填上你的答案！');
                    break;
                }
            }
            if (!flag)
                break;
        }

        if (flag && this.gameState != 'init') {
            return true;
        }
        return false;
    }, //checkAnswer end
    // 判断生成的游戏局面是否只有一种答案
    checkUnique:function () {
        var res = [];
        for (var r1 = 0; r1 < this.size - 1; r1++) {
            for (var r2 = r1 + 1; r2 < this.size; r2++) {
                for (var c1 = 0; c1 < this.size - 1; c1++) {
                    for (var c2 = c1 + 1; c2 < this.size; c2++) {
                        if (this.layout[r1 * this.size + c1] == this.layout[r2
                            * this.size + c2]
                            && this.layout[r1 * this.size + c2] == this.layout[r2
                            * this.size + c1]) {
                            res.push([r1, r2, c1, c2]);
                        }
                    }
                }
            }
        }
        return res;
    }, //checkUnique end
    // 开始游戏
    start:function () {
        // 重新生成游戏局面
        this.restart();

        // 修改游戏状态
        this.gameState = 'start';
    }, // start end
    // 重新开局
    restart:function () {
        // 游戏局面生成
        this.generate(this.size);
        // 游戏难度级别
        var checkedIndex = this.getLevel();
        var self = this;

        for (var i = 0; i < this.size; i++) {
            for (var j = 0; j < this.size; j++) {
                var cell = Ext.getDom('cell_' + i + '_' + j);
                //cell.style.borderColor = '#666';
                cell.innerHTML = '';

                var rdm = Math.floor(Math.random() * 6);
                if (rdm > checkedIndex) {
                    cell.innerHTML = this.layout[i * this.size + j];
                    this.solving[i * this.size + j] = this.layout[i * this.size + j];
                    this.oldSolving[i * this.size + j] = this.layout[i * this.size + j];
                } else {
                    //cell.style.borderColor = '#0e0';
                    //cell.style.background = '#0e0';
                    //cell.style.color = '#0e0';
                }
            }
        }

        // 消除可能存在的多解情形
        var isUnique = this.checkUnique();
        for (i = 0; i < isUnique.length; i++) {
            var r1 = isUnique[i][0];
            var r2 = isUnique[i][1];
            var c1 = isUnique[i][2];
            var c2 = isUnique[i][3];
            // 如果多解的四个格子都为空
            if (this.solving[r1 * this.size + c1] == 0
                && this.solving[r1 * this.size + c2] == 0
                && this.solving[r2 * this.size + c1] == 0
                && this.solving[r2 * this.size + c2] == 0) {
                // 四个空中，随机填上一个
                var rdm = Math.floor(Math.random() * 4);
                var r = isUnique[i][Math.floor(rdm / 2)];
                var c = isUnique[i][rdm % 2 + 2];
                var cell = Ext.getDom('cell_' + r + '_' + c);
                cell.innerHTML = this.layout[r * this.size + c];
                this.solving[r * this.size + c] = this.layout[r * this.size + c];
                this.oldSolving[r * this.size + c] = this.layout[r * this.size + c];
            }
        }
    }, //restart end
    // 当输入答案时，检查是否有冲突
    onSelect:function (v, i, j) {
        var cp = this.getCheckingPosition(i, j);

        var flag = true;
        for (var h = 0; h < cp.length; h++) {
            var r = cp[h][0];
            var c = cp[h][1];
            if (this.solving[r * this.size + c] == v) {
                // alert('v=' + v + '(i,j)=(' + r + ',' + c + ')')
                flag = false;
                // 有冲突的标记为红色
                var cell = Ext.getDom('cell_' + r + '_' + c);
                this.twinkle(cell, cell.style.background, 'red')
            }
        }
        // 如果没有冲突
        // if (flag)
        this.solving[i * this.size + j] = v;
    }, //onSelect end
    // 取得某格所在行，列，九宫格的所有行列号
    getCheckingPosition:function (i, j) {
        var res = [];
        for (var h = 0; h < this.size; h++) {
            if (h != i)
                res.push([h, j])
            if (h != j)
                res.push([i, h]);
        }
        var sub = Math.floor(Math.sqrt(this.size));
        var subRow = Math.floor(i / sub);
        var subCol = Math.floor(j / sub);
        for (var x = subRow * sub; x < subRow * sub + sub; x++) {
            for (var y = subCol * sub; y < subCol * sub + sub; y++) {
                if (x != i || y != j) {
                    res.push([x, y]);
                }
            }
        }

        return res;
    }, //getCheckingPosition end
    // 取得游戏难度等级
    getLevel:function () {
        var l = document.getElementsByName('level');
        for (var i = 0; i < l.length; i++) {
            if (l[i].checked) {
                return i + 1;
            }
        }
    }, //getLevel end
    // el的背景闪烁效果
    twinkle:function (el, oldColor, newColor) {
        var z = el.innerHTML;
        var i = 0;
        var t = setInterval(function () {
            if (i < 7) {
                if (i % 2 == 1 && el.innerHTML == z) {
                    el.style.background = newColor;
                } else {
                    el.style.background = oldColor;
                }
                i++;
            } else {
                el.style.background = oldColor;
                clearInterval(t);
            }
        }, 200);
    }, //twinkle end
    // 将时间间隔转换为时间字符串，如90秒转化为：00:01:30
    changeTimeToString:function (time) {
        var res = '';
        var h = Math.floor(time / 3600);
        if (h < 10) {
            h = '0' + h;
        }
        var m = time % 3600;
        m = Math.floor(m / 60);
        if (m < 10) {
            m = '0' + m;
        }
        var s = time % 60;
        if (s < 10) {
            s = '0' + s;
        }

        res = h + ':' + m + ':' + s;
        return res;
    }, //changeTimeToString end

    M_getMap:function () {
        return this.oldSolving;
    },

    M_getCurrMap:function () {
        return this.solving;
    },
    M_input:function (v, x, y) {
        var cell = Ext.getDom('cell_' + y + '_' + x);
        if (this.oldSolving[y * this.size + x] == 0) {
            cell.innerHTML = '<font color="#00ee00">' + v + '</font>';
            this.onSelect(v, y, x);
        }
    },

    registMethod:function () {
        return [
            ['M_getMap', 'getMap'],
            ['M_getCurrMap', 'getCurrMap'],
            ['M_input', 'input']
        ];
    },
    registWinMethod:function () {
        return 'checkAnswer';
    }
})
