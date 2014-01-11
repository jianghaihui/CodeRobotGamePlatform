var currentNum = 0;
var isChanged = 2;
var loopCount = 0;

function goFlat(x) {
    if (get(x) == -1) {
        flat(x);
        currentNum++;
        isChanged = 2;
    }
}

function doClick(x) {
    if (get(x) == -1) {
        click(x);
        isChanged = 2;
    }
}

function deal(x) {

    var unclickNum = getUnclicks(x).length;
    var bombsNum = getBombs(x).length;

    if (get(x) == 0) {
        if (unclickNum) {
            for (var i = 0; i < getUnclicks(x).length; i++) {
                doClick(getUnclicks(x)[0]);
            }
        }
    }
    for (var m = 1; m <= 8; m++) {
        if (get(x) == m) {
            if (bombsNum == m) {
                if (unclickNum) {
                    for (var i = 0; i < getUnclicks(x).length; i++) {
                        doClick(getUnclicks(x)[0]);
                    }
                }
            } else if (bombsNum + unclickNum == m) {
                for (var i = 0; i < getUnclicks(x).length; i++) {
                    goFlat(getUnclicks(x)[0]);
                }
            }
        }
    }
}

function getBombs(x) {
    var arr = getSurround(x);
    var bombs = [];
    var i = 0;

    for (var j = 0; j < arr.length; j++) {
        if (get(arr[j]) == -2) {
            bombs[i] = arr[j];
            i++;
        }
    }
    return bombs;
}

function getSurround(x) {
    var arr = [];
    var i = 0;
    var width = size();
    if (x > width - 1) {
        arr[i] = x - width;
        i++;
    }
    if (x < width * (width - 1) - 1) {
        arr[i] = x + width;
        i++;
    }
    if (x % width != 0) {
        arr[i] = x - 1;
        i++;
    }
    if (x % width != width - 1) {
        arr[i] = x + 1;
        i++;
    }
    if (x > width - 1 && x % width != 0) {
        arr[i] = x - width - 1;
        i++;
    }
    if (x > width - 1 && x % width != width - 1) {
        arr[i] = x - width + 1;
        i++;
    }
    if (x < width * (width - 1) - 1 && x % width != 0) {
        arr[i] = x + width - 1;
        i++;
    }
    if (x < width * (width - 1) - 1 && x % width != width - 1) {
        arr[i] = x + width + 1;
        i++;
    }
    return arr;
}

function getUnclicks(x) {
    var arr = getSurround(x);
    var doubts = [];
    var i = 0;

    for (var j = 0; j < arr.length; j++) {
        if (get(arr[j]) == -1 && get(arr[j]) != -2) {
            doubts[i] = arr[j];
            i++;
        }
    }
    return doubts;
}

function action(args) {
    var random = parseInt(Math.random() * (size() * size() - 1));
    var num = miniCount();

    click(random);
    while (currentNum < num && loopCount < 10) {

        do {
            for (var x = 0; x < size() * size() - 1; x++) {
                deal(x);
            }
            isChanged--;
        } while (isChanged > 0);
        var allUnclicks = [];
        var count = 0;
        var findUnclick = false;
        for (var x = 0; x < size() * size() - 1; x++) {
            if (get(x) == -1) {
                allUnclicks[count] = x;
                count++;
                findUnclick = true;
            } else if (findUnclick) {
                var y = parseInt(count / 2);
                doClick(allUnclicks[y]);
                break;
            }
        }

        loopCount++;
    }
    for (var x = 0; x < size() * size() - 1; x++) {
        deal(x);
    }
}