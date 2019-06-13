/**
 *Created by 夜雪暮歌 on 2019/6/13
 **/
exports.notEmpty = name => {
  return v => {
    if (!v || v.trim === '') {
      return `${name} is required`
    } else {
      return true
    }
  }
}
