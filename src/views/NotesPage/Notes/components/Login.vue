<template>
  <el-form :model="form" size="small" @submit.prevent="onSubmit">
    <el-form-item label="账号">
      <el-input v-model="form.account" @keyup.enter="onSubmit()" />
    </el-form-item>
    <el-form-item label="密码">
      <el-input v-model="form.password" type="password" @keyup.enter="onSubmit()" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit()" size="small">登录</el-button>
    </el-form-item>
  </el-form>
</template>
<script setup>
import { reactive, defineEmits } from 'vue'

const emits = defineEmits(['submit'])
const form = reactive({
  account: '',
  password: ''
})

const onSubmit = () => {
  const params = {
    account: form.account,
    password: form.password
  }
  emits('submit', params)
}
</script>
<style lang="scss"></style>
