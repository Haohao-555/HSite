<template>
  <div class="transfer-page">
    <adminTitle title="组织对象树" />
    <el-form :model="form" ref="formRef" :rules="rules">
      <el-form-item label="对象范围" prop="objRange">
        <SelectObjRange v-model="form.objRange" />
      </el-form-item>
      <el-item-item>
        <el-button @click="sumbit" type="primary">提交</el-button>
      </el-item-item>
    </el-form>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import SelectObjRange from '@/components/SelectObjRange'
import { ElMessage } from 'element-plus'
const formRef = ref(null)
const form = ref({
  objRange: []
})
const isNotEmpty = (rule, value, callback) => {
  if (value.length > 0) return callback()
  return callback(new Error('不能为空'))
}

const rules = ref({
  objRange: [
    { validator: isNotEmpty, trigger: 'change' }
  ]
})
const sumbit = () => {
  formRef.value.validate((valid) => {
    if (valid) return ElMessage.success('校验通过')
    return ElMessage.error('校验失败')
  })
}
</script>
<style lang="scss" scoped></style>
