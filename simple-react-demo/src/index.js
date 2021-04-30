/*
 * @Description: 入口JS
 * @Author: 管铭钊
 * @Date: 2021/4/30
 */
console.log(window.React, "window.React")
console.log(window.React.createElement, "window.React.createElement")
console.log(window.ReactDOM, "window.ReactDOM")
console.log(window.ReactDOM.render, "window.ReactDOM.render")

// 创建一个React组件 - 自增器
const h = React.createElement

class IncrementButton extends React.Component {
    constructor(props) {
        super(props)
        this.state = { count: 0 }
    }

    render() {
        if (this.state.count === 3) {
            return h('button', {}, this.state.count + ' max!')
        }
        return h('button',
            {
                onClick: () => {
                    this.setState({ count: this.state.count + 1 })
                }
            },
            this.state.count)
    }
}

// 渲染到页面x
const app = document.querySelector('#app')
ReactDOM.render(h(IncrementButton), app)
