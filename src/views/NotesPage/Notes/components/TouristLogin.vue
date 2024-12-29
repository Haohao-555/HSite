<template>
  <el-form :model="form" size="small" @submit.prevent="onSubmit">
    <el-form-item label="密钥">
      <el-input v-model="form.token" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit" size="small">登录</el-button>
    </el-form-item>
  </el-form>
</template>
<script setup>
import { reactive, defineEmits } from 'vue'
const form = reactive({
  token: ''
})
const emits = defineEmits(['sumbit'])

const onSubmit = () => {
  const params = {
    token: form.token
  }
  emits('sumbit', params)
}
</script>
<style lang="scss" scoped></style>
