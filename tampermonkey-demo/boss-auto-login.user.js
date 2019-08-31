// ==UserScript==
// @name         boss自动登录
// @version      0.1.1
// @description  boss系统自动登录，需要二次验证密钥
// @author       yxmg
// @match        *://localhost:8000/*
// @match        *://*.x-vipay.com/boss/*
// @match        *://uat2.vipaylife.com/boss2/*
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
(function () {
    // @require      https://cdn.bootcss.com/limonte-sweetalert2/7.28.5/sweetalert2.all.js
    /********************************** 脚本匹配-开始 **********************************/
    const isLocalHost = location.hostname === 'localhost'
    const isOtherPort = location.port !== '8000'
    if (isLocalHost && isOtherPort) {
        return
    }
    /********************************** 脚本匹配-开始 **********************************/

    /********************************** CSS相关-开始 **********************************/
    /**
     * 导入外部css
     */
    var contextMenuCss = GM_getResourceText("contextMenuCss");
    var fontAwesomeIconCss = GM_getResourceText("fontAwesomeIconCss");
    GM_addStyle(contextMenuCss);
    GM_addStyle(fontAwesomeIconCss);

    /* 表格CSS */
    GM_addStyle('table.my_baidu_link_table {margin: 0 auto;}');
    GM_addStyle('.my_baidu_link_table>tbody>tr>td, .my_baidu_link_table>tbody>tr>th, .my_baidu_link_table>tfoot>tr>td, .my_baidu_link_table>tfoot>tr>th, .my_baidu_link_table>thead>tr>td, .my_baidu_link_table>thead>tr>th {padding: 10px;min-width: 150px;line-height: 1.42857143;vertical-align: top;border: 1px solid #ddd;text-align:center;color:#3F51B5 !important}');
    GM_addStyle('.my_baidu_link_table>tbody>tr>td>a, .my_baidu_link_table>tbody>tr>th>a, .my_baidu_link_table>tfoot>tr>td>a, .my_baidu_link_table>tfoot>tr>th>a, .my_baidu_link_table>thead>tr>td>a, .my_baidu_link_table>thead>tr>th>a {color: #00bfff/* !important */;/* text-decoration: none !important; */}');

    /**
     * 自定义样式
     */
    // swal默认样式调整
    GM_addStyle('body.swal2-height-auto{ height: inherit !important } .swal2-popup{width: auto;min-width: 32em;}')
    // contextMenu样式调整
    GM_addStyle('.context-menu-icon{font-size: 16px} .context-menu-icon::before{ font-family: "Ionicons" }')
    // 自定义样式
    GM_addStyle(`.al-main-btn{ position: fixed; width: 40px; height: 40px; right: 0; z-index: 999; background: #fff; border-radius: 50%; border: 1px solid; left: calc(50% + 220px); top: calc(50% - 175px); box-shadow: 0 2px 11px 0 rgba(0,0,0,.16); } .al-pre{ color: #abb2bf; background: #282c34; border-radius: 4px; padding: 8px; margin-top: 4px; margin-bottom: 0; } .al__logo{ width: 36px; height: 36px; } .al-icon-selected.active{ color: #87d068 !important; }
    .al-main-btn.after-login{
        top: 60px;
        right: 10px;
        left: auto; 
    }
    `)
    /********************************** CSS相关-结束 **********************************/

    /**
     * 常量部分
     */
    let APP_INSTANCE = null
    const LOCALSTORAGE_NAME = 'AL-CONF'
    const LOCALSTORAGE_IS_AUTO_LOGIN = 'IS-AUTO-LOGIN'


    /**
     * 用装饰器模式对原生replaceState和pushState做处理
     */
    var _wr = function (type) {
        var orig = history[type];
        return function () {
            var rv = orig.apply(this, arguments);
            var e = new Event(type);
            e.arguments = arguments;
            window.dispatchEvent(e);
            return rv;
        };
    };
    history.pushState = _wr('pushState');
    history.replaceState = _wr('replaceState');

    /********************************** 工具函数-开始 **********************************/
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

    function wait(second) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve()
            }, second * 1000)
        })
    }

    function updateValue(el, value) {
        el.value = value
        // change事件 new UIEvent('change')
        el.dispatchEvent(new InputEvent('input'))
    }

    function waitForElement(selector) {
        return new Promise((resolve) => {
            const timer = setInterval(() => {
                const element = $(selector)[0]
                if (element) {
                    clearInterval(timer)
                    resolve(element)
                }
            }, 500)
        })
    }

    /********************************** 工具函数-结束 **********************************/

    /********************************** 主流程-开始 **********************************/

    /********************************** 操作页面-开始 **********************************/
    function addMainBtn() {
        const btnHtml = `<span>
<a id="mainBtn" class="al-main-btn" href="javascript:void(0);">
    <img class="al__logo" src="https://www.easyicon.net/api/resizeApi.php?id=1210135&size=72">
</a>
</span>`

        const app = $('#app')
        app.prepend(btnHtml)
    }

    function refreshMenu() {
        // 刷新右键菜单
        $.contextMenu('destroy')
        initMenu()
    }

    async function initMenu() {
        let accountList = await localforage.getItem(LOCALSTORAGE_NAME)
        const selector = $('.al-main-btn')

        if (!accountList) {
            await localforage.setItem(LOCALSTORAGE_NAME, [])
        }
        accountList = accountList || []

        const activeAccount = accountList.find(item => item.isActive)
        const isAutoLogin = await localforage.getItem(LOCALSTORAGE_IS_AUTO_LOGIN)
        selector.data('hasActiveAccount', Boolean(activeAccount))
        selector.data('isAutoLogin', isAutoLogin)

        const currentAccountItem = {
            name: `当前账户: ${activeAccount && activeAccount.username}`,
            icon: function () {
                return 'context-menu-icon ivu-icon-md-key'
            },
            callback: function () {
                login()
            },
            disabled(key, opt) {
                return !this.data('hasActiveAccount') || this.data('afterLogin')
            }
        }
        const viewAccountItem = {
            name: '查看账户',
            isHtmlName: true,
            icon: function () {
                return 'context-menu-icon ivu-icon-md-person'
            },
            callback: function () {
                configAccount()
            }
        }
        const addAccountItem = {
            name: '添加账户',
            isHtmlName: true,
            icon: function () {
                return 'context-menu-icon ivu-icon-md-add'
            },
            callback: function () {
                addAccount()
            }
        }
        const openItem = {
            name: '自动登录',
            icon: function () {
                return 'context-menu-icon ivu-icon-md-aperture'
            },
            callback() {
                localforage.setItem(LOCALSTORAGE_IS_AUTO_LOGIN, true)
                notify('success', '已开启自动登录')
                this.data('isAutoLogin', true);
            },
            disabled(key, opt) {
                return this.data('isAutoLogin')
            }
        }
        const closeItem = {
            name: '关闭自动登录',
            icon: function () {
                return 'context-menu-icon ivu-icon-md-close'
            },
            callback() {
                localforage.setItem(LOCALSTORAGE_IS_AUTO_LOGIN, false)
                notify('success', '已关闭自动登录')
                this.data('isAutoLogin', false);
            },
            disabled(key, opt) {
                return !this.data('isAutoLogin')
            }
        }

        $.contextMenu({
            selector: '.al-main-btn',
            trigger: 'left',
            items: {
                currentAccountItem,
                viewAccountItem,
                addAccountItem,
                openItem,
                closeItem
            }
        });
    }

    function afterLogin(route) {
        const $MainBtnEl = $('.al-main-btn')
        if (route.path === '/login') {
            $MainBtnEl.removeClass('after-login')
            $MainBtnEl.data('afterLogin', false)
        } else {
            $MainBtnEl.addClass('after-login')
            $MainBtnEl.data('afterLogin', true)
        }
    }

    /********************************** 操作页面-结束 **********************************/

    /********************************** 账户管理-开始 **********************************/
    async function addAccount() {
        const { value: formValues } = await Swal.mixin({
            input: 'text',
            confirmButtonText: 'Next &rarr;',
            showCancelButton: true,
            progressSteps: ['1', '2', '3']
        })
            .queue([
                {
                    title: '请输入要自动登录的账户名',
                },
                {
                    title: '请输入密码',
                    text: '如果忘记密码，可以用其他账户在【操作员管理】进行重置密码操作'
                },
                {
                    title: '请输入密钥',
                    html: 'PAY_BOSS 密钥查询SQL:<pre class="al-pre">SELECT SECRET_KEY FROM BOSS_OPERATOR WHERE LOGIN_NAME = \'用户名\'</pre>'
                },
            ])

        if (formValues) {
            const [username, password, secretKey] = formValues
            let accountList = await localforage.getItem(LOCALSTORAGE_NAME)
            accountList = Array.isArray(accountList) ? accountList : []
            accountList.forEach(item => {
                item.isActive = false
            })
            accountList.push({ username, password, secretKey, isActive: true })
            await localforage.setItem(LOCALSTORAGE_NAME, accountList)
            refreshMenu()
        }
    }

    async function configAccount() {
        const accountList = await localforage.getItem(LOCALSTORAGE_NAME)
        let bodyRowHTML = ''
        const emptyHTML = `<div class="table--empty">暂无数据</div>`
        accountList.forEach((item, index) => {
            bodyRowHTML += `
            <tr>
                <td>${index + 1}</td>
                <td>${item.username}</td>
                <td>${item.password}</td>
                <td>${item.secretKey}</td>
                <td>
                    <a class="al-icon-selected ${item.isActive ? 'active' : ''}" 
                        href="javascript:void(0);" onclick="_selectAccount(this,${index})">
                        <i class="ivu-icon ivu-icon-md-checkmark-circle-outline"></i>
                    </a>
                    <a href="javascript:void(0);" onclick="_deleteAccount(this,${index})">
                        <i class="ivu-icon ivu-icon-md-trash"></i>
                    </a>
                </td>
            </tr>`
        })


        const tableHTML = `
        <table class="my_baidu_link_table">
            <thead>
                <tr>
                    <th><i class="ivu-icon ivu-icon-md-at"></i></th>
                    <th><b>账户名</b></th>
                    <th><b>密码</b></th>
                    <th><b>密钥</b></th>
                    <th><b>操作</b></th>
                </tr>
            </thead>
            <tbody>
                ${bodyRowHTML}
            </tbody>
        </table>
        `
        Swal.fire({
            title: '账户列表',
            html: accountList.length ? tableHTML : emptyHTML,
        })
    }

    async function deleteAccount(element, index) {
        let accountList = await localforage.getItem(LOCALSTORAGE_NAME)
        const currentRow = element.parentElement.parentElement
        currentRow.remove()
        accountList.splice(index, 1)
        await localforage.setItem(LOCALSTORAGE_NAME, accountList)
        refreshMenu()
    }

    async function selectAccount(element, index) {
        let accountList = await localforage.getItem(LOCALSTORAGE_NAME)
        accountList.forEach(item => {
            item.isActive = false
        })
        accountList[index].isActive = true
        await localforage.setItem(LOCALSTORAGE_NAME, accountList)
        $('.al-icon-selected.active').removeClass('active')
        $(element).addClass('active')
        refreshMenu()
    }

    /********************************** 账户管理-结束 **********************************/

    /**
     * 初始化，注册函数，等待vue加载完毕
     * @returns {Promise}
     */
    function init() {
        unsafeWindow._deleteAccount = deleteAccount
        unsafeWindow._selectAccount = selectAccount
        return new Promise((resolve) => {
            const timer = setInterval(() => {
                APP_INSTANCE = document.querySelector('#app').__vue__
                if (APP_INSTANCE) {
                    clearInterval(timer)
                    resolve(APP_INSTANCE)
                }
            }, 500)
        })
    }

    function watchRoute(router, fn) {
        router.beforeEach(fn)
    }

    /********************************** 登录操作-开始 **********************************/
    async function firstLogin(account) {
        let { username, password } = account
        const usernameInputEl = await waitForElement('.ivu-form-item:nth-of-type(1) input')
        const passwordInputEl = await waitForElement('.ivu-form-item:nth-of-type(2) input')

        updateValue(usernameInputEl, username)
        updateValue(passwordInputEl, password)

        const btnEl = $('.spec')
        btnEl.click()
    }

    function generateAuthCode(secretKey) {
        let ctime = Math.floor((new Date() - 0) / 30000);
        return HOTP(secretKey, ctime);
    }

    async function secondaryValidate(secretKey) {
        const authCodeInputEl = await waitForElement('.card_google input')
        updateValue(authCodeInputEl, generateAuthCode(secretKey))
        const submitBtnEl = $('.card_google .ivu-btn:nth-of-type(2)')
        submitBtnEl.click()
    }

    async function login() {
        // 仅在登录页生效
        if (location.hash === '#/login' || location.pathname === '/login') {
            const accountList = await localforage.getItem(LOCALSTORAGE_NAME)
            const activeAccount = accountList.find(item => item.isActive)
            const { username, password, secretKey } = activeAccount
            firstLogin({ username, password })
            secondaryValidate(secretKey)
        }
    }

    /********************************** 登录操作-结束 **********************************/

    async function autoLogin() {
        const isAutoLogin = await localforage.getItem(LOCALSTORAGE_IS_AUTO_LOGIN)
        if (!isAutoLogin) {
            return
        }
        // 监听事件
        window.addEventListener('replaceState', async function (event) {
            const isAutoLogin = await localforage.getItem(LOCALSTORAGE_IS_AUTO_LOGIN)
            isAutoLogin && login()
        });
        window.addEventListener('pushState', async function (event) {
            const isAutoLogin = await localforage.getItem(LOCALSTORAGE_IS_AUTO_LOGIN)
            isAutoLogin && login()
        });
    }

    async function main() {
        const isAutoLogin = await localforage.getItem(LOCALSTORAGE_IS_AUTO_LOGIN)
        await init()
        await wait(0.5)
        addMainBtn()
        initMenu()
        watchRoute(APP_INSTANCE.$router, (to, from, next) => {
            afterLogin(to)
            next()
        })
        afterLogin(APP_INSTANCE.$route)
        isAutoLogin && login()
    }

    main()

    autoLogin()


    /********************************** 主流程-结束 **********************************/


    /********************************** 其他-开始 **********************************/
    /**
     * 控制台调试输出样式
     * @param {String} string [要加样式的内容]
     */
    /**
     * 警告样式
     */
    let Warning = function (string) {
        console.log('%c [!] ' + string, 'color:#FF9800;font-weight:bold;font-size:12px');
    }
    /**
     * 出错样式
     */
    let Error = function (string) {
        console.log('%c [!] ' + string, 'color:#FF5722;font-weight:bold;font-size:12px');
    }
    /**
     * 成功样式
     */
    let Success = function (string) {
        console.log('%c [!] ' + string, 'color:#8BC34A;font-weight:bold;font-size:12px');
    }
    /**
     * 信息样式
     */
    let Info = function (string) {
        console.log('%c [*] ' + string, 'color:#2196F3;font-weight:bold;font-size:12px');
    }

    /**
     * 加密算法部分
     * HTOP接收两个参数 1、私钥 2、刷新周期（一般是30s）
     */
    let sjcl = {
        cipher: {}, hash: {}, keyexchange: {}, mode: {}, misc: {}, codec: {}, exception: {
            corrupt: function (a) {
                this.toString = function () {
                    return "CORRUPT: " + this.message
                };
                this.message = a
            }, invalid: function (a) {
                this.toString = function () {
                    return "INVALID: " + this.message
                };
                this.message = a
            }, bug: function (a) {
                this.toString = function () {
                    return "BUG: " + this.message
                };
                this.message = a
            }, notReady: function (a) {
                this.toString = function () {
                    return "NOT READY: " + this.message
                };
                this.message = a
            }
        }
    };
    "undefined" != typeof module && module.exports && (module.exports = sjcl);
    sjcl.bitArray = {
        bitSlice: function (a, b, c) {
            a = sjcl.bitArray.g(a.slice(b / 32), 32 - (b & 31)).slice(1);
            return void 0 === c ? a : sjcl.bitArray.clamp(a, c - b)
        }, extract: function (a, b, c) {
            var d = Math.floor(-b - c & 31);
            return ((b + c - 1 ^ b) & -32 ? a[b / 32 | 0] << 32 - d ^ a[b / 32 + 1 | 0] >>> d : a[b / 32 | 0] >>> d) & (1 << c) - 1
        }, concat: function (a, b) {
            if (0 === a.length || 0 === b.length) return a.concat(b);
            var c = a[a.length - 1], d = sjcl.bitArray.getPartial(c);
            return 32 === d ? a.concat(b) : sjcl.bitArray.g(b, d, c | 0, a.slice(0, a.length - 1))
        }, bitLength: function (a) {
            var b = a.length;
            return 0 ===
            b ? 0 : 32 * (b - 1) + sjcl.bitArray.getPartial(a[b - 1])
        }, clamp: function (a, b) {
            if (32 * a.length < b) return a;
            a = a.slice(0, Math.ceil(b / 32));
            var c = a.length;
            b &= 31;
            0 < c && b && (a[c - 1] = sjcl.bitArray.partial(b, a[c - 1] & 2147483648 >> b - 1, 1));
            return a
        }, partial: function (a, b, c) {
            return 32 === a ? b : (c ? b | 0 : b << 32 - a) + 0x10000000000 * a
        }, getPartial: function (a) {
            return Math.round(a / 0x10000000000) || 32
        }, equal: function (a, b) {
            if (sjcl.bitArray.bitLength(a) !== sjcl.bitArray.bitLength(b)) return !1;
            var c = 0, d;
            for (d = 0; d < a.length; d++) c |= a[d] ^ b[d];
            return 0 ===
                c
        }, g: function (a, b, c, d) {
            var e;
            e = 0;
            for (void 0 === d && (d = []); 32 <= b; b -= 32) d.push(c), c = 0;
            if (0 === b) return d.concat(a);
            for (e = 0; e < a.length; e++) d.push(c | a[e] >>> b), c = a[e] << 32 - b;
            e = a.length ? a[a.length - 1] : 0;
            a = sjcl.bitArray.getPartial(e);
            d.push(sjcl.bitArray.partial(b + a & 31, 32 < b + a ? c : d.pop(), 1));
            return d
        }, j: function (a, b) {
            return [a[0] ^ b[0], a[1] ^ b[1], a[2] ^ b[2], a[3] ^ b[3]]
        }
    };
    sjcl.codec.base32 = {
        e: "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567", fromBits: function (a, b) {
            var c = "", d, e = 0, g = sjcl.codec.base32.e, f = 0, k = sjcl.bitArray.bitLength(a);
            for (d = 0; 5 * c.length < k;) c += g.charAt((f ^ a[d] >>> e) >>> 27), 5 > e ? (f = a[d] << 5 - e, e += 27, d++) : (f <<= 5, e -= 5);
            for (; c.length & 5 && !b;) c += "=";
            return c
        }, toBits: function (a) {
            a = a.replace(/\s|=/g, "").toUpperCase();
            var b = [], c, d = 0, e = sjcl.codec.base32.e, g = 0, f;
            for (c = 0; c < a.length; c++) {
                f = e.indexOf(a.charAt(c));
                if (0 > f) throw new sjcl.exception.invalid("this isn't base32!");
                27 < d ? (d -=
                    27, b.push(g ^ f >>> d), g = f << 32 - d) : (d += 5, g ^= f << 32 - d)
            }
            d & 56 && b.push(sjcl.bitArray.partial(d & 56, g, 1));
            return b
        }
    };
    sjcl.hash.sha1 = function (a) {
        a ? (this.d = a.d.slice(0), this.b = a.b.slice(0), this.a = a.a) : this.reset()
    };
    sjcl.hash.sha1.hash = function (a) {
        return (new sjcl.hash.sha1).update(a).finalize()
    };
    sjcl.hash.sha1.prototype = {
        blockSize: 512,
        reset: function () {
            this.d = this.h.slice(0);
            this.b = [];
            this.a = 0;
            return this
        },
        update: function (a) {
            "string" === typeof a && (a = sjcl.codec.utf8String.toBits(a));
            var b, c = this.b = sjcl.bitArray.concat(this.b, a);
            b = this.a;
            a = this.a = b + sjcl.bitArray.bitLength(a);
            for (b = this.blockSize + b & -this.blockSize; b <= a; b += this.blockSize) n(this, c.splice(0, 16));
            return this
        },
        finalize: function () {
            var a, b = this.b, c = this.d, b = sjcl.bitArray.concat(b, [sjcl.bitArray.partial(1, 1)]);
            for (a = b.length + 2; a & 15; a++) b.push(0);
            b.push(Math.floor(this.a / 0x100000000));
            for (b.push(this.a | 0); b.length;) n(this, b.splice(0, 16));
            this.reset();
            return c
        },
        h: [1732584193, 4023233417, 2562383102, 271733878, 3285377520],
        i: [1518500249, 1859775393, 2400959708, 3395469782]
    };

    function n(a, b) {
        var c, d, e, g, f, k, m, l = b.slice(0), h = a.d;
        e = h[0];
        g = h[1];
        f = h[2];
        k = h[3];
        m = h[4];
        for (c = 0; 79 >= c; c++) 16 <= c && (l[c] = (l[c - 3] ^ l[c - 8] ^ l[c - 14] ^ l[c - 16]) << 1 | (l[c - 3] ^ l[c - 8] ^ l[c - 14] ^ l[c - 16]) >>> 31), d = 19 >= c ? g & f | ~g & k : 39 >= c ? g ^ f ^ k : 59 >= c ? g & f | g & k | f & k : 79 >= c ? g ^ f ^ k : void 0, d = (e << 5 | e >>> 27) + d + m + l[c] + a.i[Math.floor(c / 20)] | 0, m = k, k = f, f = g << 30 | g >>> 2, g = e, e = d;
        h[0] = h[0] + e | 0;
        h[1] = h[1] + g | 0;
        h[2] = h[2] + f | 0;
        h[3] = h[3] + k | 0;
        h[4] = h[4] + m | 0
    }

    sjcl.misc.hmac = function (a, b) {
        this.f = b = b || sjcl.hash.sha256;
        var c = [[], []], d, e = b.prototype.blockSize / 32;
        this.c = [new b, new b];
        a.length > e && (a = b.hash(a));
        for (d = 0; d < e; d++) c[0][d] = a[d] ^ 909522486, c[1][d] = a[d] ^ 1549556828;
        this.c[0].update(c[0]);
        this.c[1].update(c[1])
    };
    sjcl.misc.hmac.prototype.encrypt = sjcl.misc.hmac.prototype.mac = function (a) {
        a = (new this.f(this.c[0])).update(a).finalize();
        return (new this.f(this.c[1])).update(a).finalize()
    };


    function HOTP(K, C) {
        let key = sjcl.codec.base32.toBits(K);

        // Count is 64 bits long.  Note that JavaScript bitwise operations make
        // the MSB effectively 0 in this case.
        let count = [((C & 0xffffffff00000000) >> 32), C & 0xffffffff];
        let otplength = 6;

        let hmacsha1 = new sjcl.misc.hmac(key, sjcl.hash.sha1);
        let code = hmacsha1.encrypt(count);

        let offset = sjcl.bitArray.extract(code, 152, 8) & 0x0f;
        let startBits = offset * 8;
        let endBits = startBits + 4 * 8;
        let slice = sjcl.bitArray.bitSlice(code, startBits, endBits);
        let dbc1 = slice[0];
        let dbc2 = dbc1 & 0x7fffffff;
        let otp = dbc2 % Math.pow(10, otplength);
        let result = otp.toString();
        while (result.length < otplength) {
            result = '0' + result;
        }
        return result
    }

    /********************************** 其他-结束 **********************************/

})()
