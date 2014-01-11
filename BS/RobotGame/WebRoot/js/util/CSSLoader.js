/**
 * CSS文件载入器
 *  可以直接使用link.href指定url来载入css文件
 * JHS
 */
DCC.util.CSSLoader = function () {
    //已载入的CSS对象列表
    var CSS_Array = new Array();

    this.init = function (opt) {

    };

    /**
     * 载入CSS文件
     * @param name
     * @param url
     */
    this.loadCSS = function (name, url) {
        if (!url)
            return;

        //判断是否已经载入
        if (CSS_Array.indexOf(name) != -1) {
            return;
        }

        //直接使用link.href指定url来载入css文件
        var _css = document.createElement("link");
        _css.type = "text/css";
        _css.rel = "stylesheet";
        _css.href = url;

        CSS_Array.push(name);

        $("head")[0].appendChild(_css);
    };
}