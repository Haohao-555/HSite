<template>
  <div class="authRange">
    <span>
      账号：<el-tag :type="auth.account ? 'info' : 'danger'"> {{ auth.account ? '可看' : '不可看' }}</el-tag>
    </span>
    <span>
      游客: <el-tag :type="auth.tourist ? 'info' : 'danger'"> {{ auth.tourist ? '可看' : '不可看' }}</el-tag>
    </span>
    <span v-if="!auth.site">范围：<el-tag type="info">{{ auth.site ? '二十一' : '四跃初酒' }}</el-tag></span>
  </div>
</template>
<script setup>
import { defineProps, watch, ref } from 'vue'
import { getNotesauth } from '@/utils/notes'

const props = defineProps({
  row: {
    type: Object,
    default: () => ({})
  }
})

const auth = ref({})
watch(() => props.row, (row) => {
  auth.value = getNotesauth(row)
}, { immediate: true })
</script>
<style lang="scss" scoped>
.authRange {
  display: flex;
  gap: 6px;
}
</style>
