<template>
  <div>
    <!-- 使用子组件并向插槽传递内容 -->
    <ChildComponent>
      <div class="container">
        <p>这是插槽内.container 里的内容</p>
      </div>
      <p>这是插槽内普通的内容</p>
    </ChildComponent>
  </div>
</template>

<script>
import ChildComponent from './ChildComponent.vue'

export default {
  components: {
    ChildComponent
  }
}
</script>
