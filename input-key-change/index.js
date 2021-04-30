/*
 * @Description: fuck product
 * @Author: 管铭钊
 * @Date: 2021/1/16
 */
const keyCodeMap = {
  up: 38,
  down: 40,
  left: 37,
  right: 39
}
const isInput = (ele) => ele && ele.tagName.toLowerCase() === 'input'

new Vue({
  el: '#app',
  data: {
    table: {
      data: [
        {
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        },
        {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄'
        },
        {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄'
        },
        {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
        }
      ]
    }
  },
  mounted() {
    // this.$nextTick(this.markInput)
    // this.toggleEventBind(true)
    // this.$on('hook:beforeDestroy', () => {
    //   this.toggleEventBind(false)
    // })
  },
  methods: {
    markInput() {
      const tableEl = document.querySelector('.default-table')
      const tableRowEls = tableEl.querySelectorAll('.el-table__row')
      Array.from(tableRowEls).forEach((row, rowIndex) => {
        row.querySelectorAll('input').forEach((input, colIndex) => {
          input.dataset.index = `${rowIndex}-${colIndex}`
        })
      })
    },
    onKeydown(event) {
      const { keyCode } = event
      const activeElement = document.activeElement
      if (!isInput(activeElement)) {
        return
      }
      let [rowIndex, colIndex] = activeElement.dataset.index.split('-')
      switch (keyCode) {
        case keyCodeMap.up:
          rowIndex--
          break
        case keyCodeMap.down:
          rowIndex++
          break
        case keyCodeMap.left:
          colIndex--
          break
        case keyCodeMap.right:
          colIndex++
          break
      }
      const targetEl = document.querySelector(`[data-index*="${rowIndex}-${colIndex}"]`)
      targetEl && targetEl.focus()
    },
    toggleEventBind(flag = true) {
      flag
        ? document.addEventListener('keydown', this.onKeydown)
        : document.removeEventListener('keydown', this.onKeydown)
    }
  }
})
