/**
 *Created by 夜雪暮歌 on 2019/6/18
 **/
// ==UserScript==
// @name         Login-test
// @version      0.1.1
// @description  A demo to use tampermonkey
// @author       yxmg
// @include      *cdn.90so.net*
// @exclude      *api.github*
// @require      https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js
// @require      https://cdn.90so.net/layui/2.5.4/layui.all.js
// @resource     layuiStyle https://cdn.90so.net/layui/2.5.4/css/layui.css
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_setClipboard
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @run-at       document-body
// @noframes
// ==/UserScript==
const CONST = {}
const isNewGM = typeof (GM_info.scriptHandler) != "undefined" && GM_info.scriptHandler.toLowerCase() == "greasemonkey"
const isLocalDebug = false

function addStyle(css) { //添加CSS的代码--copy的
  const pi = document.createProcessingInstruction(
    'xml-stylesheet',
    'type="text/css" must="false" href="data:text/css;utf-8,' + encodeURIComponent(css) + '"'
  );
  return document.insertBefore(pi, document.documentElement);
}

function checkDocmentHasNode(nodeClass) {
  for (var i = 0; i < document.childNodes.length; i++) {
    if (document.childNodes[i].data && document.childNodes[i].data.indexOf(nodeClass) > 0)
      return true;
  }
  return false;
}

CONST.StyleManger = {
  /**
   * 导入css内容为【文本格式】！！！
   * @param data css内容
   * @param toClassName 预期的类名
   */
  importStyle: function (data, toClassName, useNormalCSS, mustLoad) {
    useNormalCSS = useNormalCSS || false;
    mustLoad = mustLoad || false;
    // 普通浏览器模式--但是似乎样式加载的优先级低于head中的style优先级
    if (navigator.userAgent.toLowerCase().indexOf("edge") < 0 && !useNormalCSS) {
      // data = data.replace(/baidu.com#\$#/igm, '');
      if (data.indexOf("http") !== 0) data = "data:text/css;utf-8," + encodeURIComponent(data);
      if (!checkDocmentHasNode(toClassName)) {
        const pi = document.createProcessingInstruction(
          "xml-stylesheet",
          `type="text/css" must="${mustLoad}" class="${toClassName}" href="${data}"`
        ); // 注意必须要双引号
        document.insertBefore(pi, document.documentElement);
      }
    }
  },
  loadStyle: function (styleName, insClassName, setUrl, useNormalCSS, mustLoad) {
    // 全部采用text/css的内容来载入
    // 如果是debug模式。或者是gm模式
    if (isLocalDebug) {
      // debug("本地-加载样式：" + insClassName);
      setUrl = setUrl || "http://127.0.0.1/" + styleName + ".css";
      this.importStyle(setUrl, insClassName, useNormalCSS, mustLoad);
    } else if (isNewGM === true) {
      // 仅用于GreaseMonkey4.0+
      // debug("特殊模式-加载样式：" + insClassName);
      setUrl = setUrl || "https://baidu.ntaow.com/baiducss/" + styleName + ".css";
      this.importStyle(setUrl, insClassName, useNormalCSS, mustLoad);
    } else {
      // debug("加载样式：" + insClassName);
      // TamperMonkey + GreaseMonkey < 4.0 + ViolentMonkey (4.0GreaseMonkey不支持GetResource方法)
      this.importStyle(GM_getResourceText(styleName), insClassName, useNormalCSS, mustLoad);
    }
  },
}

CONST.StyleManger.loadStyle('layuiStyle', 'layuiStyle')

const div = document.createElement('div')
div.innerHTML = `<button type="button" class="fixed-right-bottom layui-btn layui-btn-sm layui-btn-primary">
  <i class="layui-icon">&#x1002;</i>
</button>`
document.body.appendChild(div)
GM_addStyle(`
.fixed-right-bottom{
  position: fixed;
  bottom: 100px;
  right: 100px;
  z-index: 999;
}
`)
$(function () {
  const layer = layui.layer
  console.log(layer, "layer")
  layer.msg('Hello World');
})
