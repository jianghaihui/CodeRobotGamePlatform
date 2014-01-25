var flag = 0;
function addPanel()                  //��һ��15�У�15�е�����
{
    for (i = 1; i < 16; i++)
        insertRow(i);
    for (i = 1; i < 16; i++)
        insertCell(i);
}
function insertRow(rowCount)      //��table����һ��
{
    var myTable = document.getElementById('table1');
    var row = myTable.insertRow();
    row.setAttribute('id', rowCount);
}
function insertCell(cellCount)    //��ÿһ�в���һ�е����
{
    var rows = document.getElementsByTagName('TR');
    for (var no = 0; no < rows.length; no++) {
        var cell = rows[no].insertCell(-1);
        cell.setAttribute("id", rows[no].getAttribute('id') * 100 + cellCount);
        setCellPanelInnerHTML(cell);
        cell.setAttribute("name", "noChess");
        setCellOnClick(cell);
    }
}
function setCellPanelInnerHTML(cell)    //Ϊcell���ñ���
{
    var temp = cell.getAttribute("id");
    cell.innerHTML = "<img src='img/m.jpg'>";				//���ձ鵽����
    if (temp % 100 == 1) cell.innerHTML = "<img src='img/l.jpg'>";
    if (temp % 100 == 15) cell.innerHTML = "<img src='img/r.jpg'>";
    if (temp / 100 < 2) cell.innerHTML = "<img src='img/t.jpg'>";
    if (temp / 100 > 15) cell.innerHTML = "<img src='img/b.jpg'>";
    if (temp % 100 == 1 && temp / 100 < 2) cell.innerHTML = "<img src='img/lt.jpg'>";
    if (temp % 100 == 15 && temp / 100 < 2) cell.innerHTML = "<img src='img/rt.jpg'>";
    if (temp % 100 == 1 && temp / 100 > 15) cell.innerHTML = "<img src='img/lb.jpg'>";
    if (temp % 100 == 15 && temp / 100 > 15) cell.innerHTML = "<img src='img/rb.jpg'>";
}
function setCellOnClick(cell)  //Ϊ cell �� onclick() ��������
{
    cell.onclick = function () {
        if (cell.getAttribute("name") == "noChess") {
            if (flag % 2 == 0) {
                cell.innerHTML = "<img src='img/black.jpg'>";
                cell.setAttribute("name", "black");
            }
            else {
                cell.innerHTML = "<img src='img/white.jpg'>";
                cell.setAttribute("name", "white");
            }
            flag++;
            isAnyoneWin(cell, flag);
        }
    };
}
function isAnyoneWin(cell, flag)  //�ж���Ӯ�ķ���
{
    temp = checkChessMap("(x+i)+(y+i)*100", "", cell);
    temp = checkChessMap("(x+i)+y*100", temp, cell);
    temp = checkChessMap("(x+i)+(y-i)*100", temp, cell);
    temp = checkChessMap("x+(y+i)*100", temp, cell);
    if (temp.indexOf("11111") != -1) {
        alert("����" + flag + "��," + (cell.getAttribute("name") == "white" ? "��" : "��") + "��ʤ!");
        reStartGame();
    }
}
function checkChessMap(evalStr, temp, cell) {
    var val = cell.getAttribute("id");						 //�õ�һ������
    x = val % 100;												 //�������ʱ��XҪ����Y�ĺ���
    y = val / 100 - (val / 100) % 1;
    for (i = -4; i < 5; i++) {
        var pointValue = eval(evalStr);						 //��������ܹ֣������洫�ַ����������ֵ
        if (pointValue % 100 < 1 || pointValue % 100 > 15) continue;  //����������м䣬�����ѯ��һ��
        if (pointValue / 100 - (pointValue / 100) % 1 < 1 || pointValue / 100 - (pointValue / 100) % 1 > 15) continue;
        var xxx = document.getElementById(pointValue);		 //�����洫������������ѯ
        if (xxx.getAttribute("name") == cell.getAttribute("name"))    temp += "1";
        else temp += "0";
    }
    return temp += ",";
}
function reStartGame() {
    flag = 0;   //�µ���������
    var cells = document.getElementsByTagName("TD");
    for (var no = 0; no < cells.length; no++) {
        setCellPanelInnerHTML(cells[no]);
        cells[no].setAttribute("name", "noChess");  //cell��״̬����
    }
}
document.onreadystatechange = startGame;  //��״̬�ı�ʱ
function startGame() {
    if (document.readyState == "complete")
        try {
            addPanel();
        }
        catch (e) {
            alert("�ű����?��ȷ�ϣ�");
        }
}