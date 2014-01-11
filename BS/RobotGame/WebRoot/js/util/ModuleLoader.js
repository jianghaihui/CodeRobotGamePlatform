/**
 * 模块载入器
 *
 * JHS
 */
DCC.util.ModuleLoader = function () {
    var modules = new Array();

    //从json数据中读取模块信息
    for (var i = 0; i < moduleJson.getCount(); i++) {
        var moduleJsonItem = moduleJson.getAt(i);

        var module = new Object();
        module.id = moduleJsonItem.get('id');//id
        module.type = moduleJsonItem.get('type');//类型
        module.js_path = moduleJsonItem.get('js_path');//js文件路径
        module.page_path = moduleJsonItem.get('page_path');//说明页面路径
        module.css_path = moduleJsonItem.get('css_path');//css文件路径
        module.cls = moduleJsonItem.get('cls');//类名(全类名)
        module.lazy_load = moduleJsonItem.get('lazy_load');//是否延时载入
        module.loaded = false;//是否已经载入

        //存入模块列表
        modules.push(module);

        //如果不是延迟加载,则马上载入模块相关文件
        if (!module.lazy_load) {
            this.load(module);
        }
    }

    //获取模块
    this.getModule = function (id) {
        for (var i = 0; i < modules.length; i++) {
            var module = modules[i];
            if (module.id == id) {
                this.load(module);
                return module;
            }
        }
    };

    //载入模块
    this.load = function (module) {
        if (!module.loaded) {
            //载入CSS文件
            CSSLoader.loadCSS(module.id, module.css_path);
            //载入JS文件
            JSLoader.loadJS(module.id, module.js_path);

            module.instance = (new Function('return new ' + module.cls + ';'))();
            module.loaded = true;
        }
    }
}
