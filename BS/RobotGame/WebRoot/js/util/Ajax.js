CG_Ajax = {
    /**
     * 创建XML回调对象，
     * 如果存在window.XMLHttpRequest()对象,则返回此对象，
     * 如果是IE则搜索Msxml2.XMLHTTP各个版本及Microsoft.XMLHTTP并创建对象返回。
     * @return {XMLHttpRequest}
     *              XML回调对象
     */
    getXmlHttpRequest : function () {
        if (window.XMLHttpRequest) {
            return new XMLHttpRequest();
        } else {
            if (window.Ajax_XMLHttpRequestProgID) {
                return new ActiveXObject(window.Ajax_XMLHttpRequestProgID);
            } else {
                var proIDs = ["Msxml2.XMLHTTP.5.0", "Msxml2.XMLHTTP.4.0", "MSXML2.XMLHTTP.3.0", "MSXML2.XMLHTTP", "Microsoft.XMLHTTP"];
                for (var i = 0; i < proIDs.length; ++i) {
                    var proID = proIDs[i];
                    try {
                        var x = new ActiveXObject(proID);
                        window.Ajax_XMLHttpRequestProgID = proID;
                        return x;
                    } catch (e) {

                    }
                }
            }
        }
        return null;
    },

    /**
     * 同步请求
     * @param url
     * @return {*}
     */
    syncRequest : function (url) {
        if (!url)
            return;

        //xml请求对象
        var oXmlHttp = this.getXmlHttpRequest();

        oXmlHttp.onreadystatechange = function () {
            if (oXmlHttp.readyState == 4) {
                if (oXmlHttp.status == 200 || oXmlHttp.status == 304) {
                } else {
                    alert('XML request error: ' + oXmlHttp.statusText + ' (' + oXmlHttp.status + ')');
                }
            }
        }
        oXmlHttp.open('GET', url, false);
        oXmlHttp.send(null);

        return oXmlHttp.responseText;
    },
    /**
     * 异步请求
     * @param url
     * @return {*}
     */
    asyncRequest : function (url) {
        if (!url)
            return;

        //xml请求对象
        var oXmlHttp = this.getXmlHttpRequest();

        oXmlHttp.onreadystatechange = function () {
            if (oXmlHttp.readyState == 4) {
                if (oXmlHttp.status == 200 || oXmlHttp.status == 304) {
                } else {
                    alert('XML request error: ' + oXmlHttp.statusText + ' (' + oXmlHttp.status + ')');
                }
            }
        };
        oXmlHttp.open('GET', url, true);
        oXmlHttp.send(null);

        return oXmlHttp.responseText;
    }
}