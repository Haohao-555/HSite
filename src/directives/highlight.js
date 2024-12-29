import hljs from 'highlight.js'
function highlight(el) {
  const blocks = el.querySelectorAll('pre code')
  blocks.forEach((block) => {
    hljs.highlightAll(block)
  })
}

// 视情况修改
export default {
  // 在绑定元素的父组件被挂载后调用
  mounted (el, binding) {
    highlight(el, binding)
  },
  // 在包含组件的 VNode 及其子组件的 VNode 更新后调用
  update (el, binding) {
    highlight(el, binding)
  }
}
