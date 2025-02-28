<template>
  <div>
    <!-- 默认插槽 -->
    <slot></slot>

    <!-- 具名插槽 -->
    <slot name="header"></slot>

    <!-- 作用域插槽 -->
    <slot name="footer" :message="message"></slot>
  </div>
</template>

<script>
import { useSlots, ref } from 'vue'

export default {
  setup() {
    const slots = useSlots()

    // 检查插槽是否存在
    if (slots.header) {
      console.log('header 插槽存在')
    }

    // 访问作用域插槽
    const message = ref('Hello from setup')

    return {
      message
    }
  }
}
</script>
