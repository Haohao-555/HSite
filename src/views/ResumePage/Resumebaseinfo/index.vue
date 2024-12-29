<template>
  <div class="resume_page">
    <div class="title_container">
      <adminTitle title="基本信息" />
      <el-button v-if="isShowAddBtn" size="small" type="warning" @click="addInfo">新增</el-button>
    </div>
    <el-form v-if="!isShowAddBtn" :model="baseForm" size="small" ref="baseFormRef" label-width="80px"
      label-position="right" :disabled="disabled">
      <el-form-item label="姓名" prop="name">
        <el-input v-model="baseForm.name"></el-input>
      </el-form-item>
      <el-form-item label="出生年月" prop="birthday">
        <el-input v-model="baseForm.birthday"></el-input>
      </el-form-item>
      <el-form-item label="求职岗位" prop="work">
        <el-input v-model="baseForm.work"></el-input>
      </el-form-item>
      <el-form-item label="手机号码" prop="phone">
        <el-input v-model="baseForm.phone"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="baseForm.email"></el-input>
      </el-form-item>
      <el-form-item label="个人博客" prop="blog">
        <el-input v-model="baseForm.blog"></el-input>
      </el-form-item>
      <el-form-item label="Github" prop="github">
        <el-input v-model="baseForm.github"></el-input>
      </el-form-item>
    </el-form>
    <div class="btn-group" v-if="!isShowAddBtn">
      <el-button type="primary" size="small" @click="sumbit">{{
        disabled ? '编辑' : '提交'
      }}</el-button>
      <el-button @click="cancel" size="small">取消</el-button>
    </div>
  </div>
</template>
<script setup>
import { onMounted, ref } from 'vue'
import { saveResumBase, getResumeBase, updateResumeBase } from '@/api/admin'
import { ElMessage } from 'element-plus'

// 基本信息
const baseForm = ref()
const isShowAddBtn = ref(true)
const disabled = ref(true)

const getInfo = async () => {
  const res = await getResumeBase()
  console.log(res, 'getInfo')
  isShowAddBtn.value = res.data.count <= 0
  if (res.data.count > 0) {
    baseForm.value = res.data.rows[0]
    console.log(baseForm.value, res)
  }
}
const addInfo = () => {
  baseForm.value = {
    isAdd: true,
    name: '', // 姓名
    birthday: '', // 出生年月
    work: '', // 求职岗位
    phone: '', // 手机号码
    email: '', // 邮箱
    blog: '', // 个人博客
    github: '' // Github
  }
  isShowAddBtn.value = false
  disabled.value = false
}

const cancel = () => {
  if (baseForm.value.isAdd) {
    baseForm.value = {}
    isShowAddBtn.value = true
  } else {
    disabled.value = true
  }
  getInfo()
}
const sumbit = async () => {
  if (disabled.value) {
    disabled.value = false
  } else {
    if (baseForm.value.isAdd) {
      await saveResumBase(baseForm.value)
      ElMessage.success('新增成功')
    } else {
      const res = await updateResumeBase(baseForm.value)
      if (res.updateResumeBases) {
        ElMessage.success('更新成功')
      }
      getInfo()
    }

    disabled.value = true
  }
}
onMounted(() => {
  getInfo()
})
</script>
<style lang="scss" scoped>
.resume_page {
  padding-right: 12px;
  padding-bottom: 12px;
  box-sizing: border-box;
  height: calc(100vh - 120px);

  .btn-group {
    display: flex;
    justify-content: end;
  }

  .title_container {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
