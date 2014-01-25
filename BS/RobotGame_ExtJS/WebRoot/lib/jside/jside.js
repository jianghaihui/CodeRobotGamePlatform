/******************************************************************************
* Author and Publisher: Tom Olson
* Last Modified: 03/14/2013
*******************************************************************************
* Copyright © 2012-2013 Tom Olson
* Available under MIT License
* MIT License: http://opensource.org/licenses/MIT
*******************************************************************************
* Permission is hereby granted, free of charge, to any person obtaining a copy
* of this software and associated documentation files (the "Software"), to
* deal in the Software without restriction, including without limiation the
* rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
* sell copies of the Software, and to permit persons to whom the Software is
* furnished to do so, subject to the following conditions:
*******************************************************************************
* The above copyright notice and this permission notice shall be included in
* all copies or substantial portions of the Software.
*******************************************************************************
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTIBILITY,
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
* FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
* IN THE SOFTWARE.
******************************************************************************/

var jside = function()
{
    var editor;     //Variable used to initialize Ace Text Editor

    function changefontsize()
    {
        var value = $(this).val();

        $("#editor").css("font-size",value);      //Change font size
    }

    function changetabsize()
    {
        var value = $(this).val();

        if(value === "tab")
        {
            editor.getSession().setUseSoftTabs(false);
        }
        else
        {
            editor.getSession().setUseSoftTabs(true);

            editor.getSession().setTabSize(Number(value));      //Change tab size
        }
    }

    function changelanguage()
    {
        var value = $(this).val();

        editor.getSession().setMode("ace/mode/" + value);      //Change text highlighting language
    }

    function changetheme()
    {
        var value = $(this).val();

        editor.setTheme("ace/theme/" + value);       //Change text editor CSS theme
    }

    //Document.ready function
    $(function()
    {
        editor = ace.edit("editor");        //Initialize Ace Text Editor
        editor.setTheme("ace/theme/monokai");       //Default text editor CSS theme
        editor.getSession().setMode("ace/mode/c_cpp");      //Default text highlighting language
        $("#editor").css("font-size", "12px");      //Default font size
        editor.getSession().setTabSize(4);      //Default tab size

        //Small changes to how ace text editor will function by default
        editor.setAnimatedScroll(true);
        editor.setDisplayIndentGuides(true);
        editor.setHighlightActiveLine(true);
        editor.setHighlightSelectedWord(true);
        editor.setShowPrintMargin(false);
        editor.getSession().setUseSoftTabs(true);

        //Events triggered when dropdown menus change
        $("#fontsize").on("change",changefontsize);     //Change font size
        $("#tabsize").on("change",changetabsize);     //Change tab size
        $("#language").on("change",changelanguage);     //Change text highlighting language
        $("#theme").on("change",changetheme);       //Change text editor theme
    });
}();
