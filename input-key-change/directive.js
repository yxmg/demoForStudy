/*
 * @Description: fuck directive
 * @Author: 管铭钊
 * @Date: 2021/1/16
 */
(function () {
  // region 标记收集Input
  const markInput = (el) => {
    const markInputs = [[]]
    let rowIndex = 0, colIndex = 0
    el.querySelectorAll('input').forEach((input, inputIndex, inputs) => {
      if (isNewRow(input, inputs[inputIndex - 1])) {
        colIndex = 0
        rowIndex++
        markInputs.push([])
      } else {
        inputs[inputIndex - 1] && colIndex++
      }
      markInputs[rowIndex].push(input)
      input.dataset.index = `${rowIndex}-${colIndex}`
    })
    return markInputs
  }
  const isNewRow = (el, prevEl) => {
    if (!prevEl) {
      return false
    }
    const { top } = el.getBoundingClientRect()
    const { top: prevTop, height: prevHeight } = prevEl.getBoundingClientRect()
    return top - prevTop > prevHeight
  }
  // endregion

  // region 监听工具
  const keyCodeMap = {
    up: 38,
    down: 40,
    left: 37,
    right: 39
  }
  const onKeydown = (event, binding) => {
    const { keyCode } = event
    const { markInputs } = binding
    const activeElement = document.activeElement
    if (!isInput(activeElement) || keyCode in keyCodeMap) {
      return
    }
    let [rowIndex, colIndex] = activeElement.dataset.index.split('-').map(Number)

    switch (keyCode) {
      case keyCodeMap.up:
        if (rowIndex <= 0) {
          rowIndex = markInputs.length - 1
        } else {
          rowIndex--
        }
        break
      case keyCodeMap.down:
        if (rowIndex >= markInputs.length - 1) {
          rowIndex = 0
        } else {
          rowIndex++
        }
        break
      case keyCodeMap.left:
        if (colIndex <= 0 && rowIndex > 0) {
          colIndex = markInputs[rowIndex - 1].length - 1
          rowIndex--
        } else {
          colIndex--
        }
        break
      case keyCodeMap.right:
        if (colIndex >= markInputs[rowIndex].length - 1 && rowIndex < markInputs.length - 1) {
          rowIndex++
          colIndex = 0
        } else {
          colIndex++
        }
        break
    }
    const targetEl = markInputs[rowIndex][colIndex]
    targetEl && targetEl.focus()
  }
  const isInput = (el) => el && el.tagName.toLowerCase() === 'input'
  const toggleEventBind = (flag = true, el, binding) => {
    flag
      ? el.addEventListener('keydown', binding.onKeydown)
      : el.removeEventListener('keydown', binding.onKeydown)
  }
  // endregion

  Vue.directive('cursor-control', {
    inserted(el, binding) {
      Vue.nextTick(() => {
        binding.markInputs = markInput(el)
        binding.onKeydown = (event) => {
          onKeydown(event, binding)
        }
        toggleEventBind(true, el, binding)
      })
    },
    unbind(el, binding) {
      toggleEventBind(false, binding)
    }
  })
}())

