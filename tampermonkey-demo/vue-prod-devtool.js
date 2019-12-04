// ==UserScript==
// @name         Vue网站开启devtools
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  线上调试Vue用
// @author       You
// @match        http://*/*
// @match        https://*/*
// @grant        none
// ==/UserScript==

(function() {
    // 使用时打开控制台输入openVueDevtools()回车即可
    'use strict';
    function openVueDevtools(){
        const domList = document.querySelector('body').childrenNodes || []
        Array.from(domList).forEach(item => {
            if(item.__vue__){
                window.app = item
            }
        })
        if(app.__vue__){
            app.__vue__.$root.constructor.config.devtools = true
            app.__vue__.$root.constructor.config.debug = true
            app.__vue__.$root.constructor.config.slient = false
            __VUE_DEVTOOLS_GLOBAL_HOOK__.Vue = app.__vue__.constructor
            __VUE_DEVTOOLS_GLOBAL_HOOK__.emit('init',app.__vue__.constructor)
            __VUE_DEVTOOLS_GLOBAL_HOOK__.emit('flush')
        }
    }
    window.openVueDevtools = openVueDevtools
})();