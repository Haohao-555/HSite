<template>
  <div class="tableHeader">
    <span>{{ typeof column.label === 'function' ? column.label() : column.label }}</span>
    <el-icon @click="changeEdit">
      <Edit />
    </el-icon>
  </div>
</template>
<script setup>
import { defineProps, defineEmits } from 'vue'
const emits = defineEmits(['change'])
defineProps({
  column: {
    type: Object,
    default: () => ({})
  }
})

const changeEdit = () => {
  emits('change')
}
</script>
<style lang="scss" scoped>
.tableHeader {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
