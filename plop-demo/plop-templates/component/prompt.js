/**
 *Created by 夜雪暮歌 on 2019/6/13
 **/

module.exports = {
    description: '创建Vue组件',
    prompts: [
        {
            type: 'input',
            name: 'fileName',
            message: '请输入文件名：'
        },
        {
            type: 'checkbox',
            name: 'blocks',
            message: '请取消勾选不需要的模块（默认全选）',
            choices: [
                {
                    name: '<template>',
                    value: 'template',
                    checked: true
                },
                {
                    name: '<script>',
                    value: 'script',
                    checked: true
                },
                {
                    name: 'style',
                    value: 'style',
                    checked: true
                }
            ],
            validate(value) {
                if (
                    value.indexOf('script') === -1 &&
                    value.indexOf('template') === -1
                ) {
                    return 'Components require at least a <script> or <template> tag.';
                }
                return true;
            }
        },
        {
            type: 'checkbox',
            name: 'isGlobal',
            message: '请选择组件作用域',
            choices: [
                {
                    name: 'global',
                    value: '全局',
                    checked: true
                },
                {
                    name: 'local',
                    value: '局部',
                    checked: true
                },
            ],
            default: false
        }
    ],
    actions: [
        {
            type: 'add',
            path: 'test/{{fileName}}.vue',
            templateFile: './plop-templates/component/index.hbs',
        }
    ]
}
