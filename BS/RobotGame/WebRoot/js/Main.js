/**
 * 程序主入口
 * 1、读取json数据
 * 2、初始化各类载入器
 * 3、初始化系统
 */

//网站根路径
var ROOT_PATH = "/";
//默认JS文件编辑器模块ID
var DEFAULT_JS_EDITOR_ID = "js-editor";
//默认JS文件编辑器窗体ID
var DEFAULT_JS_EDITOR_WIN_ID = "js-editor-win";
//默认机器人JS文件编辑器模块ID
var DEFAULT_ROBOT_JS_EDITOR_ID = 'robot-editor';
//默认机器人JS文件编辑器窗体ID
var DEFAULT_ROBOT_JS_EDITOR_WIN_ID = 'robot-editor-win';
//默认机器人ID
var DEFAULT_ROBOT_ID = 'david-robot';
//默认机器人窗体ID
var DEFAULT_ROBOT_WIN_ID = 'david-robot-win';
//模块载入器
var ModuleLoader = null;
//JS文件载入器
var JSLoader = null;
//CSS文件载入器
var CSSLoader = null;
//主系统
var MainOS = null;

/**
 *读取json数据
 * 先使用静态json数据,等java版的后台完成后,所有数据请求将动态请求
 */
{
    /**
     * 判断是否完成全部json数据的载入工作
     * @return {Boolean}
     */
    function isLoaded() {
        return robotCodeJson.getCount() > 0 && gameLauncherJson.getCount() > 0 && moduleJson.getCount() > 0 && shortcutJson.getCount() > 0;
    }

    /**
     * 载入json数据
     * @param json
     *          JsonStore对象
     */
    function load(json) {
        json.load({
            //回调函数,完成json数据载入后判断是否完成所有json数据的载入,如果完成则启动系统
            callback:function () {
                if (isLoaded()) {
                    beginOS();
                }
            }
        });
    }

    //机器人数据(json格式)
    var robotCodeJson = new Ext.data.JsonStore({
        url:ROOT_PATH + 'data/robot_code/david/code.json',
        root:'codes',
        fields:['game_id', 'game_name', 'code_file_path', 'code_file_name', 'code_name']
    });

    //桌面数据(json格式)
    var shortcutJson = new Ext.data.JsonStore({
        url:ROOT_PATH + 'data/main/shortcut.json',
        root:'shortcuts',
        fields:['id', 'name', 'img']
    });

    //开始按钮数据(json格式)
    var gameLauncherJson = new Ext.data.JsonStore({
        url:ROOT_PATH + 'data/main/launcher.json',
        root:'games',
        fields:['id', 'text', 'iconCls']
    });

    //读取模块数据(json格式)
    //先使用静态数据读取全部模块,
    //当用户模块和模块管理系统实现后,此处应该只读取用户使用的模块;其他模块从模块管理系统中添加
    var moduleJson = new Ext.data.JsonStore({
        url:ROOT_PATH + 'data/main/model.json',
        root:'models',
        fields:['id', 'type', 'js_path', 'page_path', 'css_path', 'cls', 'lazy_load']
    });

    load(gameLauncherJson);
    load(moduleJson);
    load(robotCodeJson);
    load(shortcutJson);
}

/**
 * 启动系统
 */
function beginOS() {
    //初始化JS文件载入器
    JSLoader = new DCC.util.JSLoader();
    //初始化CSS文件载入器
    CSSLoader = new DCC.util.CSSLoader();
    //初始化模块载入器
    ModuleLoader = new DCC.util.ModuleLoader();

    //实例化系统对象
    MainOS = new Ext.app.OS({
        init:function () {
            //初始化Ext.QuickTips，以使得tip提示可用
            Ext.QuickTips.init();
        },

        // 配置开始按钮
        getStartConfig:function () {
            return {
                //显示用户名
                title:'Desolate City',
                toolItems:[
                    {   //登入按钮
                        text:'Login',
                        iconCls:'logout',
                        scope:this
                    }
                ]
            };
        }
    });
    //当页面装载完毕后初始化系统
    Ext.onReady(MainOS.initOS, MainOS);
}

