<template>
  <div class="title-container">
    <div class="title">{{ title }}
      <slot name="nextIcon"></slot>
    </div>
    <slot></slot>
  </div>
</template>
<script setup>
import { defineProps } from 'vue'
defineProps({
  title: {
    type: String,
    default: ''
  }
})
</script>
<style lang="scss" scoped>
.title-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;

  .title {
    display: flex;
    align-items: center;

    &::before {
      content: '';
      width: 4px;
      height: 12px;
      background-color: var(--el-color-primary);
      margin-right: 10px;
    }
  }
}
</style>
