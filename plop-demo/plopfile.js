/**
 *Created by 夜雪暮歌 on 2019/6/11
 **/
const createComponent = require('./plop-templates/component/prompt')

module.exports = function (plop) {
  plop.setGenerator('component', createComponent)
}

  [
  {
    name: '1-1',
    level: 1,
    children: [
      {
        name: '2-1',
        level: 2,
        children: [
          { name: '3-1', level: 3, children: null },
          { name: '3-2', level: 3, children: null },
          { name: '3-3', level: 3, children: null }
        ]
      },
      {
        name: '2-2',
        level: 2,
        children: [
          { name: '3-1', level: 3, children: null },
          { name: '3-2', level: 3, children: null },
          { name: '3-3', level: 3, children: null }
        ]
      }
    ]
  }
  ]
