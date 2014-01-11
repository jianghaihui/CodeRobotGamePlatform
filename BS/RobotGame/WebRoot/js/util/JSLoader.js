/**
 *JS文件载入器
 *  必须显示使用Ajax请求js代码，然后用script.text属性载入js脚本，
 *  无法直接使用 script.src指定脚本url来载入脚本
 * JHS
 */
DCC.util.JSLoader = function () {
    /**
     *已经载入的JS对象名列表
     */
    var JS_Array = new Array();

    /**
     * 将js代码嵌入到页面
     * @param name
     * @param jsText
     */
    var includeJsText = function (name, jsText) {
        //创建JS节点
        var _script = document.createElement("script");
        _script.type = "text/javascript";
        _script.text = jsText;
        $("head")[0].appendChild(_script);

        JS_Array.push(name);
    };

    /**
     * 初始化
     * @param opt
     */
    this.init = function (opt) {

    };

    /**
     * 载入JS文件
     * @param name
     * @param url
     */
    this.loadJS = function (name, url) {
        if (!url)
            return;

        //判断是否已经载入
        if (JS_Array.indexOf(name) != -1) {
            return;
        }

        //将js代码嵌入到页面
        includeJsText(name, CG_Ajax.syncRequest(url));
    };

    /**
     * 将用户的js代码嵌入到页面
     * @param source
     */
    this.includeUserJsText = function (source) {
        //移除用户JS节点
        $("head")[0].removeChild($("#UserJSCode")[0]);

        //添加用户JS节点
        var _script = document.createElement("script");
        _script.type = "text/javascript";
        _script.text = source;
        _script.id = "UserJSCode";
        $("head")[0].appendChild(_script);
    };
}
