<template>
  <div class="timeColumn">
    <el-icon>
      <Clock />
    </el-icon>
    <div class="content">
      <span>{{ row[field] }} </span>
      <span v-if="relativeTime">（{{ $filters.relativeTime(row[field]) }}） </span>
    </div>
  </div>
</template>
<script setup>
import { defineProps } from 'vue'
defineProps({
  row: {
    type: Object,
    default: () => ({})
  },
  field: {
    type: String,
    default: 'createdAt'
  },
  relativeTime: {
    type: Boolean,
    defalut: false
  }
})
</script>
<style lang="scss" scoped>
.timeColumn {
  display: flex;
  align-items: center;
  color: var(--el-color-primary);

  .content {
    display: flex;
    align-items: center;
  }
}
</style>
