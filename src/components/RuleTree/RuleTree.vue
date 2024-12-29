<template>
  <div class="rule-tree" :style="curDepth > 0 ? { paddingLeft: '60px' } : {}">
    <template v-if="formData && !formData.is_leaf && formData.next.length != 0">
      <div class="rule-item-container">
        <div class="relation" v-if="formData.next.length >= 2">
          <el-button type="text" size="small" :class="+formData.relation === 1 ? 'active' : ''"
            @click="changeRelation(1)">且</el-button>
          <el-button type="text" size="small" :class="+formData.relation === 2 ? 'active' : ''"
            @click="changeRelation(2)">或</el-button>
        </div>
        <RuleTree v-for="(cond, i) in formData.next" :formData="cond" :key="i" :index="i" :curDepth="curDepth + 1"
          :branch="curDepth === 0 ? i : branch" :showAddBtn="showAddBtn">
          <template #default="slotProps">
            <slot v-bind="slotProps" />
          </template>
        </RuleTree>
      </div>
    </template>
    <template v-else>
      <RuleItem :config="formData.data" :index="index" :showAddBtn="showAddBtn" :branch="branch" :curDepth="curDepth"
        @addRule="addRule" @delRule="delRule">
        <template #default="slotProps">
          <slot v-bind="slotProps" />
        </template>
      </RuleItem>
    </template>
  </div>
</template>
<script setup>
import { defineProps, inject } from 'vue'
import RuleItem from './RuleItem'
const changeRelationFuncInject = inject('changeRelation')
const addRuleFuncInject = inject('addRule')
const delRuleFuncInject = inject('delRule')
const props = defineProps({
  formData: {
    type: Object,
    default: () => ({})
  },
  curDepth: { // 层级
    type: Number,
    default: 0
  },
  branch: { // 分支
    type: Number,
    default: 0
  },
  index: { // 下标
    type: Number,
    default: 0
  },
  showAddBtn: {
    type: Boolean,
    default: false
  }
})

const changeRelation = (value) => {
  changeRelationFuncInject({
    depth: props.curDepth,
    branch: props.branch,
    value
  })
}

const addRule = () => {
  addRuleFuncInject({
    branch: props.branch,
    depth: props.curDepth - 1,
    index: props.index
  })
}

const delRule = () => {
  delRuleFuncInject({
    branch: props.branch,
    depth: props.curDepth - 1,
    index: props.index
  })
}
</script>
<style lang="scss" scoped>
.rule-tree {
  margin-bottom: 20px;

  .rule-item-container {
    position: relative;

    .relation {
      position: absolute;
      top: 0px;
      bottom: 0px;
      left: 12px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      width: 40px;
      border-right: 1px solid var(--el-color-primary);

      .el-button {
        color: #c0c4cc;

        &.active {
          color: var(--el-color-primary);
        }
      }
    }
  }

  .el-button {
    margin: 0px;
  }
}
</style>
