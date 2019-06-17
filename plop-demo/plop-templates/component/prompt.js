/**
 *Created by 夜雪暮歌 on 2019/6/13
 **/
module.exports = {
  description: '创建vue文件',
  prompts: [
    {
      type: 'input',
      name: 'fileName',
      message: '请输入文件名：'
    },
    {
      type: 'list',
      name: 'styleType',
      message: '请选择一种CSS预处理器：',
      choices: [
        'scss',
        'stylus'
      ]
    }
  ],
  actions: [
    {
      type: 'add',
      path: 'test/{{fileName}}.vue',
      templateFile: './plop-templates/component/index.hbs'
    }
  ]
}
