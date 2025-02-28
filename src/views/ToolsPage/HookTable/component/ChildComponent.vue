<template>
  <div class="child-component">
    <!-- 定义插槽 -->
    <slot></slot>
  </div>
</template>

<style scoped>
.child-component {
  border: 1px solid #ccc;
  padding: 10px;
}

/* 选择插槽内带有.container 类的元素 */
::v-slotted(.container) {
  background-color: lightyellow;
  border: 1px solid #ffcc00;
  padding: 15px;
}
</style>
