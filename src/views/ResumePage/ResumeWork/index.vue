<template>
  <div class="work-page">
    <adminTitle title="工作经验">
      <template #default>
        <el-button size="small" type="warning" @click="addWork">新增</el-button>
      </template>
    </adminTitle>
    <div class="work_item" v-for="(work, i) in workList" :key="i">
      <el-form :model="work" size="small" label-position="right" label-width="80px" :disabled="work.disabled">
        <el-form-item label="起始日期" prop="startTime">
          <el-input v-model="work.startTime"></el-input>
        </el-form-item>
        <el-form-item label="结束日期" prop="endTime">
          <el-input v-model="work.endTime"></el-input>
        </el-form-item>
        <el-form-item label="公司" prop="company">
          <el-input v-model="work.company"></el-input>
        </el-form-item>
        <el-form-item label="岗位" prop="work">
          <el-input v-model="work.work"></el-input>
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <el-input v-model="work.content" type="textarea" :rows="10"></el-input>
        </el-form-item>
      </el-form>
      <div class="btn-group">
        <el-button v-if="work.isEdit" type="danger" @click="delResumeWork(work.id)" size="small">删除</el-button>
        <el-button type="primary" @click="sumbit(work)" size="small">{{
          work.disabled ? '编辑' : '提交'
        }}</el-button>
        <el-button @click="cancel(work)" size="small">取消</el-button>
      </div>
      <el-divider content-position="right">end</el-divider>
    </div>
  </div>
</template>
<script setup>
import { onMounted, ref } from 'vue'
import {
  getResumeWork,
  saveResumeWork,
  updateResumeWork,
  deleteResumeWork
} from '@/api/admin'
import { ElMessage } from 'element-plus'

// 工作经验
const workList = ref([])

const getResumeWorkList = async () => {
  const res = await getResumeWork()
  workList.value = res.data.rows.map((item) => {
    item.disabled = true
    item.isEdit = true
    return item
  })
}

const addWork = async () => {
  workList.value.push({
    disabled: false,
    isEdit: false,
    isHidden: false,
    startTime: '', // 起始日期
    endTime: '', // 结束日期
    company: '', // 公司
    work: '', // 岗位
    content: '' // 内容 （支持  html）
  })
}

const cancel = (work) => {
  if (work.isEdit) {
    work.disabled = true
  } else {
    const i = workList.value.findIndex((item) => !item.isEdit)
    if (i) workList.value.splice(i, 1)
  }
}

const sumbit = async (work) => {
  if (work.disabled) {
    work.disabled = false
  } else {
    if (work.isEdit) {
      // 编辑
      await updateResumeWork(work)
      ElMessage.success('编辑成功')
    } else {
      // 创建
      await saveResumeWork(work)
      ElMessage.success('创建成功')
    }
    getResumeWorkList()
  }
}

const delResumeWork = async (id) => {
  await deleteResumeWork({ id })
  ElMessage.success('删除成功')
  getResumeWorkList()
}
onMounted(() => {
  getResumeWorkList()
})
</script>
<style lang="scss" scoped>
.btn-group {
  display: flex;
  justify-content: end;
}
</style>
