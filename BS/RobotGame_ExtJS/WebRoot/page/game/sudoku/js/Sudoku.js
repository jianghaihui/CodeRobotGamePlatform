Sudoku = function (size) {
    this.size = size;
    this.version = 'v1.0';
};

Sudoku.prototype = {
    // 记录游戏开始时间
    startTime:0,
    // 玩家所用的时间
    usedTime:0,
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
    // 游戏时的待填局面
    solving:[],
    // 记录玩家填写答案的顺序栈
    solvingStack:[],
    mask:null,
    // 数字选择器
    numberPicker:null,
    // 当前待选择填入数据的单元格
    choosing:{
        row:0,
        col:0
    },

    // 初始化
    init:function () {
        this.startTime = new Date().getTime();
        this.usedTime = 0;
        // this.gameState = 'init';

        for (var i = 0; i < this.size; i++) {
            for (var j = 0; j < this.size; j++) {
                this.layout[i * this.size + j] = 0;
                this.solving[i * this.size + j] = 0;
                this.answerPosition[i * this.size + j] = 0;
                for (var h = 0; h < this.size; h++) {
                    this.answer[i * this.size * this.size + j * this.size + h] = 0;
                }
            }
        }
    },
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
    },
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
    },
    // 计算指定行列可用解的数量
    getAnswerCount:function (row, col) {
        var count = 0;
        for (var i = 0; i < this.size; i++)
            if (this.answer[row * this.size * this.size + col * this.size + i] != 0)
                count++;
        return count;
    },
    // 返回指定行列在指定位置的解
    getAnswerNum:function (row, col, ansPos) {
        // 返回指定布局方格中指定位置的解
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
    },
    // 生成游戏局面
    generate:function () {
        this.init(this.size);
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
    },
    get:function (id) {
        return document.getElementById(id);
    },
    // 获得事件Event对象，用于兼容IE和FireFox
    getEvent:function () {
        return window.event || arguments.callee.caller.arguments[0];
    },
    getMousePosition:function (e) {
        var x = e.x || e.pageX;
        var y = e.y || e.pageY;
        return {
            x:x,
            y:y
        };
    },
    // 初始化界面
    initLayout:function () {
        var self = this;
        // 难度选择
        var level = "<input type='radio' name='level' checked>初级<br/>"
            + "<input type='radio' name='level'>中级<br/>"
            + "<input type='radio' name='level'>高级<br/>"
            + "<input type='radio' name='level'>骨灰级<br/><br/>";
        var time = '用时：<span id="timer" style="background:#0d0;width:60;color:red;">00:00:00</span><br/><br/>';
        var s = document.createElement('input');
        s.type = 'button';
        s.value = '开始';
        s.onclick = function () {
            this.value = '重新开始';
            self.start(this.size);
        }
        var p = document.createElement('input');
        p.type = 'button';
        p.setAttribute('id', 'pause');
        p.value = '暂停';
        p.onclick = function () {
            if (self.gameState != 'init') {
                if (p.value == '暂停') {
                    p.value = '继续';
                    self.gameState = 'pause';
                } else {
                    p.value = '暂停';
                    self.gameState = 'continue';
                }
                self.pause();
            }
        }

        // 西部面板
        var westPanel = document.createElement('div');
        westPanel.className = 'westPanel';
        westPanel.innerHTML = '<span style="color:red;">游戏选项</span><br/>'
            + '<font size="4">请选择难度：<br/>' + level + time + '</font>';
        westPanel.appendChild(s);
        westPanel.appendChild(p);
        document.body.appendChild(westPanel);

        // 中央面板
        var mp = document.createElement('div');
        mp.setAttribute('id', 'mp');
        mp.className = 'mainPanel';
        document.body.appendChild(mp);

        this.mask = document.createElement('div');
        this.mask.className = 'mask';
        // this.mask.innerHTML = '<img src="../images/sudoku1.jpg"
        // style="width:405px;height:455px;"></img>';

        // 数字选择器
        this.numberPicker = document.createElement('div');
        this.numberPicker.setAttribute('id', 'numberPicker');
        this.numberPicker.className = 'numberPicker';

        var title = document.createElement('div');
        title.style.cssText = 'position:absolute;left:0;top:0;width:100;'
            + 'height:18;text-align:left;color:red;';
        title.innerHTML = '请选择答案';
        this.numberPicker.appendChild(title);

        var closeBtn = document.createElement('div');
        closeBtn.style.cssText = 'position:absolute;left:100;top:0;width:20;height:18;'
            + 'cursor:pointer;cursor:hand;text-align:right;color:red;background:url(images/close.gif) no-repeat;';
        closeBtn.onclick = function () {
            document.body.removeChild(self.numberPicker);
        }
        this.numberPicker.appendChild(closeBtn);
        // this.numberPicker.onmouseout = function() {
        // document.body.removeChild(this);
        // }
        for (var i = 0; i < this.size; i++) {
            var numi = document.createElement('div');
            numi.setAttribute('id', 'picker_' + (i + 1));
            numi.innerHTML = i + 1;
            numi.style.cssText = "position:absolute;text-align:'center';font-size:28;left:"
                + (i % 3)
                * 40
                + "px;top:"
                + ((Math.floor(i / 3)) * 40 + 18)
                + "px;width:40px;height:40px;border:2px solid #666;cursor:pointer;";

            numi.onclick = function () {
                self.choose(this.id);
                this.style.background = '#0e0';
                document.body.removeChild(self.numberPicker);
            }
            numi.onmouseover = function () {
                this.style.background = '#FF0000';
            }
            numi.onmouseout = function () {
                this.style.background = '#0e0';
            }
            this.numberPicker.appendChild(numi);
        }

        // 游戏局面
        var w = mp.clientWidth / this.size;
        var h = (mp.clientHeight - 50) / this.size;

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
        this.stopSolving();

        /* 游戏控制按钮 */
        // 完成按钮
        var finish = document.createElement('input');
        finish.type = 'button';
        finish.value = '完成';
        finish.className = 'finish';
        finish.onclick = function () {
            self.checkAnswer();
        }

        // 撤消按钮
        var reset = document.createElement('input');
        reset.type = 'button';
        reset.value = '撤消';
        reset.className = 'reset';
        reset.onclick = function () {
            self.reset();
        }

        // 按钮面板
        var btnPanel = document.createElement('div');
        btnPanel.setAttribute('id', 'btnPanel');
        btnPanel.className = 'btnPanel';
        btnPanel.appendChild(finish);
        btnPanel.appendChild(reset);

        mp.appendChild(btnPanel);
    },
    // el的背景闪烁效果
    twinkle:function (el, oldColor, newColor) {
        var i = 0;
        var t = setInterval(function () {
            if (i < 7) {
                if (i % 2 == 1) {
                    el.style.background = newColor;
                } else {
                    el.style.background = oldColor;
                }
                i++;
            } else {
                clearInterval(t);
            }
        }, 200);
    },
    // 处理玩家选择的数字
    choose:function (id) {
        var c = id.split('_')[1];
        var t = this.get('cell_' + this.choosing.row + '_' + this.choosing.col);
        var previous = t.innerHTML;
        t.innerHTML = c;
        this.solvingStack
            .push([this.choosing.row, this.choosing.col, previous]);

        this.onSelect(c, this.choosing.row, this.choosing.col);
    },
    // 检查玩家的答案是否正确
    checkAnswer:function () {
        var flag = true;

        for (var i = 0; i < this.size; i++) {
            for (var j = 0; j < this.size; j++) {
                if (this.solving[i * this.size + j] != this.layout[i
                    * this.size + j]) {
                    flag = false;
                    var cell = this.get('cell_' + i + '_' + j);
                    this.twinkle(cell, cell.style.background, 'red');
                    // alert('请在第' + (i + 1) + '行，' + (j + 1) + '列填上你的答案！');
                    break;
                }
            }
            if (!flag)
                break;
        }

        if (flag && this.gameState != 'init') {
            var t = Math.floor((new Date().getTime() - this.startTime) / 1000);
            clearInterval(this.gameTimer);
            var c = confirm('恭喜！你的答案完全正确！\n用时：'
                + this.changeTimeToString(t + this.usedTime) + '\n重新开始？');
            if (c) {
                this.start();
            } else {
                this.get('timer').innerHTML = '00:00:00';
            }
        }
    },
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
    },
    // 开始游戏
    start:function () {
        // 重新生成游戏局面
        this.restart();

        // 除去蒙板
        if (this.gameState == 'init' || this.gameState == 'pause')
            this.continueSolving();

        // 判断当前游戏状态
        if (this.gameState == 'continue' || this.gameState == 'start') {
            clearInterval(this.gameTimer);
        } else {
            this.get('pause').value = '暂停';
        }
        // 修改游戏状态
        this.gameState = 'start';

        var self = this;

        // 开始计时
        this.startTime = new Date().getTime();
        var timer = this.get('timer');
        this.gameTimer = setInterval(function () {
            var time = Math.floor((new Date().getTime() - self.startTime)
                / 1000);
            timer.innerHTML = self.changeTimeToString(time);
        }, 1000);
    },
    // 重新开局
    restart:function () {
        // 游戏局面生成
        this.generate(this.size);
        // 游戏难度级别
        var checkedIndex = this.getLevel();
        var self = this;

        for (var i = 0; i < this.size; i++) {
            for (var j = 0; j < this.size; j++) {
                var cell = this.get('cell_' + i + '_' + j);
                cell.style.borderColor = '#666';
                cell.innerHTML = '';

                var rdm = Math.floor(Math.random() * 6);
                if (rdm > checkedIndex) {
                    cell.innerHTML = this.layout[i * this.size + j];
                    this.solving[i * this.size + j] = this.layout[i * this.size
                        + j];
                } else {
                    cell.style.borderColor = '#0e0';
                    // 获取焦点时，为同行，同列和所在九宫格添加背景色
                    cell.onmouseover = function () {
                        self.onMouseOver(this.id);
                    }
                    // 失去焦点时，去除背景色
                    cell.onmouseout = function () {
                        self.onMouseOut(this.id);
                    }
                    // 点击时，弹出选择答案窗口
                    cell.onclick = function (e) {
                        // 存储当前选择的待填单元格
                        var rc = this.id.split('_');
                        self.choosing.row = Number(rc[1]);
                        self.choosing.col = Number(rc[2]);

                        var np = self.numberPicker;
                        var pos = self.getMousePosition(self.getEvent());
                        np.style.left = pos.x;
                        np.style.top = pos.y;
                        document.body.appendChild(np);
                    }
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
                var cell = this.get('cell_' + r + '_' + c);
                cell.innerHTML = this.layout[r * this.size + c];
                this.solving[r * this.size + c] = this.layout[r * this.size + c];
            }
        }
    },
    // 当鼠标移入时
    onMouseOver:function (id) {
        var o = id.split('_');
        var i = Number(o[1]);
        var j = Number(o[2]);
        for (var h = 0; h < this.size; h++) {
            if (h != i) {
                this.get('cell_' + h + '_' + j).style.background = '#FFA000';// 所在列变色
            }
            if (h != j) {
                this.get('cell_' + i + '_' + h).style.background = '#FFA000';// 所在行变色
            }
        }
        // 所在的九宫格变色
        var sub = Math.floor(Math.sqrt(this.size));
        var subRow = Math.floor(i / sub);
        var subCol = Math.floor(j / sub);
        for (i = subRow * sub; i < subRow * sub + sub; i++) {
            for (j = subCol * sub; j < subCol * sub + sub; j++) {
                this.get('cell_' + i + '_' + j).style.background = '#FFA000';
            }
        }
    },
    // 当鼠标移出时
    onMouseOut:function (id) {
        // 如果未选择答案就将鼠标移出，则隐藏答案选择窗口
        // var np = this.get('numberPicker');
        // if (np) {
        // document.body.removeChild(np);
        // }

        var o = id.split('_');
        var i = Number(o[1]);
        var j = Number(o[2]);

        var subSize = Math.floor(Math.sqrt(this.size));
        var r = Math.floor(i / subSize);
        var c = Math.floor(j / subSize);
        for (var h = 0; h < this.size; h++) {
            var sh = Math.floor(h / subSize);
            if (h != i) {
                if (sh % 2 == c % 2) {
                    this.get('cell_' + h + '_' + j).style.background = 'pink';
                } else {
                    this.get('cell_' + h + '_' + j).style.background = 'white';
                }// 所在列颜色恢复
            }
            if (h != j) {
                if (sh % 2 == r % 2) {
                    this.get('cell_' + i + '_' + h).style.background = 'pink';
                } else {
                    this.get('cell_' + i + '_' + h).style.background = 'white';
                }// 所在行颜色恢复
            }
        }
        // 所在的九宫格变色
        var bgColor = (c % 2 == r % 2) ? 'pink' : 'white';
        var sub = Math.floor(Math.sqrt(this.size));
        var subRow = Math.floor(i / sub);
        var subCol = Math.floor(j / sub);
        for (i = subRow * sub; i < subRow * sub + sub; i++) {
            for (j = subCol * sub; j < subCol * sub + sub; j++) {
                this.get('cell_' + i + '_' + j).style.background = bgColor;
            }
        }
    },
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
                this.get('cell_' + r + '_' + c).style.background = 'red';
            }
        }
        // 如果没有冲突
        // if (flag)
        this.solving[i * this.size + j] = v;
    },
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
    },
    // 游戏暂停或继续
    pause:function () {
        // 当继续时，重新开始计时
        if (this.gameState == 'continue') {
            // 除去蒙板
            this.continueSolving();

            this.startTime = new Date().getTime();
            var self = this;
            this.gameTimer = setInterval(function () {
                var time = Math.floor(self.usedTime
                    + (new Date().getTime() - self.startTime) / 1000);
                timer.innerHTML = self.changeTimeToString(time);
            }, 1000);
        }
        // 暂停时，停止计时，并将已用的时间记录下来
        else {
            clearInterval(this.gameTimer);
            var t = Math.floor((new Date().getTime() - this.startTime) / 1000);
            this.usedTime += t;
            this.stopSolving();
        }
    },
    // 游戏暂停时不能填写答案
    stopSolving:function () {
        document.body.appendChild(this.mask);
    },
    // 游戏继续，除去游戏界面的蒙板
    continueSolving:function () {
        document.body.removeChild(this.mask);
    },
    // 取得游戏难度等级
    getLevel:function () {
        var l = document.getElementsByName('level');
        for (var i = 0; i < l.length; i++) {
            if (l[i].checked) {
                return i + 1;
            }
        }
    },
    // 重新填写答案
    reset:function () {
        // for (var i = 0; i < this.solvingStack.length; i++) {
        if (this.solvingStack.length > 0) {
            var ss = this.solvingStack.pop();
            this.solving[ss[0] * this.size + ss[1]] = ss[2];
            this.get('cell_' + ss[0] + '_' + ss[1]).innerHTML = ss[2];
        }
        // }
    },
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
    }
};

window.onload = function () {
    var sudoku = new Sudoku(9);
    sudoku.initLayout();
}