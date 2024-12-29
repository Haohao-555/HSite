<template>
  <div>
    <el-form size="small">
      <el-form-item label="满足条件">
        <RuleTree ref="ruleTreeRef" :rules="rules" v-model:form="formData" :dataMap="dataMap" />
        <!-- <RuleTree ref="ruleTreeRef" :rules="rules" v-model:form="formData" :dataMap="dataMap">
          <template #default="{ data, addRule, delRule }">
            <div>
              数据：{{ JSON.stringify(data) }}
              <el-button type="primary" @click="addRule">增加</el-button>
              <el-button type="danger" @click="delRule">删除</el-button>
            </div>
          </template>
</RuleTree> -->
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="validate">校验</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script setup>
import { reactive, ref } from 'vue'
import RuleTree from '@/components/RuleTree/index'
import { ElMessage } from 'element-plus'

const isNotEmpty = (rule, value, callback) => {
  if (value.length > 0) return callback()
  return callback(new Error('不能为空'))
}

const dataMap = reactive({
  operList: [
    { label: '大于', value: 1 },
    { label: '等于', value: 2 },
    { label: '小于', value: 3 },
    { label: '介于', value: 4 }
  ],
  dataList: [
    {
      label: '操作类型',
      field: 'operType',
      type: 'select',
      valueList: [
        { label: '操作类型-1', value: 1 },
        { label: '操作类型-2', value: 2 },
        { label: '操作类型-3', value: 3 },
        { label: '操作类型-4', value: 4 },
        { label: '操作类型-5', value: 5 }
      ]
    },
    {
      label: '文件类型',
      field: 'fileType',
      type: 'select',
      valueList: [
        { label: '文件类型-1', value: 1 },
        { label: '文件类型-2', value: 2 },
        { label: '文件类型-3', value: 3 },
        { label: '文件类型-4', value: 4 },
        { label: '文件类型-5', value: 5 }
      ]
    },
    {
      label: '磁盘类型',
      field: 'diskType',
      type: 'select',
      valueList: [
        { label: '磁盘类型-1', value: 1 },
        { label: '磁盘类型-2', value: 2 },
        { label: '磁盘类型-3', value: 3 },
        { label: '磁盘类型-4', value: 4 },
        { label: '磁盘类型-5', value: 5 }
      ]
    },
    {
      label: '用户行为',
      field: 'userBehavior',
      type: 'select',
      valueList: [
        { label: '用户行为-1', value: 1 },
        { label: '用户行为-2', value: 2 },
        { label: '用户行为-3', value: 3 },
        { label: '用户行为-4', value: 4 },
        { label: '用户行为-5', value: 5 }
      ]
    },
    {
      label: '文件大小',
      field: 'fileSize',
      type: 'input'
    }
  ]
})

const ruleTreeRef = ref(null)

const rules = ref({
  userBehavior: [
    { validator: isNotEmpty, trigger: 'change' }
  ],

  fileSize: [
    { validator: isNotEmpty, trigger: 'blur' }
  ],
  operType: [
    {
      validator: (rule, value, callback) => {
        if (value.length <= 1) callback(new Error('长度需要大于 1'))
        return callback()
      },
      trigger: 'blur'
    }
  ]
})

const formData = ref({})

const validate = async () => {
  ruleTreeRef.value.validate((valid) => {
    if (valid) return ElMessage.success('校验通过')
    return ElMessage.error('校验失败')
  })
}
</script>
<style lang="scss" scoped></style>
