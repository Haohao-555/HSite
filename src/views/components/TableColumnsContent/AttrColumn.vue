<template>
  <div class="attr-column">
    <el-tag :type="val === publicAtr ? 'success' : 'info'">{{ val === publicAtr ? '公开' : '私有' }}</el-tag>
    <el-switch v-if="edit" style="transform: scale(0.8)" v-model="switchVal" @change=handleAtrChange />
  </div>
</template>
<script setup>
import { defineProps, defineEmits, watch, ref } from 'vue'
const emits = defineEmits(['change'])
const props = defineProps({
  val: {
    type: Boolean,
    default: false
  },
  edit: {
    type: Boolean,
    default: false
  },
  publicAtr: {
    type: Boolean,
    default: true
  }
})

const switchVal = ref(false)
watch(() => props.val, (val) => {
  switchVal.value = val === props.publicAtr
}, { immediate: true })

const handleAtrChange = (state) => {
  emits('change', state)
}
</script>
<style lang="scss" scoped>
.attr-column {
  display: flex;
  align-items: center;
  justify-content: end;
}
</style>
