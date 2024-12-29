<template>
  <el-dialog title="添加账号" v-model="showDialog" draggable>
    <el-form ref="formRef" :model="form" :rules="rules">
      <el-form-item label="账号" prop="account">
        <el-input v-model="form.account"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="form.password"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="showDialog = false">取消</el-button>
      <el-button type="primary" @click="submit">确定</el-button>
    </template>
  </el-dialog>
</template>
<script setup>
import { defineExpose, defineEmits, ref } from 'vue'

const emits = defineEmits(['submit'])
const showDialog = ref(false)
const formRef = ref(null)

const form = ref({
  account: '',
  password: ''
})
const rules = ref({
  account: {
    required: true,
    trigger: 'blur',
    message: '不能为空'
  },
  password: {
    required: true,
    trigger: 'blur',
    message: '不能为空'
  }
})
const submit = () => {
  formRef.value.validate(async (valid) => {
    if (!valid) return
    emits('submit', {
      account: form.value.account,
      password: form.value.password
    })
    form.value = {
      account: '',
      password: ''
    }
    showDialog.value = false
  })
}
const show = () => {
  showDialog.value = true
}

defineExpose({
  show
})
</script>
