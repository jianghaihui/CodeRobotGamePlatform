
module.declare(["extjs-ace/component"], function(require, exports, module)
{
    var COMPONENT = require("extjs-ace/component");

    exports.main = function()
    {
        COMPONENT.init();
        
        var component = COMPONENT.getComponent();

        component.extend = "Ext.panel.Panel";

        Ext.define("Ext.ux.AceEditor", component);
    }
});
