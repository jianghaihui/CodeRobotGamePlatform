// JavaScript Document
function Mini() {
    this.num = 380;
    this._width = 20;
    this._height = 20;
    this.o_mm = new Array(this._width * this._height);
    this.mm = new Array(this._width * this._height);//-1-->has mini;0--other:��ʾ
    this._mm = new Array(this._width * this._height);//0-->not click;1-->clicked;2-->flat
    this.parent = "body";
    this.input = "input";
    this.editor = "editor";
}
Mini.prototype.open = function () {
    var _parent = document.getElementById(this.parent);
    for (var k = 0; k < this.mm.length; k++) {
        this.mm[k] = 0;
        this._mm[k] = 0;
    }
    for (var k = 0; k < this.num; k++) {
        var n = Math.round(Math.random() * this._width * this._height);
        if (this.mm[n] == -1) {
            k--;
            continue;
        }
        this.mm[n] = -1;
        n + 1 >= 0 && n + 1 < this._width * this._height && this.mm[n + 1] != -1 ? this.mm[n + 1]++ : 0;
        n - 1 >= 0 && n - 1 < this._width * this._height && this.mm[n - 1] != -1 ? this.mm[n - 1]++ : 0;

        n + this._width + 1 >= 0 && n + this._width + 1 < this._width * this._height && this.mm[n + this._width + 1] != -1 ? this.mm[n + this._width + 1]++ : 0;
        n + this._width >= 0 && n + this._width < this._width * this._height && this.mm[n + this._width] != -1 ? this.mm[n + this._width]++ : 0;
        n + this._width - 1 >= 0 && n + this._width - 1 < this._width * this._height && this.mm[n + this._width - 1] != -1 ? this.mm[n + this._width - 1]++ : 0;

        n - this._width + 1 >= 0 && n - this._width + 1 < this._width * this._height && this.mm[n - this._width + 1] != -1 ? this.mm[n - this._width + 1]++ : 0;
        n - this._width >= 0 && n - this._width < this._width * this._height && this.mm[n - this._width] != -1 ? this.mm[n - this._width]++ : 0;
        n - this._width - 1 >= 0 && n - this._width - 1 < this._width * this._height && this.mm[n - this._width - 1] != -1 ? this.mm[n - this._width - 1]++ : 0;
        if (n % this._width == 0) {
            n - 1 >= 0 && n - 1 < this._width * this._height && this.mm[n - 1] != -1 ? this.mm[n - 1]-- : 0;
            n - this._width - 1 >= 0 && n - this._width - 1 < this._width * this._height && this.mm[n - this._width - 1] != -1 ? this.mm[n - this._width - 1]-- : 0;
            n + this._width - 1 >= 0 && n + this._width - 1 < this._width * this._height && this.mm[n + this._width - 1] != -1 ? this.mm[n + this._width - 1]-- : 0;
        }
        if ((n + 1) % this._width == 0) {
            n + 1 >= 0 && n + 1 < this._width * this._height && this.mm[n + 1] != -1 ? this.mm[n + 1]-- : 0;
            n - this._width + 1 >= 0 && n - this._width + 1 < this._width * this._height && this.mm[n - this._width + 1] != -1 ? this.mm[n - this._width + 1]-- : 0;
            n + this._width + 1 >= 0 && n + this._width + 1 < this._width * this._height && this.mm[n + this._width + 1] != -1 ? this.mm[n + this._width + 1]-- : 0;
        }
    }
    for (var i = 0; i < this._height; i++) {
        for (var j = 0; j < this._width; j++) {
            var _BTN = document.createElement('input');
            _BTN.type = 'button';
            _BTN.setAttribute('disabled', false);
            _BTN.className = 'btn';
            _BTN.setAttribute('value', "");
            _BTN.setAttribute('readOnly', "readOnly");
            this.o_mm[i * this._width + j] = _BTN;
            _parent.appendChild(_BTN);
        }
        _parent.appendChild(document.createElement('br'));
    }
}
/**
 *return -2--->not click
 *return -3--->has flat
 *return -1--->has mini
 *return 0 or other --->��ʾ��Ϣ
 *
 **/
Mini.prototype.get = function (x) {
    if (this._mm[x] == 0) {
        return -2;
    } else if (this._mm[x] == 2) {
        return -3
    } else {
        return this.mm[x];
    }
}
Mini.prototype.click = function (x) {
    this._mm[x] = 1;
    if (this.mm[x] == -1) {
        this.showAll();
        alert("Oh...Has Mini....You death");
    } else {
        if (this.mm[x] == 0) {
            this.o_mm[x].setAttribute('value', "");
            this.o_mm[x].setAttribute('style', "background-color='#ccc'");
            this.o_mm[x].style.background = "#ccc";
            this.clickAll(x);
        } else {
            this.o_mm[x].setAttribute('value', this.mm[x]);
            this.o_mm[x].setAttribute('style', "background-color='#ccc'");
            this.o_mm[x].style.background = "#ccc";
        }
    }
    if (this.isWin())alert("Yes...You are win");
}
Mini.prototype.flat = function (x) {
    if (this._mm[x] == 0) {
        this._mm[x] = 2;
        this.o_mm[x].setAttribute('value', "F");
    }
}
Mini.prototype.run = function () {
    var src = document.getElementById(this.input).value;
    return (new Function(src)());
}
Mini.prototype.runs = function () {
    var src = document.getElementById(this.editor).value;
    return (new Function(src)());
}
Mini.prototype.isWin = function () {
    for (var i = 0; i < this.mm.length; i++) {
        if (this.mm[i] != -1) {
            if (this._mm[i] == 0)return false;
        }
    }
    return true;
}
Mini.prototype.clickAll = function (x) {
    if (x + 1 >= 0 && x + 1 < this._width * this._height && this._mm[x + 1] == 0 && (x + 1) % this._width != 0) {
        if (this.mm[x + 1] == 0) {
            this.o_mm[x + 1].setAttribute('value', "");
            this.o_mm[x + 1].setAttribute('style', "background-color:#CCC");
            this.o_mm[x + 1].style.background = "#ccc";
        } else {
            this.o_mm[x + 1].setAttribute('value', this.mm[x + 1]);
            this.o_mm[x + 1].setAttribute('style', "background-color:#CCC");
            this.o_mm[x + 1].style.background = "#ccc";
        }
        //document.getElementById("test_console").innerHTML = document.getElementById("test_console").innerHTML+(x+1)+":"+this.mm[x+1]+"<br>";
        this._mm[x + 1] = 1;
        if (this.mm[x + 1] == 0)this.clickAll(x + 1);
    }
    if (x - 1 >= 0 && x - 1 < this._width * this._height && this._mm[x - 1] == 0 && (x) % this._width != 0) {
        if (this.mm[x - 1] == 0) {
            this.o_mm[x - 1].setAttribute('value', "");
            this.o_mm[x - 1].setAttribute('style', "background-color:#CCC");
            this.o_mm[x - 1].style.background = "#ccc";
        } else {
            this.o_mm[x - 1].setAttribute('value', this.mm[x - 1]);
            this.o_mm[x - 1].setAttribute('style', "background-color:#CCC");
            this.o_mm[x - 1].style.background = "#ccc";
        }
        //document.getElementById("test_console").innerHTML = document.getElementById("test_console").innerHTML+(x-1)+":"+this.mm[x-1]+"<br>";
        this._mm[x - 1] = 1;
        if (this.mm[x - 1] == 0)this.clickAll(x - 1);
    }
    if (x - this._width >= 0 && x - this._width < this._width * this._height && this._mm[x - this._width] == 0) {
        if (this.mm[x - this._width] == 0) {
            this.o_mm[x - this._width].setAttribute('value', "");
            this.o_mm[x - this._width].setAttribute('style', "background-color:#CCC");
            this.o_mm[x - this._width].style.background = "#ccc";
        } else {
            this.o_mm[x - this._width].setAttribute('value', this.mm[x - this._width]);
            this.o_mm[x - this._width].setAttribute('style', "background-color:#CCC");
            this.o_mm[x - this._width].style.background = "#ccc";
        }
        //document.getElementById("test_console").innerHTML = document.getElementById("test_console").innerHTML+(x-this._width)+":"+this.mm[x-this._width]+"<br>";
        this._mm[x - this._width] = 1;
        if (this.mm[x - this._width] == 0)this.clickAll(x - this._width);
    }
    if (x + this._width >= 0 && x + this._width < this._width * this._height && this._mm[x + this._width] == 0) {
        if (this.mm[x + this._width] == 0) {
            this.o_mm[x + this._width].setAttribute('value', "");
            this.o_mm[x + this._width].setAttribute('style', "background-color:#CCC");
            this.o_mm[x + this._width].style.background = "#ccc";
        } else {
            this.o_mm[x + this._width].setAttribute('value', this.mm[x + this._width]);
            this.o_mm[x + this._width].setAttribute('style', "background-color:#CCC");
            this.o_mm[x + this._width].style.background = "#ccc";
        }
        //document.getElementById("test_console").innerHTML = document.getElementById("test_console").innerHTML+(x+this._width)+":"+this.mm[x+this._width]+"<br>";
        this._mm[x + this._width] = 1;
        if (this.mm[x + this._width] == 0)this.clickAll(x + this._width);
    }
}
Mini.prototype.showAll = function () {
    for (var i = 0; i < this.o_mm.length; i++) {
        if (this.mm[i] == 0) {
            this.o_mm[i].setAttribute('value', "");
            this.o_mm[i].setAttribute('style', "background-color='#ccc'");
            this.o_mm[i].style.background = "#ccc";
        } else if (this.mm[i] == -1) {
            this.o_mm[i].setAttribute('value', "*");
            this.o_mm[i].setAttribute('style', "background-color='#ccc'");
            this.o_mm[i].style.background = "#f00";
        } else {
            this.o_mm[i].setAttribute('value', this.mm[i]);
            this.o_mm[i].setAttribute('style', "background-color='#ccc'");
            this.o_mm[i].style.background = "#ccc";
        }
    }
}