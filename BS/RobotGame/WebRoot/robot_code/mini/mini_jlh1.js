var currentNum = 0;
var isChanged = true;
var loopCount = 0;

function goFlat(x) {
    if (get(x) == -1) {
        flat(x);
        currentNum++;

        return true;
    } else {
        return false;
    }
}

function doClick(x) {
    if (get(x) == -1) {
        click(x);
        return true;
    } else {
        return false;
    }
}

function deal(x) {
    var isChanged = false;
    if (get(x) == 0) {
        var arr = getSurround(x);
        for (var i = 0; i < arr.length; i++) {
            if (doClick(arr[i])) {
                isChanged = true;
            }
        }
    } else if (get(x) == 1) {

        if (getBomb(x).length == 1) {
            var arr = getSurround(x);
            for (var i = 0; i < arr.length; i++) {
                if (arr[i] != getBomb(x)[0]) {
                    if (doClick(arr[i])) {
                        isChanged = true;
                    }
                }
            }
        } else if (getDoubts(x).length == 1) {
            goFlat(getDoubts(x)[0]);
        }
    } else if (get(x) == 2) {

        if (getBomb(x).length == 2) {
            var arr = getSurround(x);
            for (var i = 0; i < arr.length; i++) {
                if (arr[i] != getBomb(x)[0] && arr[i] != getBomb(x)[1]) {
                    if (doClick(arr[i])) {
                        isChanged = true;
                    }
                }
            }
        } else if (getBomb(x).length == 1) {
            if (getDoubts(x).length == 1) {
                goFlat(getDoubts(x)[0]);

            }
        } else if (getBomb(x).length == 0) {
            if (getDoubts(x).length == 2) {
                goFlat(getDoubts(x)[0]);
                goFlat(getDoubts(x)[1]);

            }
        }
    } else if (get(x) == 3) {

        if (getBomb(x).length == 3) {
            var arr = getSurround(x);
            for (var i = 0; i < arr.length; i++) {
                if (arr[i] != getBomb(x)[0] && arr[i] != getBomb(x)[1] && arr[i] != getBomb(x)[2]) {
                    if (doClick(arr[i])) {
                        isChanged = true;
                    }
                }
            }
        } else if (getBomb(x).length == 2) {
            if (getDoubts(x).length == 1) {
                goFlat(getDoubts(x)[0]);

            }
        } else if (getBomb(x).length == 1) {
            if (getDoubts(x).length == 2) {
                goFlat(getDoubts(x)[0]);
                goFlat(getDoubts(x)[1]);

            }
        } else if (getBomb(x).length == 0) {
            if (getDoubts(x).length == 3) {
                goFlat(getDoubts(x)[0]);
                goFlat(getDoubts(x)[1]);
                goFlat(getDoubts(x)[2]);

            }
        }
    }
    return isChanged;
}

function getBomb(x) {
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

function getDoubts(x) {
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
            for (var x = 0; x < 224; x++) {
                isChanged = deal(x);
            }
        } while (isChanged);
        for (var x = 0; x < 224; x++) {
            if (get(x) == -1) {
                click(x);
                break;
            }
        }
        loopCount++;
    }
}