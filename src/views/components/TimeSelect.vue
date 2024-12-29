<template>
  <el-select v-model="timeRangeId" placeholder="请选择时间范围" style="width: 120px; margin-right: 6px;"
    @change="changeTimeRange">
    <el-option v-for="item in pickerOptions" :key="item.value" :label="item.text" :value="item.value" />
  </el-select>
  <el-date-picker @change="changeDate" v-model="timerRange" type="daterange" range-separator="To"
    start-placeholder="起始日期" end-placeholder="结束日期" value-format="YYYY-MM-DD" />
</template>
<script setup>
import { defineProps, defineEmits, ref, watch } from 'vue'
import { getRecentDateRange } from '@/utils/notes'
const emits = defineEmits(['update:modelValue'])
const props = defineProps({
  modelValue: {
    type: Array,
    required: true
  }
})

const timeRangeId = ref('')
const timerRange = ref([])
const pickerOptions = ref([
  { text: '今天', value: 'today' },
  { text: '昨天', value: 'yesterday' },
  { text: '最近一周', value: 'week' },
  { text: '最近一月', value: 'month' },
  { text: '最近一年', value: 'year' }
])

watch(() => props.modelValue, (val) => {
  timerRange.value = val
  if (!val) timeRangeId.value = ''
}, { immediate: true })

const changeTimeRange = (value) => {
  const timeRange = getRecentDateRange(value)
  emits('update:modelValue', [timeRange.startDate, timeRange.endDate])
}

const changeDate = (value) => {
  timeRangeId.value = ''
  emits('update:modelValue', value)
}
</script>
