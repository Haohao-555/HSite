<template>
  <el-select :model-value="modelValue" style="width: 200px" placeholder="请选择标题" collapse-tags collapse-tags-tooltip
    @change="handleChange">
    <el-option v-for="item in titleList" :key="item.id" :label="item.content" :value="item.id">
      <div
        style="display: flex; justify-content: space-between; height: 100%; align-items: center; padding-right: 6px;">
        <el-tag :type="item.type">{{ item.content }}</el-tag>
        <el-tag :type="item.private ? 'info' : 'success'">{{ item.private ? '私有' : '公开' }}</el-tag>
      </div>
    </el-option>
  </el-select>
</template>
<script setup>
import { defineProps, defineEmits, onMounted, computed } from 'vue'
import { useStore } from 'vuex'
const emits = defineEmits(['update:modelValue'])
const store = useStore()
defineProps({
  modelValue: {
    type: [Array, String],
    required: true
  }
})

const titleList = computed(() => store.getters.titleList)
const getTitleList = async () => {
  store.dispatch('notes/requestTitleList')
}

const handleChange = (data) => {
  emits('update:modelValue', data)
}

onMounted(() => {
  getTitleList()
})

</script>
