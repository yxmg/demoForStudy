/**
 *Created by 夜雪暮歌 on 2019/6/11
 **/
module.exports = function (plop) {
  plop.setGenerator('basic', {
    description: 'this is a skeleton plopfile',
    prompts: [{
      type: 'input',
      name: 'filename',
      message: '请输入要创建的文件名：'
    }],
    actions: [{
      type: 'add',
      path: 'test/{{filename}}.js',
      templateFile: '',
    }]
  })
}
