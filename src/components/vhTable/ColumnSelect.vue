<template>
  <el-dropdown :hide-on-click="false" @command="handleselectColumn">
    <el-icon class="el-icon--right" size="20">
      <Menu />
    </el-icon>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item :command="item.prop" v-for="(item, i) in props.columnList" :key="i">
          <span style="padding-right: 20px">{{ renderLabel(item) }}</span>
          <el-icon v-if="props.showProp.includes(item.prop)">
            <Check />
          </el-icon>
          <span v-else style="width: 14px; height: 14px"></span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>
<script setup>
import { defineEmits, defineProps, watch, ref } from 'vue'
const props = defineProps({
  showProp: {
    type: Array,
    default: () => []
  },
  columnList: {
    type: Array,
    default: () => []
  }
})
const emits = defineEmits(['columnChange'])

const columnMap = ref({})
watch(
  () => props.columnList,
  () => {
    columnMap.value = props.columnList.reduce((acc, cur) => {
      acc[cur.prop] = {
        ...cur
      }
      return acc
    }, {})
  },
  { immediate: true }
)

const handleselectColumn = (prop) => {
  const list = props.showProp
  if (!list.includes(prop)) {
    list.push(prop)
  } else {
    const i = list.findIndex((item) => item === prop)
    list.splice(i, 1)
  }

  let propList = []
  Object.keys(columnMap.value).forEach((key) => {
    if (list.includes(key)) {
      propList.push(key)
    }
  })

  propList = [...new Set([...props.showProp, ...propList])]
  emits('columnChange', propList)
}

const renderLabel = (column) => {
  if (typeof column.label === 'function') {
    const component = column.label(column)
    return typeof component === 'string' ? component : ''
  }

  return column.label
}
</script>
<style lang="scss" scoped>
::v-deep .el-dropdown-menu__item {
  justify-content: space-between;
}
</style>
