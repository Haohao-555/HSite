<template>
  <div class="eductional-page">
    <adminTitle title="教育背景">
      <template #default>
        <el-button size="small" type="warning" @click="addEduc">新增</el-button>
      </template>
    </adminTitle>
    <div class="educational_item" v-for="(edu, i) in educationalList" :key="i">
      <div style="display: flex; justify-content: end; margin: 12px 0px; gap: 6px">
        <el-tag v-if="edu.isEdit" type="success">{{
          edu.isHidden ? '已隐藏' : '已展示'
        }}</el-tag>
        <el-button v-if="edu.isEdit" type="danger" @click="delResumeEduc(edu.id)" size="small">删除</el-button>
      </div>
      <el-form :model="edu" size="small" label-position="right" label-width="80px" :disabled="edu.disabled">
        <el-form-item label="起始日期" prop="startTime">
          <el-input v-model="edu.startTime"></el-input>
        </el-form-item>
        <el-form-item label="结束日期" prop="endTime">
          <el-input v-model="edu.endTime"></el-input>
        </el-form-item>
        <el-form-item label="学校" prop="school">
          <el-input v-model="edu.school"></el-input>
        </el-form-item>
        <el-form-item label="专业" prop="major">
          <el-input v-model="edu.major"></el-input>
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <el-input v-model="edu.content" type="textarea" :row="8"></el-input>
        </el-form-item>
      </el-form>
      <div class="btn-group">
        <el-button v-if="edu.isEdit" @click="changeEduState(edu)" size="small">切换状态</el-button>
        <el-button type="primary" size="small" @click="sumbit(edu)">{{
          edu.disabled ? '编辑' : '提交'
        }}</el-button>
        <el-button @click="cancel(edu)" size="small">取消</el-button>
      </div>
      <el-divider content-position="right">end</el-divider>
    </div>
  </div>
</template>
<script setup>
import {
  getResumeEduc,
  saveResumeEduc,
  updateResumeEduc,
  deleteResumeEduc
} from '@/api/admin'
import { ElMessage } from 'element-plus'

import { onMounted, ref } from 'vue'
// 教育背景
const educationalList = ref([])

const addEduc = () => {
  educationalList.value.push({
    disabled: false,
    isEdit: false,
    isHidden: false,
    startTime: '', // 起始日期
    endTime: '', // 结束日期
    school: '', // 学校
    major: '', // 专业
    content: '' // 内容（支持 html）
  })
}

const changeEduState = async (edu) => {
  edu.isHidden = !edu.isHidden
  await updateResumeEduc(edu)
  ElMessage.success('编辑成功')
  getEducList()
}

const getEducList = async () => {
  const res = await getResumeEduc()
  educationalList.value = res.data.rows.map((item) => {
    item.disabled = true
    item.isEdit = true
    return item
  })
}

const delResumeEduc = (id) => {
  deleteResumeEduc({ id })
  ElMessage.success('删除成功')

  getEducList()
}
const cancel = (edu) => {
  if (edu.isEdit) {
    edu.disabled = true
  } else {
    const i = educationalList.value.findIndex((item) => !item.isEdit)
    if (i) educationalList.value.splice(i, 1)
  }
}

const sumbit = async (edu) => {
  if (edu.disabled) {
    edu.disabled = false
  } else {
    if (edu.isEdit) {
      // 编辑
      await updateResumeEduc(edu)
      ElMessage.success('编辑成功')
    } else {
      // 创建
      await saveResumeEduc(edu)
      ElMessage.success('创建成功')
    }
    getEducList()
  }
}

onMounted(() => {
  getEducList()
})
</script>
<style lang="scss" scoped>
.eductional-page {
  padding-right: 12px;
  height: calc(100vh - 120px);
}

.btn-group {
  display: flex;
  justify-content: end;
}
</style>
