<template>
  <div class="siteColumn">
    <el-tag type="primary">{{ row.site ? '二十一' : '四跃初酒' }}</el-tag>
    <el-icon v-if="edit" @click="changeValue">
      <Switch />
    </el-icon>
  </div>
</template>
<script setup>
import { defineProps, defineEmits } from 'vue'
const emits = defineEmits(['change'])
defineProps({
  row: {
    type: Object,
    default: () => ({})
  },
  edit: {
    type: Boolean,
    default: false
  }
})

const changeValue = () => {
  emits('change')
}
</script>
<style lang="scss">
.siteColumn {
  display: flex;
  align-items: center;
  justify-content: end;
  gap: 10px
}
</style>
