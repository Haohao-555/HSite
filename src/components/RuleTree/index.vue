<template>
  <div class="tree">
    <RuleTree v-if="JSON.stringify(form) !== '{}'" :formData="form" :showAddBtn="showAddBtn">
      <template #default="slotProps">
        <slot v-bind="slotProps" />
      </template>
    </RuleTree>
    <el-button size="small" @click="addRuleByTree" icon="Plus"></el-button>
  </div>
</template>
<script setup>
import { ref, defineProps, defineEmits, defineExpose, provide, watch, computed } from 'vue'
import RuleTree from './RuleTree'
import { cloneDeep } from 'lodash'
const emits = defineEmits(['update:form'])
const props = defineProps({
  form: { type: Object, default: () => ({}) },
  rules: { type: Object, default: () => ({}) },
  addRules: { type: Function, default: () => { } },
  depth: { type: Number, default: 2 },
  dataMap: { type: Array, default: () => ([]) }
})

const showAddBtn = ref(false)
const ruleNodeList = ref([])

const ruleNode = computed(() => {
  const rule = {
    is_leaf: true,
    data: {}
  }
  const { dataList = [], operList = [] } = props.dataMap
  const { valueList = [] } = dataList
  if (dataList.length > 0 && operList.length > 0) {
    rule.data.filter_type = dataList[0].field
    rule.data.opr_type = operList[0].value
    rule.data.content = valueList.map(item => item.value)
  }
  return rule
})

watch(() => props.form, (data) => {
  showAddBtn.value = data.next && data.next.length > 1
}, { immediate: true })

// 往树上添加结点
const addRuleByTree = () => {
  let data = cloneDeep(props.form)
  const isInit = JSON.stringify(data) === '{}'
  let rule = ruleNode.value

  if (typeof props.addRules === 'function') {
    const res = props.addRules()
    if (res) rule = res
  }

  if (isInit) { // 未初始化
    const form = {}
    form.is_leaf = true
    form.data = rule.data
    form.next = []
    data = form
  } else {
    const len = data.next.length
    data.is_leaf = false
    if (len === 0) {
      data.relation = 1
      data.next = [{
        is_leaf: true,
        data: data.data
      }, rule]
      data.data = {}
    } else {
      data.next.push(rule)
    }
  }
  emits('update:form', data)
}

// 添加节点
const addRule = (params) => {
  const { depth, index, branch } = params
  let data = cloneDeep(props.form)
  const isAddLayer = depth === 0
  let customRule = ruleNode.value
  if (typeof props.addRules === 'function') {
    const res = props.addRules()
    if (res) customRule = res
  }

  const addRuleNode = (obj, depth, i, branch) => {
    if (depth === 0) {
      // 到达对应层级
      if (isAddLayer) {
        const clickRule = cloneDeep(obj.next[i].data)

        obj.next[i].relation = 1
        obj.next[i].is_leaf = false
        obj.next[i].next = [{
          is_leaf: true,
          data: {
            ...clickRule
          }
        }, customRule]
      } else {
        i++
        obj.next.splice(i, 0, customRule)
      }
      return
    }

    if (Array.isArray(obj.next)) {
      if (addRuleNode(obj.next[branch], depth - 1, i)) {
        return true
      }
    }
  }
  addRuleNode(data, depth, index, branch)
  data = formatForm(data)
  emits('update:form', data)
}

// 删除节点
const delRule = (params) => {
  const { depth, index, branch } = params
  let data = cloneDeep(props.form)
  const delRuleNode = (obj, depth, i, branch) => {
    // 如果已经到达目标层级
    if (depth === 0) {
      if (Array.isArray(obj.next) && obj.next.length > i) {
        // 删除指定下标的对象
        obj.next.splice(i, 1)
        if (obj.next.length === 1 && obj.next[0].is_leaf) { // 变成叶子结点
          obj.is_leaf = true
          obj.data = obj.next[0].data
          obj.next = []
        }
        return true // 删除成功
      }
      return false // 删除失败
    }

    // 如果还没到达目标层级，继续递归
    if (Array.isArray(obj.next)) {
      if (delRuleNode(obj.next[branch], depth - 1, i)) {
        return true
      }
    }
  }

  data.is_leaf ? data = {} : delRuleNode(data, depth, index, branch)
  data = formatForm(data)
  emits('update:form', data)
}

// 修改关系
const changeRelation = (params) => {
  const { value, depth, branch } = params
  const data = cloneDeep(props.form)
  if (depth === 0) {
    data.relation = value
  } else {
    data.next[branch].relation = value
  }
  emits('update:form', data)
}

// 调整数据结构
const formatForm = (data) => {
  if (!data.is_leaf) {
    if (data.next && data.next.length === 1) {
      data = data.next[0]
      return data
    }
    return data
  }
  return data
}

const collectRuleNode = (ruleNode) => {
  ruleNodeList.value.push(ruleNode)
}

const validate = (callback) => {
  return new Promise((resolve) => {
    Promise.all(ruleNodeList.value.filter((item) => item.value).map(ruleNode => ruleNode.value.validate())).then(res => {
      typeof callback === 'function' ? callback(true) : resolve(true)
    }).catch(() => {
      typeof callback === 'function' ? callback(false) : resolve(false)
    })
  })
}
provide('addRule', addRule)
provide('delRule', delRule)
provide('changeRelation', changeRelation)
provide('collectRuleNode', collectRuleNode)
provide('rules', props.rules)
provide('dataMap', props.dataMap)
provide('addRuleByTree', addRuleByTree)

defineExpose({
  validate
})
</script>
