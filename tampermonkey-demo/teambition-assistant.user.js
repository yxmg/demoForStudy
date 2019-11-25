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



    /********************************** CSS相关-开始 **********************************/
    GM_addStyle(`.trigger-btn{ position: fixed; right: 0; top: 50%; transform: translateY(-50%); border-radius: 8px 0 0 8px; width: 50px; height: 50px; background-image: url("https://tcs.teambition.net/thumbnail/111m49f5d454a8c0e22efc2a8d448db612e2/w/220/h/220"); background-size: 100% 100%; cursor: pointer; text-shadow: 0 2px 2px grey; box-shadow: 0 0.2em 0 rgba(12,119,226,0.3), 0 0.2em 0.2em grey;border-color: transparent;border-top: 0;border-right: 0;z-index: 1;outline: 0}`)
    /********************************** CSS相关-结束 **********************************/

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

    /********************************** 数据准备-开始 **********************************/
    const pathname = location.pathname.split('/')[1]

    /********************************** 数据准备-结束 **********************************/

    /********************************** UI绘制-开始 **********************************/
    addTriggerBtn()
    /********************************** UI绘制-结束 **********************************/

    /********************************** 主流程-开始 **********************************/
    const data = await getUserInfo()
    console.log(data, "data")
    const userInfo = {
        id: data._id,
        avatarUrl: data.avatarUrl,
        name: data.name
    }

    function addTriggerBtn() {
        const container = $('#teambition-web-content')
        console.log(container, "container")
        const btn = $('<button></button>')
        btn.addClass('trigger-btn')
        container.append(btn)
    }
    /********************************** 主流程-结束 **********************************/
})()
