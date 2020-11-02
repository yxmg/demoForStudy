/**
 *Created by 夜雪暮歌 on 2019/6/11
 **/
const createComponent = require('./plop-templates/component/prompt')

module.exports = function (plop) {
  plop.setGenerator('component', createComponent)
}
