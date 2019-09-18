// ==UserScript==
// @name         TB快速申请插件
// @version      0.1.1
// @description  尚未完善，风险自担
// @author       yxmg
// @match        *://www.teambition.com/*
// @require      https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js
// @require      https://cdn.jsdelivr.net/npm/sweetalert2@8
// @require      https://cdn.bootcss.com/jquery-cookie/1.4.1/jquery.cookie.min.js
// @require      https://cdn.bootcss.com/jquery-contextmenu/2.8.0/jquery.contextMenu.min.js
// @require      https://cdn.bootcss.com/jquery-contextmenu/2.8.0/jquery.ui.position.min.js
// @require      https://cdn.bootcss.com/localforage/1.7.3/localforage.min.js
// @resource     contextMenuCss https://cdn.bootcss.com/jquery-contextmenu/2.8.0/jquery.contextMenu.min.css
// @resource     fontAwesomeIconCss https://cdn.bootcss.com/font-awesome/5.10.0-11/css/fontawesome.min.css
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_setClipboard
// @grant        unsafeWindow
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant       GM_getResourceText
// @run-at       document-body
// @noframes
// ==/UserScript==
(async function () {
    /********************************** 工具函数-开始 **********************************/
        // ajax请求Promise化
    const jqPromiseAjax = params => {
            return new Promise((resolve, reject) => {
                $.ajax({
                    url: params.url,
                    type: params.type || 'get',
                    dataType: 'json',
                    headers: params.headers || {},
                    data: params.data || {},
                    success(res) {
                        res.message && notify(res.message)
                        resolve(res)
                    },
                    error(err) {
                        err.message && notify(err.message)
                        reject(err)
                    }
                })
            })
        }

    // toast提示
    function notify(type = 'success', content = '操作成功') {
        // warning, error, success, info, and question
        const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000
        });

        Toast.fire({
            type: type,
            title: content
        })
    }

    /********************************** 工具函数-结束 **********************************/

    /********************************** API-开始 **********************************/
    // ajax全局配置
    $.ajaxSetup({
        dataType: "json",
        cache: false,
        xhrFields: {
            withCredentials: true
        },
        complete: function (xhr) {
            // console.log(xhr, "xhr")
        }
    });
    const baseURL = 'https://www.teambition.com'

    const getUserInfo = (data) => {
        return jqPromiseAjax({
            url: baseURL + '/api/users/me',
            type: 'get',
            data
        })
    }
    /********************************** API-结束 **********************************/

    /********************************** 主流程-开始 **********************************/
    const data = await getUserInfo()
    const userInfo = {
        id: data._id,
        avatarUrl: data.avatarUrl,
        name: data.name
    }
    /********************************** 主流程-结束 **********************************/
})()
