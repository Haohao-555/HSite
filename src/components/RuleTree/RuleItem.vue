<template>
  <el-form size="small" ref="formRef" v-if="show" :model="config">
    <el-form-item prop="content" :rules="rules[config.filter_type]">
      <slot :data="config" :addRule="addRule" :delRule="delRule">
        <div class="rule-item">
          <div class="rule-node">
            <el-select v-model="config.filter_type">
              <el-option v-for="item in map.labelList" :key="item.field" :value="item.field" :label="item.label" />
            </el-select>
            <el-select v-model="config.opr_type">
              <el-option v-for="item in map.operList" :key="item.value" :value="item.value" :label="item.label" />
            </el-select>
            <el-select class="value-select" v-model="config.content" multiple collapse-tags collapse-tags-tooltip
              :max-collapse-tags="2">
              <el-option v-for="(item) in map.dataList[config.filter_type].valueList" :key="item.value"
                :value="item.value" :label="item.label" />
            </el-select>
          </div>
          <div class="oper-btn">
            <el-button size="small" v-if="showAddBtn" @click="addRule" type="primary">添加</el-button>
            <el-button size="small" @click="delRule" type="danger">删除</el-button>
          </div>
        </div>
      </slot>
    </el-form-item>
  </el-form>
</template>
<script setup>
import { defineProps, defineEmits, watch, ref, inject, onMounted, computed } from 'vue'
const emits = defineEmits(['addRule', 'delRule'])
const props = defineProps({
  config: { type: Object, default: () => ({}) },
  index: { type: Number, default: 0 },
  showAddBtn: { type: Boolean, default: false },
  branch: { type: Number, default: 0 },
  curDepth: { type: Number, default: 0 }
})
const collectRuleNodeFuncInject = inject('collectRuleNode')
const rules = inject('rules')
const dataMap = inject('dataMap')
const addRuleByTreeFunc = inject('addRuleByTree')
const formRef = ref(null)
const show = ref(false)

const map = computed(() => {
  const operList = dataMap.operList
  const labelList = dataMap.dataList.map(item => {
    return {
      label: item.label,
      field: item.field
    }
  })

  const dataList = dataMap.dataList.reduce((acc, cur) => {
    acc[cur.field] = cur
    return acc
  }, {})
  return {
    operList,
    labelList,
    dataList
  }
})

watch(() => props.config, (data) => {
  show.value = data.filter_type && data.opr_type && data.content
}, { immediate: true, deep: 2 })

const addRule = () => {
  if (!props.showAddBtn) {
    addRuleByTreeFunc()
  } else {
    emits('addRule')
  }
}
const delRule = () => emits('delRule')

onMounted(() => {
  collectRuleNodeFuncInject(formRef)
})
</script>
<style lang="scss" scoped>
.rule-item {
  display: flex;
  gap: 6px;

  .rule-node {
    .el-select {
      width: 120px;

      &.value-select {
        width: 300px;
      }
    }

    display: flex;
    gap: 6px;
  }
}
</style>
